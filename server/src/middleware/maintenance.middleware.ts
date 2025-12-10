import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Middleware pour vérifier le mode maintenance
 * Bloque tous les utilisateurs non-admin si le mode maintenance est activé
 */
export const maintenanceMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Routes exclues du mode maintenance
    // - Routes d'authentification (pour que les admins puissent se connecter)
    // - Routes admin/settings (pour gérer les paramètres)
    // - Route de vérification du mode maintenance (pour que le frontend puisse vérifier)
    // - Route de test de l'API
    const excludedPaths = [
      '/api/admin/settings',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/auth/check-maintenance',
      '/',
    ];

    // Vérifier si la route est exclue
    const isExcluded = excludedPaths.some(path => req.path.startsWith(path));
    if (isExcluded) {
      return next();
    }

    // Récupérer les paramètres système
    const settings = await prisma.$queryRawUnsafe(`
      SELECT general FROM "SystemSettings" WHERE id = 'system' LIMIT 1;
    `);

    if (!settings || (Array.isArray(settings) && settings.length === 0)) {
      // Si aucun paramètre n'existe, continuer normalement
      return next();
    }

    const settingsData = Array.isArray(settings) ? settings[0] : settings;
    const general = settingsData.general as any;

    // Vérifier si le mode maintenance est activé
    if (general?.maintenanceMode === true) {
      // Vérifier si l'utilisateur est admin
      const user = (req as any).user;
      
      if (!user || user.role !== 'ADMIN') {
        // Bloquer les utilisateurs non-admin
        return res.status(503).json({
          success: false,
          message: 'Le site est actuellement en maintenance. Veuillez réessayer plus tard.',
          maintenance: true,
          maintenanceMode: true
        });
      }
    }

    // Si le mode maintenance n'est pas activé ou si l'utilisateur est admin, continuer
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du mode maintenance:', error);
    // En cas d'erreur, continuer normalement pour ne pas bloquer l'application
    next();
  }
};

