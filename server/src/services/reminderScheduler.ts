import * as cron from 'node-cron';
import { CagnotteReminderService } from './cagnotteReminderService';

/**
 * Service de planification automatique des rappels
 * Exécute les vérifications de rappels quotidiennement
 */
export class ReminderScheduler {
  private static remindersTask: cron.ScheduledTask | null = null;
  private static expiredTask: cron.ScheduledTask | null = null;

  /**
   * Démarrer le scheduler automatique
   * Vérifie les rappels tous les jours à minuit (00:00) pour être sûr du jour calendaire
   * Vérifie les cagnottes expirées toutes les heures
   */
  static start() {
    console.log('📅 Démarrage du scheduler de rappels automatique...\n');

    // Vérifier les rappels tous les jours à minuit (00:00)
    // Format cron: minute heure jour mois jour-semaine
    // "0 0 * * *" = tous les jours à minuit (00:00)
    this.remindersTask = cron.schedule('0 0 * * *', async () => {
      console.log('\n⏰ Déclenchement automatique de la vérification des rappels (00:00)...');
      try {
        const result = await CagnotteReminderService.checkAndSendReminders();
        console.log(`✅ Rappels automatiques: ${result.remindersSent} rappels envoyés, ${result.cagnottesChecked} cagnottes vérifiées\n`);
      } catch (error) {
        console.error('❌ Erreur lors de la vérification automatique des rappels:', error);
      }
    }, {
      timezone: "Africa/Tunis" // Ajustez selon votre fuseau horaire
    });

    // Vérifier les cagnottes expirées toutes les heures
    // Format cron: "0 * * * *" = à chaque heure (minute 0)
    this.expiredTask = cron.schedule('0 * * * *', async () => {
      console.log('\n⏰ Déclenchement automatique de la vérification des cagnottes expirées...');
      try {
        const result = await CagnotteReminderService.checkAndHandleExpiredCagnottes();
        console.log(`✅ Cagnottes expirées traitées automatiquement: ${result.processed}\n`);
      } catch (error) {
        console.error('❌ Erreur lors de la vérification automatique des cagnottes expirées:', error);
      }
    }, {
      timezone: "Africa/Tunis" // Ajustez selon votre fuseau horaire
    });

    console.log('✅ Scheduler de rappels activé:');
    console.log('   - Vérification des rappels: tous les jours à minuit (00:00)');
    console.log('   - Vérification des cagnottes expirées: toutes les heures');
    console.log('   - Fuseau horaire: Africa/Tunis\n');
  }

  /**
   * Arrêter le scheduler
   */
  static stop() {
    if (this.remindersTask) {
      this.remindersTask.stop();
      this.remindersTask = null;
    }
    if (this.expiredTask) {
      this.expiredTask.stop();
      this.expiredTask = null;
    }
    console.log('📅 Scheduler de rappels arrêté\n');
  }

  /**
   * Vérifier si le scheduler est actif
   */
  static isRunning(): boolean {
    return this.remindersTask !== null && this.expiredTask !== null;
  }
}

