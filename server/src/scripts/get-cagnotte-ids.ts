import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCagnotteIds() {
  try {
    console.log('🔍 Récupération des IDs des cagnottes principales...\n');

    // Récupérer les cagnottes principales qui correspondent à celles du frontend
    const mainCagnottes = await prisma.cagnotte.findMany({
      where: {
        title: {
          in: [
            "Aider Youssef à vaincre le cancer",
            "Bourse d'étude pour Amina",
            "Reconstruction maison familiale",
            "Soins pour Noura",
            "Startup écologique",
            "Aide aux sinistrés de Sfax",
            "Équipement pour école rurale",
            "Soins vétérinaires pour refuge",
            "Formation professionnelle",
            "Aide aux personnes âgées",
            "Projet agricole communautaire",
            "Bibliothèque mobile",
            "Centre de réhabilitation",
            "Projet artistique",
            "Aide alimentaire d'urgence",
            "Aide Saeb à poursuivre ses études en informatique",
            "Bourse d'études pour Nour en médecine",
            "Équipement informatique pour l'école rurale"
          ]
        }
      },
      select: {
        id: true,
        title: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('📋 IDs des cagnottes principales :\n');
    mainCagnottes.forEach((cagnotte, index) => {
      console.log(`${index + 1}. ${cagnotte.title}`);
      console.log(`   ID: ${cagnotte.id}`);
      console.log(`   Catégorie: ${cagnotte.category.name}`);
      console.log('');
    });

    console.log(`\n🎯 Total: ${mainCagnottes.length} cagnottes trouvées`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getCagnotteIds(); 