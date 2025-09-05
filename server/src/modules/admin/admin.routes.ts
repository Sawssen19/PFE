import { Router } from 'express';
import { AdminController } from './admin.controller';
import { authMiddleware, isAdmin } from '../../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

// 🔐 Toutes les routes admin nécessitent une authentification et des droits admin
// TEMPORAIREMENT DÉSACTIVÉ POUR TESTER
// router.use(authMiddleware);
// router.use(isAdmin);

// Routes de gestion des utilisateurs
router.get('/users', (req, res) => adminController.getAllUsers(req, res));
router.get('/users/:id', (req, res) => adminController.getUserById(req, res));
router.put('/users/:id/status', (req, res) => adminController.updateUserStatus(req, res));
router.put('/users/:id/role', (req, res) => adminController.updateUserRole(req, res));
router.put('/users/:id/approve-kyc', (req, res) => adminController.approveUserKYC(req, res));
router.delete('/users/:id', (req, res) => adminController.deleteUser(req, res));

// Routes de statistiques
router.get('/stats', (req, res) => adminController.getUserStats(req, res));

// Routes de gestion des cagnottes
router.get('/cagnottes', (req, res) => adminController.getAllCagnottes(req, res));
router.get('/cagnottes/pending', (req, res) => adminController.getPendingCagnottes(req, res));
router.post('/cagnottes/:id/approve', (req, res) => adminController.approveCagnotte(req, res));
router.post('/cagnottes/:id/reject', (req, res) => adminController.rejectCagnotte(req, res));
router.post('/cagnottes/:id/suspend', (req, res) => adminController.suspendCagnotte(req, res));
router.put('/cagnottes/:id', (req, res) => adminController.updateCagnotte(req, res));
router.delete('/cagnottes/:id', (req, res) => adminController.deleteCagnotte(req, res));

export default router; 