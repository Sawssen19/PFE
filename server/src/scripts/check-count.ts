import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const total = await prisma.cagnotte.count();
  console.log(`\n✅ TOTAL CAGNOTTES DANS LA BASE: ${total}\n`);
  
  const byStatus = await prisma.cagnotte.groupBy({
    by: ['status'],
    _count: true
  });
  
  console.log('Répartition par statut:');
  byStatus.forEach(item => {
    console.log(`  ${item.status}: ${item._count}`);
  });
  
  await prisma.$disconnect();
}

main();
















