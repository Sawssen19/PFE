/**
 * Script pour calculer les totaux des montants collectés
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('💰 Calcul des montants totaux...\n');

    const cagnottes = await prisma.cagnotte.findMany({
      select: {
        goalAmount: true,
        currentAmount: true,
        status: true
      }
    });

    const totalGoalAmount = cagnottes.reduce((sum, c) => sum + c.goalAmount, 0);
    const totalCurrentAmount = cagnottes.reduce((sum, c) => sum + c.currentAmount, 0);
    const percentage = (totalCurrentAmount / totalGoalAmount) * 100;

    console.log('='.repeat(80));
    console.log('📊 TOTAUX GÉNÉRAUX:');
    console.log('='.repeat(80));
    console.log(`   💰 Montant total collecté: ${totalCurrentAmount.toLocaleString('fr-FR')} TND`);
    console.log(`   🎯 Montant total des objectifs: ${totalGoalAmount.toLocaleString('fr-FR')} TND`);
    console.log(`   📈 Progression globale: ${percentage.toFixed(2)}%`);
    console.log('='.repeat(80));

    // Par statut
    const stats = {
      ACTIVE: { goal: 0, current: 0, count: 0 },
      SUCCESS: { goal: 0, current: 0, count: 0 },
      CLOSED: { goal: 0, current: 0, count: 0 },
      PENDING: { goal: 0, current: 0, count: 0 },
      DRAFT: { goal: 0, current: 0, count: 0 },
      REJECTED: { goal: 0, current: 0, count: 0 },
      SUSPENDED: { goal: 0, current: 0, count: 0 }
    };

    cagnottes.forEach(c => {
      if (stats[c.status as keyof typeof stats]) {
        stats[c.status as keyof typeof stats].goal += c.goalAmount;
        stats[c.status as keyof typeof stats].current += c.currentAmount;
        stats[c.status as keyof typeof stats].count += 1;
      }
    });

    console.log('\n📊 RÉPARTITION PAR STATUT:');
    console.log('-'.repeat(80));
    
    Object.entries(stats).forEach(([status, data]) => {
      if (data.count > 0) {
        const percentage = data.goal > 0 ? (data.current / data.goal) * 100 : 0;
        console.log(`\n${status}:`);
        console.log(`   Nombre: ${data.count} cagnotte(s)`);
        console.log(`   Objectif total: ${data.goal.toLocaleString('fr-FR')} TND`);
        console.log(`   Collecté: ${data.current.toLocaleString('fr-FR')} TND`);
        if (data.goal > 0) {
          console.log(`   Progression: ${percentage.toFixed(2)}%`);
        }
      }
    });

    console.log('\n' + '='.repeat(80));

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
















