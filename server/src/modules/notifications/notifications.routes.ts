import { Router } from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from './notifications.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authMiddleware);

// Routes des notifications
router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/:id', deleteNotification);

export default router;


