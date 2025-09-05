import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDiscoverLinks() {
  try {
    console.log('🔍 Vérification des liens des cagnottes Discover...\n');

    // Titres exacts des cagnottes affichées sur la page discover
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
      "Aide aux familles nécessiteuses de Gafsa",
      "Sauvons l'association Croissant Rouge local"
    ];

    console.log('📋 Vérification des liens Discover :\n');

    for (const title of discoverTitles) {
      const cagnotte = await prisma.cagnotte.findFirst({
        where: { title: title },
        select: {
          id: true,
          title: true,
          coverImage: true,
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
        console.log(`   Image: ${cagnotte.coverImage ? '✅' : '❌'}`);
        console.log(`   Lien: /cagnottes/${cagnotte.id}`);
        console.log('');
      } else {
        console.log(`❌ "${title}" - NON TROUVÉE EN BASE`);
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

checkDiscoverLinks(); 