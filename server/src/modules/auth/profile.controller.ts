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
          language: true,
          createdAt: true,
          // 🔐 AJOUTER LE STATUT DU COMPTE
          status: true,
          isVerified: true,
          isActive: true,
          role: true,
          // 🔍 AJOUTER LES DONNÉES KYC
          kycVerification: {
            select: {
              verificationStatus: true,
              riskScore: true,
              verificationDate: true,
              documentType: true,
              rejectionReason: true
            }
          },
          amlCheck: {
            select: {
              riskLevel: true,
              lastCheckDate: true
            }
          }
        }
      });

      if (!user) {
        console.log('❌ Utilisateur non trouvé:', userId);
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // 🔧 DÉSACTIVÉ : Logique de nettoyage agressif des photos
      let profilePicture = user.profilePicture;
      
      console.log('🔧 NETTOYAGE COMPLÈTEMENT DÉSACTIVÉ - Photos conservées telles quelles');
      console.log('📸 Photo de profil actuelle:', profilePicture);

      console.log('✅ Profil récupéré avec SUCCÈS:', { 
        ...user, 
        profilePicture,
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
          phone: user.phone,
          // birthday: user.birthday, // Champ non disponible dans le schéma actuel
          language: user.language,
          // 🔐 AJOUTER LE STATUT DU COMPTE
          status: user.status,
          isVerified: user.isVerified,
          isActive: user.isActive,
          role: user.role,
          // 🔍 AJOUTER LES DONNÉES KYC
          kycVerification: user.kycVerification,
          amlCheck: user.amlCheck
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
        // 🔧 CORRECTION : profileVisibility reste une string, pas un boolean
        updateData.profileVisibility = profileVisibility;
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
        // 🔧 CORRECTION : Gestion intelligente des dates
        if (birthday === '' || birthday === null) {
          updateData.birthday = null;
        } else if (birthday instanceof Date) {
          updateData.birthday = birthday;
        } else if (typeof birthday === 'string' && birthday.trim() !== '') {
          // Essayer de parser la date
          const parsedDate = new Date(birthday);
          if (!isNaN(parsedDate.getTime())) {
            updateData.birthday = parsedDate;
          } else {
            console.warn('⚠️ Date invalide ignorée:', birthday);
          }
        }
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

      // 🔧 CORRECTION : Log détaillé avant la mise à jour
      console.log('📊 Tentative de mise à jour avec Prisma:', {
        userId,
        updateData,
        dataTypes: Object.entries(updateData).map(([key, value]) => ({
          key,
          value,
          type: typeof value,
          isDate: value instanceof Date
        }))
      });

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
            birthday: true, // ✅ Champ birthday maintenant disponible en base
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
          phone: updatedProfile.phone,
          birthday: updatedProfile.birthday, // ✅ Champ birthday maintenant disponible en base
          language: updatedProfile.language,
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