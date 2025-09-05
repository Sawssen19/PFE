import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkHomepageImages() {
  try {
    console.log('🖼️ Vérification des images des cagnottes de la page d\'accueil...\n');

    // Titres exacts des cagnottes affichées sur la page d'accueil
    const homepageTitles = [
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
    ];

    console.log('📋 Vérification des images de la page d\'accueil :\n');

    for (const title of homepageTitles) {
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
        if (cagnotte.coverImage) {
          console.log(`   URL: ${cagnotte.coverImage.substring(0, 80)}...`);
        }
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

checkHomepageImages(); 