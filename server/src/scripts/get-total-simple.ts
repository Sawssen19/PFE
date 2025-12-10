import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.cagnotte.aggregate({
    _sum: {
      goalAmount: true,
      currentAmount: true
    },
    _count: {
      id: true
    }
  });

  const totalGoal = result._sum.goalAmount || 0;
  const totalCurrent = result._sum.currentAmount || 0;
  const percentage = totalGoal > 0 ? (totalCurrent / totalGoal) * 100 : 0;

  console.log('\n💰 TOTAL GÉNÉRAL:');
  console.log('═══════════════════════════════════════');
  console.log(`   📊 Nombre de cagnottes: ${result._count.id}`);
  console.log(`   💵 Montant total collecté: ${totalCurrent.toLocaleString('fr-FR')} TND`);
  console.log(`   🎯 Montant total des objectifs: ${totalGoal.toLocaleString('fr-FR')} TND`);
  console.log(`   📈 Progression globale: ${percentage.toFixed(2)}%`);
  console.log('═══════════════════════════════════════\n');

  await prisma.$disconnect();
}

main();
















