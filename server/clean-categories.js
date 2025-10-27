const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanCategories() {
  try {
    console.log('🧹 Nettoyage des catégories redondantes...');
    
    // 1. Vérifier les catégories existantes
    const existingCategories = await prisma.category.findMany({
      select: { id: true, name: true, _count: { select: { cagnottes: true } } }
    });
    
    console.log('📊 Catégories existantes:');
    existingCategories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat._count.cagnottes} cagnottes`);
    });
    
    // 2. Réassigner les cagnottes des catégories redondantes
    console.log('\n🔄 Réassignation des cagnottes...');
    
    // Urgence -> Urgences
    const urgence = await prisma.category.findUnique({ where: { name: 'Urgence' } });
    const urgences = await prisma.category.findUnique({ where: { name: 'Urgences' } });
    
    if (urgence && urgences) {
      await prisma.cagnotte.updateMany({
        where: { categoryId: urgence.id },
        data: { categoryId: urgences.id }
      });
      console.log('✅ Urgence -> Urgences');
    }
    
    // Sportif -> Sport
    const sportif = await prisma.category.findUnique({ where: { name: 'Sportif' } });
    const sport = await prisma.category.findUnique({ where: { name: 'Sport' } });
    
    if (sportif && sport) {
      await prisma.cagnotte.updateMany({
        where: { categoryId: sportif.id },
        data: { categoryId: sport.id }
      });
      console.log('✅ Sportif -> Sport');
    }
    
    // Social -> Solidarité
    const social = await prisma.category.findUnique({ where: { name: 'Social' } });
    const solidarite = await prisma.category.findUnique({ where: { name: 'Solidarité' } });
    
    if (social && solidarite) {
      await prisma.cagnotte.updateMany({
        where: { categoryId: social.id },
        data: { categoryId: solidarite.id }
      });
      console.log('✅ Social -> Solidarité');
    }
    
    // Test -> Autre
    const test = await prisma.category.findUnique({ where: { name: 'Test' } });
    const autre = await prisma.category.findUnique({ where: { name: 'Autre' } });
    
    if (test && autre) {
      await prisma.cagnotte.updateMany({
        where: { categoryId: test.id },
        data: { categoryId: autre.id }
      });
      console.log('✅ Test -> Autre');
    }
    
    // 3. Supprimer les catégories redondantes
    console.log('\n🗑️ Suppression des catégories redondantes...');
    
    const categoriesToDelete = ['Urgence', 'Sportif', 'Social', 'Test'];
    
    for (const categoryName of categoriesToDelete) {
      const category = await prisma.category.findUnique({ where: { name: categoryName } });
      if (category) {
        await prisma.category.delete({ where: { id: category.id } });
        console.log(`✅ Supprimé: ${categoryName}`);
      }
    }
    
    // 4. Ajouter les nouvelles catégories
    console.log('\n➕ Ajout des nouvelles catégories...');
    
    const newCategories = [
      { name: 'Religion', description: 'Projets religieux et spirituels' },
      { name: 'Famille', description: 'Cagnottes familiales et événements personnels' },
      { name: 'Événements', description: 'Fêtes, anniversaires et célébrations' },
      { name: 'Voyages', description: 'Voyages d\'études, pèlerinages et déplacements' },
      { name: 'Bénévolat', description: 'Projets de bénévolat et associations caritatives' }
    ];
    
    for (const newCat of newCategories) {
      try {
        await prisma.category.create({
          data: newCat
        });
        console.log(`✅ Ajouté: ${newCat.name}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ Déjà existant: ${newCat.name}`);
        } else {
          console.error(`❌ Erreur pour ${newCat.name}:`, error.message);
        }
      }
    }
    
    // 5. Afficher le résultat final
    console.log('\n📊 Résultat final:');
    const finalCategories = await prisma.category.findMany({
      select: { id: true, name: true, _count: { select: { cagnottes: true } } },
      orderBy: { name: 'asc' }
    });
    
    finalCategories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat._count.cagnottes} cagnottes`);
    });
    
    console.log(`\n🎉 Nettoyage terminé! Total: ${finalCategories.length} catégories`);
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanCategories();
