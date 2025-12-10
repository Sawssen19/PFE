import { Request, Response } from 'express';
import { CagnotteReminderService } from '../../services/cagnotteReminderService';

export class CagnotteRemindersController {
  /**
   * Vérifier et envoyer les rappels pour les cagnottes proches de la fin
   * GET /api/cagnottes/reminders/check
   * Peut être appelé manuellement ou via un cron job
   */
  async checkReminders(req: Request, res: Response) {
    try {
      console.log('🔔 Déclenchement manuel de la vérification des rappels...\n');
      
      const result = await CagnotteReminderService.checkAndSendReminders();
      
      res.status(200).json({
        success: true,
        message: 'Vérification des rappels terminée',
        data: result
      });
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des rappels:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la vérification des rappels'
      });
    }
  }

  /**
   * Vérifier et traiter les cagnottes expirées
   * GET /api/cagnottes/reminders/check-expired
   * Peut être appelé manuellement ou via un cron job
   */
  async checkExpired(req: Request, res: Response) {
    try {
      console.log('📅 Déclenchement manuel de la vérification des cagnottes expirées...\n');
      
      const result = await CagnotteReminderService.checkAndHandleExpiredCagnottes();
      
      res.status(200).json({
        success: true,
        message: 'Vérification des cagnottes expirées terminée',
        data: result
      });
    } catch (error) {
      console.error('❌ Erreur lors de la vérification des cagnottes expirées:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la vérification des cagnottes expirées'
      });
    }
  }
}

export default new CagnotteRemindersController();

