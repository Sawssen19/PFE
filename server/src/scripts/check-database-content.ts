import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseContent() {
  try {
    console.log('🔍 Vérification du contenu de la base de données...\n');

    // Compter les utilisateurs
    const userCount = await prisma.user.count();
    console.log(`👥 Utilisateurs: ${userCount}`);

    // Compter les catégories
    const categoryCount = await prisma.category.count();
    console.log(`🏷️ Catégories: ${categoryCount}`);

    // Compter les cagnottes
    const cagnotteCount = await prisma.cagnotte.count();
    console.log(`💰 Cagnottes: ${cagnotteCount}`);

    // Compter les promesses
    const promiseCount = await prisma.promise.count();
    console.log(`🤝 Promesses de dons: ${promiseCount}`);

    // Afficher les catégories
    console.log('\n📋 Catégories disponibles:');
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    categories.forEach(cat => {
      console.log(`  • ${cat.name}`);
    });

    // Afficher un résumé des cagnottes
    console.log('\n📊 Résumé des cagnottes:');
    const cagnottes = await prisma.cagnotte.findMany({
      include: {
        category: true,
        creator: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    cagnottes.forEach((cagnotte, index) => {
      const progress = ((cagnotte.currentAmount / cagnotte.goalAmount) * 100).toFixed(1);
      console.log(`  ${index + 1}. ${cagnotte.title}`);
      console.log(`     💰 ${cagnotte.currentAmount.toLocaleString()}/${cagnotte.goalAmount.toLocaleString()} DT (${progress}%)`);
      console.log(`     🏷️ ${cagnotte.category.name} | 👤 ${cagnotte.creator.firstName} ${cagnotte.creator.lastName}`);
      console.log(`     📅 ${cagnotte.status} | Créée le ${cagnotte.createdAt.toLocaleDateString('fr-FR')}`);
      console.log('');
    });

    // Statistiques des promesses
    console.log('📈 Statistiques des promesses:');
    const paidPromises = await prisma.promise.count({
      where: { status: 'PAID' }
    });
    const pendingPromises = await prisma.promise.count({
      where: { status: 'PENDING' }
    });
    console.log(`  ✅ Promesses payées: ${paidPromises}`);
    console.log(`  ⏳ Promesses en attente: ${pendingPromises}`);

    // Montant total collecté
    const totalCollected = await prisma.cagnotte.aggregate({
      _sum: {
        currentAmount: true
      }
    });
    console.log(`\n💎 Montant total collecté: ${totalCollected._sum.currentAmount?.toLocaleString() || 0} DT`);

    console.log('\n🎉 Vérification terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseContent(); 