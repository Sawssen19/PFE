import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getNewDiscoverIds() {
  try {
    console.log('🔍 Récupération des IDs des nouvelles cagnottes Discover...\n');

    // Titres exacts des nouvelles cagnottes
    const discoverTitles = [
      "Aide moi à retrouver une vie digne et pleine d'espoir ❤️",
      "Aide Julien pour une chirurgie après un accident",
      "Opération du cœur pour Ahmed",
      "En mémoire de Fatma - Une vie dédiée à l'éducation",
      "Mémorial pour les victimes de l'accident",
      "Hommage à Mohamed, héros de la révolution",
      "Aide d'urgence pour les victimes des inondations",
      "Secours d'urgence après l'incendie de forêt",
      "Aide d'urgence pour la famille Bouazizi",
      "Soutien à l'association Espoir pour les enfants",
      "Sauvons l'association Croissant Rouge local"
    ];

    console.log('📋 IDs des nouvelles cagnottes Discover :\n');

    for (const title of discoverTitles) {
      const cagnotte = await prisma.cagnotte.findFirst({
        where: { title: title },
        select: {
          id: true,
          title: true,
          category: {
            select: {
              name: true
            }
          }
        }
      });

      if (cagnotte) {
        console.log(`✅ "${title}"`);
        console.log(`   ID: ${cagnotte.id}`);
        console.log(`   Catégorie: ${cagnotte.category.name}`);
        console.log('');
      } else {
        console.log(`❌ "${title}" - NON TROUVÉE`);
        console.log('');
      }
    }

    console.log('🎯 Vérification terminée !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getNewDiscoverIds(); 