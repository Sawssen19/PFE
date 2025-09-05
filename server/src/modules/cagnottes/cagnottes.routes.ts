import { Router } from 'express';
import cagnottesController from './cagnottes.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { uploadMiddleware } from '../../middleware/upload.middleware';

const router = Router();

// Routes publiques (lecture seule)
router.get('/', cagnottesController.getAllCagnottes.bind(cagnottesController));
router.get('/:id', cagnottesController.getCagnotteById.bind(cagnottesController));

// Routes protégées (nécessitent une authentification)
router.use(authMiddleware);

// CRUD des cagnottes
router.post('/', uploadMiddleware, cagnottesController.createCagnotte.bind(cagnottesController));
router.put('/:id', uploadMiddleware, cagnottesController.updateCagnotte.bind(cagnottesController));
router.delete('/:id', cagnottesController.deleteCagnotte.bind(cagnottesController));

// Auto-save pour les brouillons
router.post('/draft', cagnottesController.saveDraft.bind(cagnottesController));
router.put('/draft/:id', uploadMiddleware, cagnottesController.updateDraft.bind(cagnottesController));

// Routes spécifiques à l'utilisateur
router.get('/user/my-cagnottes', cagnottesController.getUserCagnottes.bind(cagnottesController));

// Publier une cagnotte
router.post('/:id/publish', cagnottesController.publishCagnotte.bind(cagnottesController));

// Soumettre une cagnotte pour validation admin
router.post('/:id/submit', cagnottesController.submitCagnotte.bind(cagnottesController));

// Routes admin pour la validation des cagnottes
router.get('/admin/pending', cagnottesController.getPendingCagnottes.bind(cagnottesController));
router.post('/:id/approve', cagnottesController.approveCagnotte.bind(cagnottesController));
router.post('/:id/reject', cagnottesController.rejectCagnotte.bind(cagnottesController));

export default router; 