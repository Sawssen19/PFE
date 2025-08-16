import { Router } from 'express';
import {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
  getProfile
} from '../controllers/auth.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Routes protégées
router.use(authMiddleware); // Middleware d'authentification pour toutes les routes suivantes

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Routes admin
router.get('/users', roleMiddleware([Role.ADMIN]), (req, res) => {
  res.json({ message: 'Liste des utilisateurs - Accès Admin uniquement' });
});

export default router;