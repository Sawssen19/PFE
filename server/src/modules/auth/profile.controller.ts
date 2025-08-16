import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (jpeg, jpg, png, gif)'));
    }
  }
});

export class ProfileController {
  async getProfile(req: Request, res: Response) {
    try {
      // 🔧 CORRECTION : Utiliser l'ID de l'utilisateur connecté depuis le token JWT
      const userId = (req as any).user?.id || req.params.userId;
      
      console.log('📋 Récupération du profil pour l\'utilisateur:', userId);
      console.log('🔍 Source de l\'ID:', (req as any).user?.id ? 'JWT Token' : 'URL Params');
      console.log('🔍 req.user complet:', (req as any).user);

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profileVisibility: true,
          profileDescription: true,
          profileUrl: true,
          profilePicture: true,
          phone: true,
          birthday: true,
          language: true,
          createdAt: true,
        }
      });

      if (!user) {
        console.log('❌ Utilisateur non trouvé:', userId);
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // LOGIQUE ULTRA-AGRESSIVE : TOUJOURS nettoyer les photos pour les nouveaux utilisateurs
      let profilePicture = user.profilePicture;
      let shouldCleanPhoto = false;
      let reason = '';
      
      // 1. Vérifier si c'est un nouvel utilisateur (moins de 24h)
      const isNewUser = Date.now() - user.createdAt.getTime() < 24 * 60 * 60 * 1000;
      
      // 2. LOGIQUE INTELLIGENTE : Ne nettoyer que si c'est suspect
      if (isNewUser && profilePicture !== null) {
        // Vérifier si la photo est réellement suspecte
        const suspiciousPatterns = [
          'default-avatar',
          'placeholder',
          'anonymous',
          'unknown',
          'temp',
          'old',
          'previous'
        ];
        
        const isSuspicious = suspiciousPatterns.some(pattern => 
          profilePicture!.toLowerCase().includes(pattern)
        );
        
        const hasValidExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(profilePicture);
        const seemsLikeOtherUser = profilePicture.includes('profile-') && !profilePicture.includes(userId);
        
        if (isSuspicious || !hasValidExtension || seemsLikeOtherUser) {
          shouldCleanPhoto = true;
          reason = 'Nouvel utilisateur avec photo suspecte';
          console.log('🆕 NOUVEL UTILISATEUR DÉTECTÉ - Photo suspecte identifiée');
        } else {
          console.log('🆕 NOUVEL UTILISATEUR DÉTECTÉ - Photo valide, pas de nettoyage nécessaire');
        }
      }
      
      // 3. Vérifications supplémentaires même pour les anciens utilisateurs
      if (profilePicture && !shouldCleanPhoto) {
        // Photos qui ne devraient jamais être affichées
        const suspiciousPatterns = [
          'default-avatar',
          'placeholder',
          'anonymous',
          'unknown',
          'temp',
          'old',
          'previous'
        ];
        
        const isSuspicious = suspiciousPatterns.some(pattern => 
          profilePicture!.toLowerCase().includes(pattern)
        );
        
        // Vérifier le format
        const hasValidExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(profilePicture);
        
        // Vérifier si la photo semble être d'un autre utilisateur
        const seemsLikeOtherUser = profilePicture.includes('profile-') && 
                                  !profilePicture.includes(userId);
        
        if (isSuspicious || !hasValidExtension || seemsLikeOtherUser) {
          shouldCleanPhoto = true;
          reason = `Photo suspecte: isSuspicious=${isSuspicious}, hasValidExtension=${hasValidExtension}, seemsLikeOtherUser=${seemsLikeOtherUser}`;
        }
      }
      
      // 4. NETTOYAGE AGGRESSIF
      if (shouldCleanPhoto) {
        console.log('🚨 NETTOYAGE AGGRESSIF:', {
          userId,
          reason,
          currentPhoto: profilePicture,
          isNewUser
        });
        
        try {
          // Forcer la suppression de la photo
          await prisma.user.update({
            where: { id: userId },
            data: { profilePicture: null }
          });
          
          profilePicture = null;
          console.log('✅ Photo nettoyée avec succès');
          
          // VÉRIFICATION POST-NETTOYAGE
          const verificationUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { profilePicture: true }
          });
          
          if (verificationUser?.profilePicture !== null) {
            console.error('❌ ÉCHEC: La photo n\'a pas été supprimée!');
            // Dernière tentative
            await prisma.user.update({
              where: { id: userId },
              data: { profilePicture: null }
            });
            profilePicture = null;
          }
          
        } catch (cleanupError) {
          console.error('❌ Erreur lors du nettoyage:', cleanupError);
          // En cas d'erreur, forcer profilePicture à null dans la réponse
          profilePicture = null;
        }
      }

      console.log('✅ Profil récupéré avec SUCCÈS:', { 
        ...user, 
        profilePicture,
        isNewUser,
        shouldCleanPhoto,
        reason,
        finalPhoto: profilePicture
      });

      res.json({
        success: true,
        data: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profileVisibility: user.profileVisibility,
          profileDescription: user.profileDescription,
          profileUrl: user.profileUrl,
          profilePicture: profilePicture, // TOUJOUR null si suspect ou nouveau
        }
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du profil:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const { firstName, lastName, profileVisibility, profileDescription, profileUrl, phone, birthday, language } = req.body;

      console.log('📝 Données reçues pour mise à jour du profil:', {
        userId,
        firstName,
        lastName,
        profileVisibility,
        profileDescription,
        profileUrl
      });

      // Vérifier que l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        console.log('❌ Utilisateur non trouvé:', userId);
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // 🔧 VALIDATION INTELLIGENTE : Préparer les données de mise à jour
      const updateData: any = {};
      
      // Validation des champs avec gestion des valeurs vides et null
      if (firstName !== undefined && firstName !== null && firstName.trim() !== '') {
        updateData.firstName = firstName.trim();
      }
      
      if (lastName !== undefined && lastName !== null && lastName.trim() !== '') {
        updateData.lastName = lastName.trim();
      }
      
      if (profileVisibility !== undefined) {
        updateData.profileVisibility = Boolean(profileVisibility);
      }
      
      if (profileDescription !== undefined) {
        // Permettre les chaînes vides et null
        updateData.profileDescription = profileDescription === '' ? null : profileDescription;
      }
      
      if (profileUrl !== undefined) {
        // Permettre les chaînes vides et null
        updateData.profileUrl = profileUrl === '' ? null : profileUrl;
      }
      
      if (phone !== undefined) {
        // Permettre les chaînes vides et null
        updateData.phone = phone === '' ? null : phone;
      }
      
      if (birthday !== undefined) {
        // Permettre les chaînes vides et null
        updateData.birthday = birthday === '' ? null : birthday;
      }
      
      if (language !== undefined && language !== null && language.trim() !== '') {
        updateData.language = language.trim();
      }

      console.log('🔄 Données de mise à jour validées:', updateData);

      // Vérifier qu'il y a des données à mettre à jour
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ 
          message: 'Aucune donnée valide à mettre à jour' 
        });
      }

      // Mettre à jour le profil avec gestion d'erreur détaillée
      let updatedProfile;
      try {
        updatedProfile = await prisma.user.update({
          where: { id: userId },
          data: updateData,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profileVisibility: true,
            profileDescription: true,
            profileUrl: true,
            profilePicture: true,
            phone: true,
            birthday: true,
            language: true,
          }
        });
      } catch (prismaError: any) {
        console.error('❌ Erreur Prisma lors de la mise à jour:', prismaError);
        
        // Gestion spécifique des erreurs Prisma
        if (prismaError.code === 'P2002') {
          return res.status(400).json({ 
            message: 'Une contrainte unique a été violée' 
          });
        }
        
        if (prismaError.code === 'P2025') {
          return res.status(404).json({ 
            message: 'Utilisateur non trouvé lors de la mise à jour' 
          });
        }
        
        throw prismaError; // Relancer l'erreur pour le catch général
      }

      console.log('✅ Profil mis à jour avec succès:', updatedProfile);

      res.json({
        success: true,
        data: {
          id: updatedProfile.id,
          firstName: updatedProfile.firstName,
          lastName: updatedProfile.lastName,
          email: updatedProfile.email,
          profileVisibility: updatedProfile.profileVisibility,
          profileDescription: updatedProfile.profileDescription,
          profileUrl: updatedProfile.profileUrl,
          profilePicture: updatedProfile.profilePicture,
        }
      });
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
      
      // Log détaillé de l'erreur pour le débogage
      if (error instanceof Error) {
        console.error('Message d\'erreur:', error.message);
        console.error('Stack trace:', error.stack);
      }
      
      res.status(500).json({ 
        message: 'Erreur interne du serveur lors de la mise à jour du profil',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      });
    }
  }

  async uploadProfilePicture(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      
      console.log('📸 Upload de photo de profil pour l\'utilisateur:', userId);
      
      // Utiliser multer pour gérer l'upload
      upload.single('profilePicture')(req, res, async (err) => {
        if (err) {
          console.error('❌ Erreur multer:', err);
          return res.status(400).json({ 
            message: err.message || 'Erreur lors de l\'upload du fichier' 
          });
        }

        if (!req.file) {
          return res.status(400).json({ message: 'Aucun fichier fourni' });
        }

        try {
          // Générer l'URL de l'image
          const imageUrl = `/uploads/${req.file.filename}`;
          
          console.log('📁 Fichier uploadé:', req.file.filename);
          console.log('🔗 URL générée:', imageUrl);

          // Mettre à jour l'utilisateur avec la nouvelle photo
          const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { profilePicture: imageUrl },
            select: {
              id: true,
              profilePicture: true,
            }
          });

          console.log('✅ Photo de profil mise à jour:', updatedUser.profilePicture);

          res.json({
            success: true,
            data: { url: updatedUser.profilePicture }
          });
        } catch (dbError) {
          console.error('❌ Erreur base de données:', dbError);
          res.status(500).json({ message: 'Erreur lors de la mise à jour de la base de données' });
        }
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload de la photo:', error);
      res.status(500).json({ message: 'Erreur lors de l\'upload de la photo' });
    }
  }

  async deleteProfilePicture(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      
      console.log('🗑️ Suppression de photo de profil pour l\'utilisateur:', userId);
      
      await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: null }
      });

      console.log('✅ Photo de profil supprimée');

      res.json({ success: true, message: 'Photo de profil supprimée' });
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la photo:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de la photo' });
    }
  }
} 