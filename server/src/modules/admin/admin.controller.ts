import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../../services/emailService';
import { AdminLogService } from '../../services/adminLogService';
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

      // Enregistrer le log
      const changes: string[] = [];
      if (status !== undefined && status !== userBeforeUpdate.status) {
        changes.push(`Statut: ${userBeforeUpdate.status} → ${status}`);
      }
      if (isActive !== undefined && isActive !== userBeforeUpdate.isActive) {
        changes.push(`Actif: ${userBeforeUpdate.isActive} → ${isActive}`);
      }
      if (isVerified !== undefined && isVerified !== userBeforeUpdate.isVerified) {
        changes.push(`Vérifié: ${userBeforeUpdate.isVerified} → ${isVerified}`);
      }

      if (changes.length > 0) {
        await AdminLogService.createLogFromRequest(req, {
          action: 'UPDATE_USER_STATUS',
          category: 'USER',
          level: 'INFO',
          severity: 'LOW',
          description: `Statut utilisateur modifié: ${user.email} - ${changes.join(', ')}`,
          entityType: 'User',
          entityId: id,
          metadata: {
            changes,
            previousStatus: userBeforeUpdate.status,
            newStatus: status || userBeforeUpdate.status,
          }
        });
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

      // Créer un log d'audit KYC (ancien système)
      await prisma.kYCAuditLog.create({
        data: {
          userId: id,
          action: 'ACCOUNT_APPROVED',
          details: `Compte approuvé par l'admin - KYC: ${user.kycVerification.verificationStatus}, AML: ${user.amlCheck?.riskLevel || 'N/A'}`,
          adminId: req.user?.id,
        }
      });

      // Créer un log dans AdminLog (nouveau système)
      await AdminLogService.createLogFromRequest(req, {
        action: 'APPROVE_USER_KYC',
        category: 'USER',
        level: 'INFO',
        severity: 'LOW',
        description: `Compte utilisateur approuvé - ${user.firstName} ${user.lastName} (${user.email})`,
        entityType: 'User',
        entityId: id,
        metadata: {
          kycStatus: user.kycVerification.verificationStatus,
          amlRiskLevel: user.amlCheck?.riskLevel || 'N/A',
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

      // Enregistrer le log
      await AdminLogService.createLogFromRequest(req, {
        action: 'UPDATE_USER_ROLE',
        category: 'USER',
        level: 'WARNING',
        severity: 'HIGH',
        description: `Rôle utilisateur modifié: ${user.email} - ${userBeforeUpdate.role} → ${role}`,
        entityType: 'User',
        entityId: id,
        metadata: {
          previousRole: userBeforeUpdate.role,
          newRole: role,
        }
      });

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

      // Enregistrer le log AVANT la suppression
      await AdminLogService.createLogFromRequest(req, {
        action: 'DELETE_USER',
        category: 'USER',
        level: 'ERROR',
        severity: 'CRITICAL',
        description: `Utilisateur supprimé: ${existingUser.email}`,
        entityType: 'User',
        entityId: id,
        metadata: {
          userEmail: existingUser.email,
          userRole: existingUser.role,
        }
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

  // 📊 Récupérer toutes les statistiques du dashboard admin
  async getDashboardStats(req: Request, res: Response) {
    try {
      // Statistiques utilisateurs
      const activeUsers = await prisma.user.count({ where: { isActive: true } });
      const totalUsers = await prisma.user.count();

      // Statistiques cagnottes
      const activeCagnottes = await prisma.cagnotte.count({ where: { status: 'ACTIVE' } });
      const pendingCagnottes = await prisma.cagnotte.count({ where: { status: 'PENDING' } });
      const totalCagnottes = await prisma.cagnotte.count();

      // Statistiques signalements
      const pendingReports = await prisma.cagnotteReport.count({ where: { status: 'PENDING' } });
      const totalReports = await prisma.cagnotteReport.count();

      // Actions requises = cagnottes en attente + signalements en attente
      const actionsRequired = pendingCagnottes + pendingReports;

      // Calculer les pourcentages de changement (simplifié - on peut améliorer avec historique)
      const stats = {
        users: {
          active: activeUsers,
          total: totalUsers,
          change: 0, // À calculer avec historique si nécessaire
          changeType: 'positive' as const
        },
        cagnottes: {
          active: activeCagnottes,
          total: totalCagnottes,
          pending: pendingCagnottes,
          change: 0, // À calculer avec historique si nécessaire
          changeType: 'positive' as const
        },
        reports: {
          pending: pendingReports,
          total: totalReports,
          change: 0, // À calculer avec historique si nécessaire
          changeType: 'negative' as const
        },
        actions: {
          required: actionsRequired,
          change: 0, // À calculer avec historique si nécessaire
          changeType: 'neutral' as const
        }
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du dashboard:', error);
      res.status(500).json({ 
        success: false,
        message: 'Erreur lors de la récupération des statistiques du dashboard' 
      });
    }
  }

  // 📊 Récupérer toutes les statistiques analytiques détaillées
  async getAnalyticsStats(req: Request, res: Response) {
    try {
      // Statistiques utilisateurs
      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({ where: { isActive: true } });
      const pendingUsers = await prisma.user.count({ where: { status: 'PENDING' } });
      const suspendedUsers = await prisma.user.count({ where: { status: 'SUSPENDED' } });

      // Statistiques cagnottes
      const totalCagnottes = await prisma.cagnotte.count();
      const activeCagnottes = await prisma.cagnotte.count({ where: { status: 'ACTIVE' } });
      const pendingCagnottes = await prisma.cagnotte.count({ where: { status: 'PENDING' } });
      const completedCagnottes = await prisma.cagnotte.count({ where: { status: 'SUCCESS' } });
      const rejectedCagnottes = await prisma.cagnotte.count({ where: { status: 'REJECTED' } });

      // Calculer le montant total collecté et moyen
      const cagnottesWithAmount = await prisma.cagnotte.findMany({
        where: { status: { in: ['ACTIVE', 'SUCCESS'] } },
        select: { goalAmount: true, currentAmount: true }
      });
      const totalAmount = cagnottesWithAmount.reduce((sum, c) => sum + Number(c.currentAmount || 0), 0);
      // Montant moyen collecté par cagnotte active/terminée (pas toutes les cagnottes)
      const activeAndCompletedCount = cagnottesWithAmount.length;
      const averageAmount = activeAndCompletedCount > 0 ? Math.round(totalAmount / activeAndCompletedCount) : 0;

      // Statistiques signalements
      const totalReports = await prisma.cagnotteReport.count();
      const pendingReports = await prisma.cagnotteReport.count({ where: { status: 'PENDING' } });
      const resolvedReports = await prisma.cagnotteReport.count({ where: { status: 'RESOLVED' } });
      const urgentReports = await prisma.cagnotteReport.count({ where: { priority: 'HIGH' } });
      const highPriorityReports = await prisma.cagnotteReport.count({ where: { priority: 'MEDIUM' } });

      // Top catégories
      const allCagnottes = await prisma.cagnotte.findMany({
        select: { categoryId: true }
      });

      // Compter les cagnottes par catégorie
      const categoryCounts: Record<string, number> = {};
      for (const cagnotte of allCagnottes) {
        if (cagnotte.categoryId) {
          categoryCounts[cagnotte.categoryId] = (categoryCounts[cagnotte.categoryId] || 0) + 1;
        }
      }

      // Récupérer les détails des catégories
      const categoryDetails = await Promise.all(
        Object.entries(categoryCounts).map(async ([categoryId, count]) => {
          const category = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { name: true }
          });
          return {
            name: category?.name || 'Autres',
            count: count,
            percentage: totalCagnottes > 0 ? Math.round((count / totalCagnottes) * 100 * 10) / 10 : 0
          };
        })
      );

      // Trier par count et prendre les top 6
      const topCategories = categoryDetails
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      // Activité récente (derniers logs admin)
      const recentLogs = await prisma.adminLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });

      const recentActivity = recentLogs.map((log) => {
        const adminName = log.admin ? `${log.admin.firstName} ${log.admin.lastName}` : 'Admin System';
        let status = 'info';
        if (log.action.includes('APPROVED') || log.action.includes('ACTIVATED') || log.action.includes('RESOLVED')) {
          status = 'success';
        } else if (log.action.includes('SUSPENDED') || log.action.includes('REJECTED')) {
          status = 'error';
        } else if (log.action.includes('PENDING') || log.action.includes('INVESTIGATE')) {
          status = 'warning';
        }

        return {
          id: log.id,
          type: log.action,
          description: log.description,
          timestamp: log.createdAt.toISOString(),
          user: adminName,
          status: status
        };
      });

      // Indicateurs de performance (valeurs par défaut - peuvent être calculées avec plus de données)
      const performance = {
        responseTime: 2.3, // Peut être calculé à partir des logs
        resolutionRate: totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100 * 10) / 10 : 0,
        userSatisfaction: 4.6, // Nécessite un système de feedback
        platformUptime: 99.8 // Nécessite un système de monitoring
      };

      // Calculer la croissance (simplifié - basé sur les utilisateurs créés ce mois)
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      const usersThisMonth = await prisma.user.count({
        where: { createdAt: { gte: startOfMonth } }
      });
      const usersLastMonth = await prisma.user.count({
        where: { 
          createdAt: { 
            gte: startOfLastMonth,
            lt: startOfMonth
          } 
        }
      });
      
      const growth = usersLastMonth > 0 
        ? Math.round(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100 * 10) / 10
        : 0;

      const analyticsData = {
        users: {
          total: totalUsers,
          active: activeUsers,
          pending: pendingUsers,
          suspended: suspendedUsers,
          growth: growth
        },
        campaigns: {
          total: totalCagnottes,
          active: activeCagnottes,
          pending: pendingCagnottes,
          completed: completedCagnottes,
          rejected: rejectedCagnottes,
          totalAmount: totalAmount,
          averageAmount: averageAmount
        },
        reports: {
          total: totalReports,
          pending: pendingReports,
          resolved: resolvedReports,
          urgent: urgentReports,
          high: highPriorityReports
        },
        performance: performance,
        topCategories: topCategories,
        recentActivity: recentActivity
      };

      res.json({
        success: true,
        data: analyticsData
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques analytiques:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des statistiques analytiques'
      });
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

      // Enregistrer le log
      await AdminLogService.createLogFromRequest(req, {
        action: 'APPROVE_CAGNOTTE',
        category: 'CAGNOTTE',
        level: 'INFO',
        severity: 'LOW',
        description: `Cagnotte approuvée: "${existingCagnotte.title}"`,
        entityType: 'Cagnotte',
        entityId: id,
        metadata: {
          cagnotteTitle: existingCagnotte.title,
          creatorEmail: cagnotte.creator.email,
        }
      });

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

      // Enregistrer le log
      await AdminLogService.createLogFromRequest(req, {
        action: 'REJECT_CAGNOTTE',
        category: 'CAGNOTTE',
        level: 'WARNING',
        severity: 'MEDIUM',
        description: `Cagnotte rejetée: "${existingCagnotte.title}" - Raison: ${reason || 'Non spécifiée'}`,
        entityType: 'Cagnotte',
        entityId: id,
        metadata: {
          cagnotteTitle: existingCagnotte.title,
          reason: reason || 'Non spécifiée',
          creatorEmail: cagnotte.creator.email,
        }
      });

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

      // Enregistrer le log
      await AdminLogService.createLogFromRequest(req, {
        action: 'SUSPEND_CAGNOTTE',
        category: 'CAGNOTTE',
        level: 'WARNING',
        severity: 'MEDIUM',
        description: `Cagnotte suspendue: "${existingCagnotte.title}" - Raison: ${reason || 'Non spécifiée'}`,
        entityType: 'Cagnotte',
        entityId: id,
        metadata: {
          cagnotteTitle: existingCagnotte.title,
          reason: reason || 'Non spécifiée',
          creatorEmail: cagnotte.creator.email,
        }
      });

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

      // Enregistrer le log
      await AdminLogService.createLogFromRequest(req, {
        action: 'DELETE_CAGNOTTE',
        category: 'CAGNOTTE',
        level: 'WARNING',
        severity: 'HIGH',
        description: `Cagnotte supprimée: "${existingCagnotte.title}"`,
        entityType: 'Cagnotte',
        entityId: id,
        metadata: {
          cagnotteTitle: existingCagnotte.title,
          creatorEmail: existingCagnotte.creator.email,
        }
      });

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

  // 📋 Récupérer les logs d'administration
  async getLogs(req: Request, res: Response) {
    try {
      const { page = 1, limit = 25, level, category, startDate, endDate } = req.query;
      const pageNum = Number(page);
      const limitNum = Number(limit);
      
      console.log('📋 Récupération des logs admin - Page:', pageNum, 'Limit:', limitNum);
      console.log('📋 Filtres:', { level, category, startDate, endDate });

      // Construire le filtre de date
      const dateFilter: any = {};
      if (startDate && endDate) {
        dateFilter.createdAt = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        };
      }

      // Construire les filtres de niveau et catégorie
      if (level && level !== 'ALL') {
        dateFilter.level = level;
      }
      if (category && category !== 'ALL') {
        dateFilter.category = category;
      }

      // Récupérer les logs depuis AdminLog avec Prisma
      const [logs, total] = await Promise.all([
        prisma.adminLog.findMany({
          where: dateFilter,
          take: limitNum,
          skip: (pageNum - 1) * limitNum,
          orderBy: { createdAt: 'desc' },
          include: {
            admin: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }),
        prisma.adminLog.count({ where: dateFilter })
      ]);

      console.log(`📋 Logs AdminLog trouvés: ${logs.length} sur ${total} total`);

      // Transformer les logs en format unifié
      const transformedLogs = logs.map(log => ({
        id: log.id,
        timestamp: log.createdAt.toISOString(),
        level: log.level,
        category: log.category,
        action: log.action,
        description: log.description,
        userId: log.entityId && log.entityType === 'User' ? log.entityId : undefined,
        userName: log.admin ? `${log.admin.firstName} ${log.admin.lastName}` : undefined,
        userEmail: log.admin?.email,
        ipAddress: log.ipAddress || 'N/A',
        userAgent: log.userAgent || 'N/A',
        sessionId: 'N/A',
        severity: log.severity,
        metadata: log.metadata || {},
      }));

      res.json({
        success: true,
        data: {
          logs: transformedLogs,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
          }
        }
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des logs:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des logs',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  // ⚙️ Récupérer les paramètres système
  async getSystemSettings(req: Request, res: Response) {
    try {
      console.log('📋 Récupération des paramètres système...');

      // Utiliser SQL brut car le client Prisma n'a peut-être pas été régénéré
      const settings = await prisma.$queryRawUnsafe(`
        SELECT * FROM "SystemSettings" WHERE id = 'system' LIMIT 1;
      `);

      if (!settings || (Array.isArray(settings) && settings.length === 0)) {
        // Si aucun paramètre n'existe, retourner les valeurs par défaut
        return res.json({
          success: true,
          data: {
            general: {
              siteName: 'Kollecta',
              siteDescription: 'Plateforme de collecte de fonds collaborative',
              timezone: 'Africa/Tunis',
              language: 'fr',
              maintenanceMode: false,
              debugMode: false,
            },
            security: {
              sessionTimeout: 30,
              maxLoginAttempts: 5,
              passwordMinLength: 8,
              passwordComplexity: true,
              twoFactorRequired: false,
              sslRequired: true,
              ipWhitelist: [],
            },
            notifications: {
              emailEnabled: true,
              smsEnabled: false,
              pushEnabled: true,
              adminEmail: 'admin@kollecta.com',
              adminPhone: '+33123456789',
              notificationDelay: 5,
            },
            performance: {
              cacheEnabled: true,
              cacheTimeout: 3600,
              maxFileSize: 10,
              compressionEnabled: true,
              cdnEnabled: false,
              rateLimit: 100,
            },
            database: {
              connectionPool: 20,
              queryTimeout: 30,
              backupEnabled: true,
              backupFrequency: 24,
              backupRetention: 30,
            },
          }
        });
      }

      const settingsData = Array.isArray(settings) ? settings[0] : settings;
      
      res.json({
        success: true,
        data: {
          general: settingsData.general || {},
          security: settingsData.security || {},
          notifications: settingsData.notifications || {},
          performance: settingsData.performance || {},
          database: settingsData.database || {},
        }
      });
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des paramètres:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des paramètres système',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }

  // ⚙️ Sauvegarder les paramètres système
  async updateSystemSettings(req: Request, res: Response) {
    try {
      const { general, security, notifications, performance, database } = req.body;
      const adminId = (req as any).user?.id;

      console.log('💾 Sauvegarde des paramètres système par admin:', adminId);

      // Valider les données
      if (!general || !security || !notifications || !performance || !database) {
        return res.status(400).json({
          success: false,
          message: 'Tous les paramètres sont requis'
        });
      }

      // Convertir les objets en JSON et échapper correctement
      const generalJson = JSON.stringify(general).replace(/'/g, "''");
      const securityJson = JSON.stringify(security).replace(/'/g, "''");
      const notificationsJson = JSON.stringify(notifications).replace(/'/g, "''");
      const performanceJson = JSON.stringify(performance).replace(/'/g, "''");
      const databaseJson = JSON.stringify(database).replace(/'/g, "''");
      const adminIdEscaped = adminId ? adminId.replace(/'/g, "''") : null;

      // Utiliser SQL brut (car Prisma client peut ne pas être à jour)
      await prisma.$executeRawUnsafe(`
        INSERT INTO "SystemSettings" (
          id, general, security, notifications, performance, database, "updatedAt", "updatedBy"
        ) VALUES (
          'system',
          '${generalJson}'::jsonb,
          '${securityJson}'::jsonb,
          '${notificationsJson}'::jsonb,
          '${performanceJson}'::jsonb,
          '${databaseJson}'::jsonb,
          CURRENT_TIMESTAMP,
          ${adminIdEscaped ? `'${adminIdEscaped}'` : 'NULL'}
        )
        ON CONFLICT (id) DO UPDATE SET
          general = EXCLUDED.general,
          security = EXCLUDED.security,
          notifications = EXCLUDED.notifications,
          performance = EXCLUDED.performance,
          database = EXCLUDED.database,
          "updatedAt" = CURRENT_TIMESTAMP,
          "updatedBy" = EXCLUDED."updatedBy";
      `);

      // Enregistrer le log
      await AdminLogService.createLogFromRequest(req, {
        action: 'UPDATE_SYSTEM_SETTINGS',
        category: 'ADMIN',
        level: 'INFO',
        severity: 'MEDIUM',
        description: 'Paramètres système mis à jour',
        entityType: 'SystemSettings',
        entityId: 'system',
        metadata: {
          sections: ['general', 'security', 'notifications', 'performance', 'database'],
          maintenanceMode: general.maintenanceMode
        }
      });

      console.log('✅ Paramètres système sauvegardés avec succès');

      res.json({
        success: true,
        message: 'Paramètres système sauvegardés avec succès'
      });
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde des paramètres:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la sauvegarde des paramètres système',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
} 