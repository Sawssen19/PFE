import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { EmailService } from '../../services/emailService';
import crypto from 'crypto';

// 🔧 SECRET FIXE pour éviter les erreurs JWT
const JWT_SECRET = 'kollecta-super-secret-jwt-key-2025';

const prisma = new PrismaClient();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // 🔐 Générer un token de vérification unique (pour plus tard)
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

      // ✅ SOLUTION COMPLÈTE : Forcer TOUS les champs de profil à des valeurs par défaut
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          // 🔧 FORCER tous les champs de profil à des valeurs par défaut
          profilePicture: null,           // Pas de photo héritée
          profileUrl: null,               // Pas d'URL héritée
          profileDescription: null,       // Pas de description héritée
          profileVisibility: 'private',   // Visibilité par défaut (string) - maintenant aligné avec Prisma
          // 🔐 Champs de vérification d'email
          verificationToken,
          verificationExp,
          // ✅ Email de vérification requis
          isVerified: false,
          // Les autres champs utilisent les valeurs par défaut de Prisma
        },
      });

      // 📧 Envoyer l'email de vérification avec SendGrid
      try {
        await EmailService.sendVerificationEmail(email, firstName, verificationToken);
        console.log('📧 Email de vérification envoyé avec succès via SendGrid à:', email);
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi de l\'email de vérification:', emailError);
        // On continue même si l'email échoue
      }

      // 🔔 Envoyer un email de NOTIFICATION à l'admin (vous)
      try {
        await EmailService.sendAdminNotification(email, firstName, lastName);
        console.log('🔔 Email de notification admin envoyé avec succès à: sawssen.yazidi@sesame.com.tn');
      } catch (adminEmailError) {
        console.error('⚠️ Erreur lors de l\'envoi de l\'email de notification admin:', adminEmailError);
        // On continue même si l'email admin échoue
      }

      // 🔍 DÉBOGAGE COMPLET : Vérifier TOUS les champs après création
      console.log('🔍 NOUVEL UTILISATEUR CRÉÉ - Vérification complète:');
      console.log('  - ID:', user.id);
      console.log('  - Email:', user.email);
      console.log('  - profilePicture:', user.profilePicture, '(type:', typeof user.profilePicture, ')');
      console.log('  - profileUrl:', user.profileUrl, '(type:', typeof user.profileUrl, ')');
      console.log('  - profileDescription:', user.profileDescription, '(type:', typeof user.profileDescription, ')');
      console.log('  - profileVisibility:', user.profileVisibility, '(type:', typeof user.profileVisibility, ')');
      console.log('  - isClean:', user.profilePicture === null && user.profileUrl === null && user.profileDescription === null);
      
      // Vérifier si les valeurs correspondent à ce qu'on attend
      if (user.profilePicture !== null || user.profileUrl !== null || user.profileDescription !== null) {
        console.log('🚨 ALERTE: L\'utilisateur a des champs de profil non-null!');
        console.log('  - profilePicture attendu: null, reçu:', user.profilePicture);
        console.log('  - profileUrl attendu: null, reçu:', user.profileUrl);
        console.log('  - profileDescription attendu: null, reçu:', user.profileDescription);
      } else {
        console.log('✅ SUCCÈS: Tous les champs de profil sont null comme attendu');
      }

      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log('✅ Nouvel utilisateur créé avec SUCCÈS:', {
        id: user.id,
        email: user.email,
        profilePicture: user.profilePicture,
        isClean: user.profilePicture === null
      });

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified, // ✅ Maintenant true
            // ✅ UTILISER LES VRAIES VALEURS DE LA BASE DE DONNÉES
            profilePicture: user.profilePicture,
            profileUrl: user.profileUrl,
            profileDescription: user.profileDescription,
            profileVisibility: user.profileVisibility,
          },
          token
        }
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // 🚨 VÉRIFICATION : Bloquer UNIQUEMENT la connexion si une demande de SUPPRESSION est en cours
      console.log('🔍 Vérification des demandes de SUPPRESSION en cours pour:', email);
      
      try {
        const pendingDeletionRequest = await prisma.accountRequest.findFirst({
          where: {
            email: email,
            requestType: 'DELETION', // 🎯 SEULEMENT les demandes de SUPPRESSION
            status: 'PENDING'
          }
        });
        
        console.log('🔍 Résultat de la recherche de suppression:', pendingDeletionRequest);
        
        if (pendingDeletionRequest) {
          console.log('🚨 Demande de SUPPRESSION en cours trouvée:', pendingDeletionRequest);
          
          // ❌ SUPPRESSION : Bloquer complètement la connexion
          return res.status(403).json({ 
            success: false,
            message: `❌ Connexion bloquée : Ce compte a une demande de suppression en cours de traitement. L'équipe Kollecta va examiner votre demande et vous contactera dans les plus brefs délais.`,
            blocked: true,
            requestType: 'DELETION',
            submittedAt: pendingDeletionRequest.submittedAt
          });
        } else {
          console.log('✅ Aucune demande de SUPPRESSION en cours trouvée');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification des demandes de suppression:', error);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // 🔍 DÉBOGAGE LOGIN : Vérifier les champs de profil
      console.log('🔍 LOGIN - Vérification des champs de profil:');
      console.log('  - profilePicture:', user.profilePicture);
      console.log('  - profileUrl:', user.profileUrl);
      console.log('  - profileDescription:', user.profileDescription);
      console.log('  - profileVisibility:', user.profileVisibility);

      // 🎯 VÉRIFIER SI L'UTILISATEUR A UNE DEMANDE DE DÉSACTIVATION EN COURS
      let deactivationMessage = null;
      try {
        const deactivationRequest = await prisma.accountRequest.findFirst({
          where: {
            email: email,
            requestType: 'DEACTIVATION',
            status: 'PENDING'
          }
        });
        
        if (deactivationRequest) {
          deactivationMessage = `🎉 Nous sommes contents de votre retour ! Votre compte a une demande de désactivation en cours de traitement. L'équipe Kollecta va examiner votre demande et vous contactera dans les plus brefs délais.`;
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification de désactivation:', error);
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified,
            // 🔧 AJOUTER TOUS les champs de profil
            profilePicture: user.profilePicture,
            profileUrl: user.profileUrl,
            profileDescription: user.profileDescription,
            profileVisibility: user.profileVisibility,
          },
          token,
          // 🎯 MESSAGE SPÉCIAL POUR LES COMPTES DÉSACTIVÉS
          deactivationMessage
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'default-secret',
        { expiresIn: '1h' }
      );

      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExp: new Date(Date.now() + 3600000) // 1 heure
        }
      });

      res.json({ message: 'Instructions de réinitialisation envoyées par email' });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { userId: string };
      
      const user = await prisma.user.findUnique({
        where: { 
          id: decoded.userId,
          resetToken: token,
          resetTokenExp: { gt: new Date() }
        }
      });

      if (!user) {
        return res.status(400).json({ message: 'Token invalide ou expiré' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExp: null
        }
      });

      res.json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
  }

  // 🔐 Vérifier l'email avec le token
  async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ message: 'Token de vérification requis' });
      }

      // 🔍 Chercher l'utilisateur avec ce token
      const user = await prisma.user.findFirst({
        where: {
          verificationToken: token,
          verificationExp: {
            gt: new Date() // Token non expiré
          }
        }
      });

      if (!user) {
        return res.status(400).json({ 
          message: 'Token de vérification invalide ou expiré' 
        });
      }

      // ✅ Marquer l'email comme vérifié
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
          verificationToken: null, // Supprimer le token utilisé
          verificationExp: null
        }
      });

      console.log('✅ Email vérifié avec succès pour:', user.email);

      res.json({
        success: true,
        message: 'Email vérifié avec succès !'
      });
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      res.status(500).json({ message: 'Erreur lors de la vérification' });
    }
  }

  // 🔄 Renvoyer un nouveau code de vérification
  async resendVerification(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'Email requis' });
      }

      // 🔍 Chercher l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Cet email est déjà vérifié' });
      }

      // 🔐 Générer un nouveau token de vérification
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExp = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

      // 💾 Mettre à jour le token dans la base
      await prisma.user.update({
        where: { id: user.id },
        data: {
          verificationToken,
          verificationExp
        }
      });

      // 📧 Envoyer le nouvel email de vérification
      await EmailService.sendResendVerificationEmail(email, user.firstName, verificationToken);

      console.log('🔄 Nouveau code de vérification envoyé à:', email);

      res.json({
        success: true,
        message: 'Un nouveau code de vérification a été envoyé à votre email'
      });
    } catch (error) {
      console.error('Erreur lors du renvoi du code de vérification:', error);
      res.status(500).json({ message: 'Erreur lors de l\'envoi du code' });
    }
  }
}