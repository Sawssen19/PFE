import { Router } from 'express';
import { AuthController } from './auth.controller';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();
const prisma = new PrismaClient();

// Routes d'authentification
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

// 🔐 Routes de vérification d'email
router.post('/verify-email', (req, res) => authController.verifyEmail(req, res));
router.post('/resend-verification', (req, res) => authController.resendVerification(req, res));

// 🔐 Route de changement de mot de passe (nécessite authentification)
router.post('/change-password', authMiddleware, (req, res) => {
  authController.changePassword(req, res);
});

// Route publique pour vérifier le mode maintenance
router.get('/check-maintenance', async (req, res) => {
  try {
    const settings = await prisma.$queryRawUnsafe(`
      SELECT general FROM "SystemSettings" WHERE id = 'system' LIMIT 1;
    `);

    if (!settings || (Array.isArray(settings) && settings.length === 0)) {
      return res.json({ maintenanceMode: false });
    }

    const settingsData = Array.isArray(settings) ? settings[0] : settings;
    const general = settingsData.general as any;
    const maintenanceMode = general?.maintenanceMode === true;

    return res.json({ maintenanceMode });
  } catch (error) {
    console.error('Erreur lors de la vérification du mode maintenance:', error);
    return res.json({ maintenanceMode: false });
  }
});

// Route de test
router.get('/test', (_req, res) => {
  res.json({ message: 'Route d\'authentification fonctionne correctement' });
});

export default router;