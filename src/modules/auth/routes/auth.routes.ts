import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { isAdmin, isAuthenticated } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

// Routes publiques
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/forgot-password', authController.forgotPassword.bind(authController));

// Routes authentifiées
router.put('/profile', isAuthenticated, authController.updateProfile.bind(authController));

// Routes admin
router.get('/users', isAuthenticated, isAdmin, authController.listUsers.bind(authController));
router.put('/users/:userId/suspend', isAuthenticated, isAdmin, authController.suspendUser.bind(authController));
router.put('/users/:userId/role', isAuthenticated, isAdmin, authController.updateUserRole.bind(authController));

export default router;