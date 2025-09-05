import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCategories() {
  try {
    console.log('🔍 Vérification des catégories dans la base de données...\n');

    // Récupérer toutes les catégories
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`📊 TOTAL CATÉGORIES: ${categories.length}\n`);

    if (categories.length === 0) {
      console.log('❌ Aucune catégorie trouvée dans la base de données');
      return;
    }

    // Afficher les détails de chaque catégorie
    categories.forEach((category, index) => {
      console.log(`--- Catégorie ${index + 1} ---`);
      console.log(`🆔 ID: ${category.id}`);
      console.log(`📝 Nom: ${category.name}`);
      console.log(`📄 Description: ${category.description}`);
      console.log('');
    });

    // Vérifier les cagnottes et leurs catégories
    const cagnottes = await prisma.cagnotte.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 CAGNOTTES AVEC CATÉGORIES: ${cagnottes.length}\n`);

    cagnottes.forEach((cagnotte, index) => {
      console.log(`--- Cagnotte ${index + 1} ---`);
      console.log(`🆔 ID: ${cagnotte.id}`);
      console.log(`📝 Titre: ${cagnotte.title}`);
      console.log(`🏷️ Catégorie: ${cagnotte.category?.name || 'Aucune'}`);
      console.log(`📊 Statut: ${cagnotte.status}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur lors de la vérification des catégories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategories(); 