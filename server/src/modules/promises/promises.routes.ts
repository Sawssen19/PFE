import { Router } from 'express';
import promisesController from './promises.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Routes publiques - Les promesses d'une cagnotte peuvent être consultées publiquement
router.get('/cagnotte/:cagnotteId', promisesController.getCagnottePromises.bind(promisesController));

// Routes protégées (nécessitent une authentification)
router.use(authMiddleware);

// CRUD des promesses (création, modification, suppression nécessitent un compte)
router.post('/', promisesController.createPromise.bind(promisesController));
    router.get('/user/my-promises', promisesController.getUserPromises.bind(promisesController));
    router.get('/stats', promisesController.getPromiseStats.bind(promisesController));
    router.get('/:id', promisesController.getPromiseById.bind(promisesController));
    router.put('/:id', promisesController.updatePromise.bind(promisesController));
    router.put('/:id/status', promisesController.updatePromiseStatus.bind(promisesController));
    router.delete('/:id', promisesController.deletePromise.bind(promisesController));

export default router;

