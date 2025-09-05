import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSpecificCagnottes() {
  try {
    console.log('🔍 Vérification des IDs exacts des cagnottes Discover...\n');

    // Titres exacts affichés sur la page discover
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

    console.log('📋 Recherche des cagnottes correspondantes...\n');

    for (const title of discoverTitles) {
      const cagnotte = await prisma.cagnotte.findFirst({
        where: {
          title: {
            contains: title.split(' ').slice(0, 3).join(' ') // Recherche par les 3 premiers mots
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
        }
      });

      if (cagnotte) {
        console.log(`✅ "${title}"`);
        console.log(`   ID: ${cagnotte.id}`);
        console.log(`   Titre en base: ${cagnotte.title}`);
        console.log(`   Catégorie: ${cagnotte.category.name}`);
        console.log('');
      } else {
        console.log(`❌ "${title}" - AUCUNE CORRESPONDANCE TROUVÉE`);
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

checkSpecificCagnottes(); 