import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// 🔐 Routes protégées par authentification (ADMIN ONLY)
router.use(authMiddleware); // Toutes les routes nécessitent une authentification

// 📊 Récupérer tous les utilisateurs (ADMIN ONLY)
router.get('/users', (req, res) => userController.getAllUsers(req, res));

// 🔍 Récupérer un utilisateur spécifique par ID (ADMIN ONLY)
router.get('/users/:id', (req, res) => userController.getUserById(req, res));

// 📈 Statistiques des utilisateurs (ADMIN ONLY)
router.get('/stats', (req, res) => userController.getUserStats(req, res));

export default router;