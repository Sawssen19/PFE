import { Router } from 'express';
import {
  investigateReport,
  resolveReport,
  rejectReport,
  blockCagnotte,
  deleteReport,
  reactivateCagnotte
} from './reportActions.controller';
import { authMiddleware, isAdmin } from '../../middleware/auth.middleware';

const router = Router();

// Toutes les routes nécessitent une authentification admin
router.use(authMiddleware);
router.use(isAdmin);

// Actions sur les signalements
router.put('/:id/investigate', investigateReport);
router.put('/:id/resolve', resolveReport);
router.put('/:id/reject', rejectReport);
router.put('/:id/block', blockCagnotte);
router.put('/:id/reactivate', reactivateCagnotte);
router.delete('/:id', deleteReport);

export default router;