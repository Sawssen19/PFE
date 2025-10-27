import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../../services/emailService';
import cagnottesService from '../cagnottes/cagnottes.service';

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

      // 🔔 Créer une notification d'approbation KYC
      try {
        await this.createUserApprovalNotification(user.id, user.firstName, user.lastName);
        console.log(`✅ Notification d'approbation KYC créée pour ${user.email}`);
      } catch (notificationError) {
        console.error(`⚠️ Erreur lors de la création de la notification d'approbation:`, notificationError);
        // Ne pas bloquer l'approbation si la notification échoue
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

  // 🔐 Récupérer toutes les cagnottes (pour l'admin)
  async getAllCagnottes(req: Request, res: Response) {
    try {
      const cagnottes = await prisma.cagnotte.findMany({
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: cagnottes,
        message: 'Toutes les cagnottes récupérées'
      });
    } catch (error) {
      console.error('Erreur récupération toutes les cagnottes:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la récupération de toutes les cagnottes' 
      });
    }
  }

  // 🔐 Gestion des cagnottes en attente de validation
  async getPendingCagnottes(req: Request, res: Response) {
    try {
      const cagnottes = await prisma.cagnotte.findMany({
        where: { status: 'PENDING' },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        },
        orderBy: { createdAt: 'asc' }
      });

      res.json({
        success: true,
        data: cagnottes,
        message: 'Cagnottes en attente récupérées'
      });
    } catch (error) {
      console.error('Erreur récupération cagnottes en attente:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la récupération des cagnottes en attente' 
      });
    }
  }

  // 🔐 Approuver une cagnotte
  async approveCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminId = (req as any).user?.id;

      const existingCagnotte = await prisma.cagnotte.findUnique({
        where: { id },
        select: { status: true, title: true, creator: { select: { email: true, firstName: true } } }
      });

      if (!existingCagnotte) {
        return res.status(404).json({ 
          success: false,
          message: 'Cagnotte non trouvée' 
        });
      }

      if (existingCagnotte.status !== 'PENDING' && existingCagnotte.status !== 'SUSPENDED') {
        return res.status(400).json({ 
          success: false,
          message: 'Seules les cagnottes en attente ou suspendues peuvent être approuvées' 
        });
      }

      const cagnotte = await prisma.cagnotte.update({
        where: { id },
        data: { status: 'ACTIVE' },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        }
      });

      // 📧 Envoyer notification email au créateur
      try {
        await cagnottesService.sendCagnotteStatusChangeEmail(id, existingCagnotte.status, 'ACTIVE');
        console.log(`✅ Email d'approbation envoyé au créateur: ${cagnotte.creator.email}`);
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi de l\'email d\'approbation:', emailError);
      }
      
      console.log(`✅ Cagnotte "${existingCagnotte.title}" approuvée par l'admin`);

      res.json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte approuvée avec succès'
      });
    } catch (error) {
      console.error('Erreur approbation cagnotte:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de l\'approbation de la cagnotte' 
      });
    }
  }

  // 🔐 Rejeter une cagnotte
  async rejectCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = (req as any).user?.id;

      const existingCagnotte = await prisma.cagnotte.findUnique({
        where: { id },
        select: { status: true, title: true, creator: { select: { email: true, firstName: true } } }
      });

      if (!existingCagnotte) {
        return res.status(404).json({ 
          success: false,
          message: 'Cagnotte non trouvée' 
        });
      }

      if (existingCagnotte.status !== 'PENDING' && existingCagnotte.status !== 'SUSPENDED') {
        return res.status(400).json({ 
          success: false,
          message: 'Seules les cagnottes en attente ou suspendues peuvent être rejetées' 
        });
      }

      const cagnotte = await prisma.cagnotte.update({
        where: { id },
        data: { status: 'REJECTED' },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        }
      });

      // 📧 Envoyer notification email au créateur avec la raison
      try {
        await cagnottesService.sendCagnotteStatusChangeEmail(id, existingCagnotte.status, 'REJECTED', reason);
        console.log(`✅ Email de rejet envoyé au créateur: ${cagnotte.creator.email}`);
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi de l\'email de rejet:', emailError);
      }
      
      console.log(`❌ Cagnotte "${existingCagnotte.title}" rejetée par l'admin. Raison: ${reason || 'Non spécifiée'}`);

      res.json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte rejetée'
      });
    } catch (error) {
      console.error('Erreur rejet cagnotte:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors du rejet de la cagnotte' 
      });
    }
  }

  // 🔐 Suspendre une cagnotte
  async suspendCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = (req as any).user?.id;

      const existingCagnotte = await prisma.cagnotte.findUnique({
        where: { id },
        select: { status: true, title: true, creator: { select: { email: true, firstName: true } } }
      });

      if (!existingCagnotte) {
        return res.status(404).json({ 
          success: false,
          message: 'Cagnotte non trouvée' 
        });
      }

      // Permettre la suspension même si déjà REJECTED (car on utilise REJECTED pour SUSPENDED)
      // if (existingCagnotte.status === 'REJECTED') {
      //   return res.status(400).json({ 
      //     success: false,
      //     message: 'Cette cagnotte est déjà rejetée/suspendue' 
      //   });
      // }

      const cagnotte = await prisma.cagnotte.update({
        where: { id },
        data: { 
          status: 'SUSPENDED' // Maintenant que SUSPENDED existe dans la DB
        },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        }
      });

      // 📧 Envoyer notification email au créateur avec la raison
      try {
        await cagnottesService.sendCagnotteStatusChangeEmail(id, existingCagnotte.status, 'SUSPENDED', reason);
        console.log(`✅ Email de suspension envoyé au créateur: ${cagnotte.creator.email}`);
      } catch (emailError) {
        console.error('⚠️ Erreur lors de l\'envoi de l\'email de suspension:', emailError);
      }
      
      console.log(`⏸️ Cagnotte "${existingCagnotte.title}" suspendue par l'admin. Raison: ${reason || 'Non spécifiée'}`);

      res.json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte suspendue avec succès'
      });
    } catch (error) {
      console.error('Erreur suspension cagnotte:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la suspension de la cagnotte' 
      });
    }
  }

  // 🔐 Supprimer une cagnotte
  async deleteCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminId = (req as any).user?.id;

      console.log(`🗑️ Tentative de suppression de cagnotte ${id} par admin ${adminId}`);

      const existingCagnotte = await prisma.cagnotte.findUnique({
        where: { id },
        select: { 
          id: true,
          title: true, 
          status: true,
          creator: { select: { email: true, firstName: true, lastName: true } } 
        }
      });

      if (!existingCagnotte) {
        return res.status(404).json({ 
          success: false,
          message: 'Cagnotte non trouvée' 
        });
      }

      console.log(`📋 Statut de la cagnotte: ${existingCagnotte.status}`);

      // Supprimer d'abord les notifications liées à cette cagnotte
      const notifications = await prisma.notification.findMany({
        where: {
          metadata: {
            path: ['cagnotteId'],
            equals: id
          }
        }
      });

      if (notifications.length > 0) {
        console.log(`🗑️ Suppression de ${notifications.length} notification(s) liée(s) à la cagnotte`);
        await prisma.notification.deleteMany({
          where: {
            id: { in: notifications.map(n => n.id) }
          }
        });
      }

      // Supprimer toutes les promesses liées à la cagnotte
      const promisesCount = await prisma.promise.count({
        where: { cagnotteId: id }
      });
      
      if (promisesCount > 0) {
        console.log(`🗑️ Suppression de ${promisesCount} promesse(s) liée(s) à la cagnotte`);
        await prisma.promise.deleteMany({
          where: { cagnotteId: id }
        });
      }

      // Supprimer tous les signalements liés à la cagnotte
      const reportsCount = await prisma.cagnotteReport.count({
        where: { cagnotteId: id }
      });

      if (reportsCount > 0) {
        console.log(`🗑️ Suppression de ${reportsCount} signalement(s) lié(s) à la cagnotte`);
        await prisma.cagnotteReport.deleteMany({
          where: { cagnotteId: id }
        });
      }

      // Enfin, supprimer la cagnotte elle-même
      await prisma.cagnotte.delete({
        where: { id }
      });

      console.log(`✅ Cagnotte "${existingCagnotte.title}" supprimée avec succès par l'admin`);

      res.json({
        success: true,
        message: 'Cagnotte supprimée avec succès'
      });
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la cagnotte:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la suppression de la cagnotte',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  // 🔐 Modifier une cagnotte (Admin)
  async updateCagnotte(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const adminId = (req as any).user?.id;
      const { title, story, goalAmount, category } = req.body;

      console.log('🔄 Admin modification cagnotte - ID:', id);
      console.log('🔄 Admin ID:', adminId);
      console.log('🔄 Données reçues:', { title, story, goalAmount, category });

      const existingCagnotte = await prisma.cagnotte.findUnique({
        where: { id },
        select: { title: true, creator: { select: { email: true, firstName: true } } }
      });

      if (!existingCagnotte) {
        return res.status(404).json({ 
          success: false,
          message: 'Cagnotte non trouvée' 
        });
      }

      // Préparer les données de mise à jour
      const updateData: any = {
        title,
        description: story,
        goalAmount: parseFloat(goalAmount)
      };

      // Gérer la catégorie si elle est fournie
      if (category) {
        updateData.category = {
          connect: {
            name: category
          }
        };
      }

      const cagnotte = await prisma.cagnotte.update({
        where: { id },
        data: updateData,
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profilePicture: true
            }
          },
          category: true
        }
      });

      console.log(`✏️ Cagnotte "${existingCagnotte.title}" modifiée par l'admin`);

      res.json({
        success: true,
        data: cagnotte,
        message: 'Cagnotte modifiée avec succès'
      });
    } catch (error) {
      console.error('Erreur modification cagnotte:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la modification de la cagnotte' 
      });
    }
  }

  // 🔔 Créer une notification d'approbation utilisateur
  private async createUserApprovalNotification(userId: string, firstName: string, lastName: string) {
    try {
      await prisma.notification.create({
        data: {
          userId,
          type: 'SYSTEM',
          title: '✅ Votre compte a été approuvé !',
          message: `Félicitations ${firstName} ! Votre compte Kollecta a été approuvé par l'administration. Vous pouvez maintenant créer des cagnottes et faire des dons.`,
          actionUrl: '/profile',
          metadata: {
            approvalType: 'KYC',
            approvedAt: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('❌ Erreur lors de la création de la notification d\'approbation:', error);
      throw error;
    }
  }
} 