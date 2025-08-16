import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();
const authController = new AuthController();

// Routes d'authentification
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/forgot-password', (req, res) => authController.forgotPassword(req, res));
router.post('/reset-password', (req, res) => authController.resetPassword(req, res));

// 🔐 Routes de vérification d'email
router.post('/verify-email', (req, res) => authController.verifyEmail(req, res));
router.post('/resend-verification', (req, res) => authController.resendVerification(req, res));

// Route de test
router.get('/test', (_req, res) => {
  res.json({ message: 'Route d\'authentification fonctionne correctement' });
});

export default router;