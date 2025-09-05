import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUserCagnottes() {
  try {
    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email: 'sawssen1511919@gmail.com' }
    });
    
    if (!user) {
      console.log('❌ Utilisateur sawssen1511919@gmail.com non trouvé');
      return;
    }

    console.log('👤 Utilisateur trouvé:', user.email);
    console.log('🆔 ID utilisateur:', user.id);

    // Récupérer TOUTES les cagnottes de cet utilisateur (sans pagination)
    const allCagnottes = await prisma.cagnotte.findMany({
      where: { creatorId: user.id },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📊 TOTAL CAGNOTTES TROUVÉES: ${allCagnottes.length}`);
    
    // Afficher les détails de chaque cagnotte
    allCagnottes.forEach((cagnotte, index) => {
      console.log(`\n--- Cagnotte ${index + 1} ---`);
      console.log(`🆔 ID: ${cagnotte.id}`);
      console.log(`📝 Titre: ${cagnotte.title}`);
      console.log(`📊 Statut: ${cagnotte.status}`);
      console.log(`💰 Montant objectif: ${cagnotte.goalAmount} TND`);
      console.log(`💰 Montant actuel: ${cagnotte.currentAmount} TND`);
      console.log(`📅 Créée le: ${cagnotte.createdAt}`);
      console.log(`🏷️ Catégorie: ${cagnotte.category?.name}`);
    });

    // Vérifier la pagination par défaut (page=1, limit=10)
    const paginatedCagnottes = await prisma.cagnotte.findMany({
      where: { creatorId: user.id },
      skip: 0, // (page - 1) * limit = (1 - 1) * 10 = 0
      take: 10, // limit = 10
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`\n📄 CAGNOTTES AVEC PAGINATION (page=1, limit=10): ${paginatedCagnottes.length}`);

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserCagnottes(); 