import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../../services/emailService';

const prisma = new PrismaClient();

export class AdminController {
  // Récupérer tous les utilisateurs avec statut KYC
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          profilePicture: true,
          profileDescription: true,
          profileUrl: true,
          profileVisibility: true,
          language: true,
          // 🔐 Informations KYC (sans documents sensibles)
          kycVerification: {
            select: {
              verificationStatus: true,
              riskScore: true,
              verificationDate: true,
              expiryDate: true,
              rejectionReason: true,
              createdAt: true,
            }
          },
          amlCheck: {
            select: {
              riskLevel: true,
              ofacStatus: true,
              unStatus: true,
              suspiciousActivity: true,
              lastCheckDate: true,
            }
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(users);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
  }

  // Récupérer un utilisateur par ID
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isActive: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          profilePicture: true,
          profileDescription: true,
          profileUrl: true,
          profileVisibility: true,
          language: true,
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      res.json(user);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
    }
  }

  // Mettre à jour le statut d'un utilisateur
  async updateUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, isActive, isVerified } = req.body;

      // Récupérer l'utilisateur avant modification pour comparer
      const userBeforeUpdate = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isActive: true,
          isVerified: true,
        }
      });

      if (!userBeforeUpdate) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (isVerified !== undefined) updateData.isVerified = isVerified;

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isActive: true,
          isVerified: true,
          updatedAt: true,
        }
      });

      // 📧 Envoyer un email de notification à l'utilisateur
      try {
        const modifications: any = {};
        
        if (status !== undefined && status !== userBeforeUpdate.status) {
          modifications.status = { old: userBeforeUpdate.status, new: status };
        }
        if (isActive !== undefined && isActive !== userBeforeUpdate.isActive) {
          modifications.isActive = { old: userBeforeUpdate.isActive, new: isActive };
        }
        if (isVerified !== undefined && isVerified !== userBeforeUpdate.isVerified) {
          modifications.isVerified = { old: userBeforeUpdate.isVerified, new: isVerified };
        }

        // Envoyer l'email seulement s'il y a des modifications
        if (Object.keys(modifications).length > 0) {
          await EmailService.sendUserModificationEmail(
            user.email,
            user.firstName,
            user.lastName,
            modifications
          );
          console.log(`✅ Email de notification de modification envoyé à ${user.email}`);
        }
      } catch (emailError) {
        console.error(`⚠️ Erreur lors de l'envoi de l'email de notification à ${user.email}:`, emailError);
        // Ne pas bloquer la mise à jour si l'email échoue
      }

      res.json(user);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
    }
  }

  // 🔐 Approuver un utilisateur basé sur son statut KYC
  async approveUserKYC(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Vérifier le statut KYC de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          kycVerification: true,
          amlCheck: true,
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Vérifier que l'utilisateur a un KYC vérifié
      if (!user.kycVerification || user.kycVerification.verificationStatus !== 'VERIFIED') {
        return res.status(400).json({ 
          message: 'L\'utilisateur doit avoir un KYC vérifié pour être approuvé',
          kycStatus: user.kycVerification?.verificationStatus || 'NO_KYC'
        });
      }

      // Vérifier le niveau de risque AML
      if (user.amlCheck && user.amlCheck.riskLevel === 'BLOCKED') {
        return res.status(400).json({ 
          message: 'L\'utilisateur a un niveau de risque AML trop élevé',
          amlRiskLevel: user.amlCheck.riskLevel
        });
      }

      // Approuver l'utilisateur
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          status: 'ACTIVE',  // ✅ Statut ACTIVE après approbation admin
          isActive: true,
          isVerified: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isActive: true,
          isVerified: true,
          updatedAt: true,
        }
      });

      // Créer un log d'audit
      await prisma.kYCAuditLog.create({
        data: {
          userId: id,
          action: 'ACCOUNT_APPROVED',
          details: `Compte approuvé par l'admin - KYC: ${user.kycVerification.verificationStatus}, AML: ${user.amlCheck?.riskLevel || 'N/A'}`,
          adminId: req.user?.id,
        }
      });

      // 📧 Envoyer un email d'approbation à l'utilisateur
      try {
        await EmailService.sendKYCApprovalEmail(
          user.email,
          user.firstName,
          user.lastName
        );
        console.log(`✅ Email d'approbation KYC envoyé à ${user.email}`);
      } catch (emailError) {
        console.error(`⚠️ Erreur lors de l'envoi de l'email d'approbation à ${user.email}:`, emailError);
        // Ne pas bloquer l'approbation si l'email échoue
      }

      res.json(updatedUser);
    } catch (error) {
      console.error('Erreur lors de l\'approbation KYC:', error);
      res.status(500).json({ message: 'Erreur lors de l\'approbation KYC' });
    }
  }

  // Mettre à jour le rôle d'un utilisateur
  async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || !['USER', 'ADMIN', 'MODERATOR', 'SUPPORT'].includes(role)) {
        return res.status(400).json({ message: 'Rôle invalide' });
      }

      // Récupérer l'utilisateur avant modification pour comparer
      const userBeforeUpdate = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        }
      });

      if (!userBeforeUpdate) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Vérifier si le rôle a vraiment changé
      if (userBeforeUpdate.role === role) {
        return res.status(400).json({ message: 'Le rôle est déjà défini à cette valeur' });
      }

      const user = await prisma.user.update({
        where: { id },
        data: { role },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          updatedAt: true,
        }
      });

      // 📧 Envoyer un email de notification à l'utilisateur
      try {
        const modifications = {
          role: { old: userBeforeUpdate.role, new: role }
        };

        await EmailService.sendUserModificationEmail(
          user.email,
          user.firstName,
          user.lastName,
          modifications
        );
        console.log(`✅ Email de notification de modification de rôle envoyé à ${user.email}`);
      } catch (emailError) {
        console.error(`⚠️ Erreur lors de l'envoi de l'email de notification à ${user.email}:`, emailError);
        // Ne pas bloquer la mise à jour si l'email échoue
      }

      res.json(user);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle' });
    }
  }

  // Suspendre un utilisateur
  async suspendUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.update({
        where: { id },
        data: {
          status: 'SUSPENDED',
          isActive: false,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isActive: true,
          updatedAt: true,
        }
      });

      // 📧 Envoyer un email de suspension à l'utilisateur
      try {
        await EmailService.sendSuspensionEmail(
          user.email,
          user.firstName,
          user.lastName
        );
        console.log(`✅ Email de suspension envoyé à ${user.email}`);
      } catch (emailError) {
        console.error(`⚠️ Erreur lors de l'envoi de l'email de suspension à ${user.email}:`, emailError);
        // Ne pas bloquer la suspension si l'email échoue
      }

      res.json(user);
    } catch (error) {
      console.error('Erreur lors de la suspension de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur lors de la suspension de l\'utilisateur' });
    }
  }

  // Bloquer un utilisateur (utilise SUSPENDED car BLOCKED n'existe pas dans le schéma)
  async blockUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await prisma.user.update({
        where: { id },
        data: {
          status: 'SUSPENDED',
          isActive: false,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          isActive: true,
          updatedAt: true,
        }
      });

      res.json(user);
    } catch (error) {
      console.error('Erreur lors du blocage de l\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur lors du blocage de l\'utilisateur' });
    }
  }

  // Supprimer un utilisateur
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Vérifier que l'utilisateur existe
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // 🔐 Suppression sécurisée avec gestion des relations
      await prisma.$transaction(async (tx) => {
        // 1. Supprimer d'abord les données KYC/AML
        await tx.kYCVerification.deleteMany({
          where: { userId: id }
        });

        await tx.aMLCheck.deleteMany({
          where: { userId: id }
        });

        // 2. Supprimer les logs d'audit KYC
        await tx.kYCAuditLog.deleteMany({
          where: { userId: id }
        });

        // 3. Supprimer l'utilisateur
        await tx.user.delete({
          where: { id }
        });
      });

      res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      
      // 🔍 Log détaillé de l'erreur pour le débogage
      if (error instanceof Error) {
        console.error('Détails de l\'erreur:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      
      res.status(500).json({ 
        message: 'Erreur lors de la suppression de l\'utilisateur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  // Obtenir les statistiques des utilisateurs
  async getUserStats(req: Request, res: Response) {
    try {
      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({ where: { isActive: true } });
      const verifiedUsers = await prisma.user.count({ where: { isVerified: true } });
      const pendingUsers = await prisma.user.count({ where: { status: 'PENDING' } });
      const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } });

      const stats = {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        pending: pendingUsers,
        admins: adminUsers,
        inactive: totalUsers - activeUsers,
        unverified: totalUsers - verifiedUsers
      };

      res.json(stats);
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
    }
  }
} 