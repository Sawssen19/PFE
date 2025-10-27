import { Router } from 'express';
import { 
  createReport, 
  getAllReports, 
  getReportById, 
  updateReportStatus, 
  deleteReport 
} from './reports.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Route publique pour créer un signalement
router.post('/', createReport);

// Routes protégées pour l'administration
router.get('/', authMiddleware, getAllReports);
router.get('/:id', authMiddleware, getReportById);
router.put('/:id/status', authMiddleware, updateReportStatus);
router.delete('/:id', authMiddleware, deleteReport);

export default router;