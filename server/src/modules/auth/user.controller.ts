import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserController {
  // 🔐 Récupérer tous les utilisateurs (ADMIN ONLY)
  async getAllUsers(req: Request, res: Response) {
    try {
      // 🔒 Vérifier que l'utilisateur est admin
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ 
          message: 'Accès refusé. Seuls les administrateurs peuvent consulter tous les utilisateurs.' 
        });
      }

      console.log('🔍 Récupération de tous les utilisateurs par admin:', req.user.email);

      // 📊 Récupérer tous les utilisateurs avec leurs informations de base
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          profilePicture: true,
          profileDescription: true,
          phone: true,
          birthday: true,
          language: true,
          // 🔐 Champs sensibles exclus pour la sécurité
          // password: false,
          // verificationToken: false,
          // verificationExp: false,
        },
        orderBy: {
          createdAt: 'desc', // Plus récents en premier
        },
      });

      console.log(`✅ ${users.length} utilisateurs récupérés avec succès`);

      // 📋 Log détaillé pour le débogage
      users.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.role} - ${user.isActive ? 'ACTIF' : 'INACTIF'}`);
      });

      res.json(users);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      res.status(500).json({ 
        message: 'Erreur interne du serveur lors de la récupération des utilisateurs' 
      });
    }
  }

  // 🔐 Récupérer un utilisateur spécifique par ID (ADMIN ONLY)
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // 🔒 Vérifier que l'utilisateur est admin
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ 
          message: 'Accès refusé. Seuls les administrateurs peuvent consulter les détails des utilisateurs.' 
        });
      }

      console.log(`🔍 Récupération de l'utilisateur ${id} par admin:`, req.user.email);

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isVerified: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          profilePicture: true,
          profileDescription: true,
          profileUrl: true,
          profileVisibility: true,
          phone: true,
          birthday: true,
          language: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      console.log(`✅ Utilisateur ${id} récupéré avec succès:`, user.email);
      res.json(user);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de l\'utilisateur:', error);
      res.status(500).json({ 
        message: 'Erreur interne du serveur lors de la récupération de l\'utilisateur' 
      });
    }
  }

  // 📊 Statistiques des utilisateurs (ADMIN ONLY)
  async getUserStats(req: Request, res: Response) {
    try {
      // 🔒 Vérifier que l'utilisateur est admin
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ 
          message: 'Accès refusé. Seuls les administrateurs peuvent consulter les statistiques.' 
        });
      }

      console.log('📊 Récupération des statistiques utilisateurs par admin:', req.user.email);

      // 🔢 Compter les utilisateurs par rôle
      const [totalUsers, adminUsers, userUsers, supportUsers, verifiedUsers, activeUsers] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.user.count({ where: { role: 'USER' } }),
        prisma.user.count({ where: { role: 'SUPPORT' } }),
        prisma.user.count({ where: { isVerified: true } }),
        prisma.user.count({ where: { isActive: true } }),
      ]);

      const stats = {
        total: totalUsers,
        byRole: {
          admin: adminUsers,
          user: userUsers,
          support: supportUsers,
        },
        byStatus: {
          verified: verifiedUsers,
          unverified: totalUsers - verifiedUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
        },
        percentage: {
          verified: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
          active: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
        },
      };

      console.log('✅ Statistiques utilisateurs récupérées:', stats);
      res.json(stats);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      res.status(500).json({ 
        message: 'Erreur interne du serveur lors de la récupération des statistiques' 
      });
    }
  }
}