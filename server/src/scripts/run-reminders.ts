/**
 * Script pour exécuter les vérifications de rappels et de cagnottes expirées
 * 
 * Usage:
 *   ts-node src/scripts/run-reminders.ts
 * 
 * Ou ajouter au package.json:
 *   "reminders:check": "ts-node src/scripts/run-reminders.ts"
 * 
 * Pour automatiser avec cron (toutes les heures):
 *   0 * * * * cd /path/to/server && npm run reminders:check
 */

import { CagnotteReminderService } from '../services/cagnotteReminderService';

async function main() {
  try {
    console.log('🚀 Démarrage des vérifications de rappels...\n');
    console.log('⏰ Date:', new Date().toLocaleString('fr-FR'));
    console.log('==========================================\n');

    // 1. Vérifier les rappels (cagnottes proches de la fin)
    console.log('📋 ÉTAPE 1: Vérification des rappels de cagnottes\n');
    const remindersResult = await CagnotteReminderService.checkAndSendReminders();
    console.log(`✅ ${remindersResult.remindersSent} rappels envoyés`);
    console.log(`✅ ${remindersResult.cagnottesChecked} cagnottes vérifiées\n`);

    // 2. Vérifier les cagnottes expirées
    console.log('📋 ÉTAPE 2: Vérification des cagnottes expirées\n');
    const expiredResult = await CagnotteReminderService.checkAndHandleExpiredCagnottes();
    console.log(`✅ ${expiredResult.processed} cagnottes expirées traitées\n`);

    console.log('==========================================');
    console.log('✅ Vérifications terminées avec succès !');
    console.log('==========================================\n');

    // Fermer la connexion Prisma
    const { PrismaClient } = await import('@prisma/client');
    const prismaInstance = new PrismaClient();
    await prismaInstance.$disconnect();
    console.log('🔌 Connexion Prisma fermée\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur fatale lors des vérifications:', error);
    
    // Fermer la connexion Prisma même en cas d'erreur
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prismaInstance = new PrismaClient();
      await prismaInstance.$disconnect();
      console.log('🔌 Connexion Prisma fermée\n');
    } catch (disconnectError) {
      // Ignorer les erreurs de déconnexion
    }
    
    process.exit(1);
  }
}

// Exécuter le script
main();

