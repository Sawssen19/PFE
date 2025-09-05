import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixDuplicateImages() {
  try {
    console.log('🖼️ Correction des images dupliquées des cagnottes...\n');

    // Images appropriées par catégorie
    const categoryImages = {
      'Santé': [
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Animaux': [
        'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Entreprises': [
        'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Urgences': [
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ]
    };

    // Cagnottes à corriger avec leurs nouvelles images
    const cagnottesToFix = [
      {
        title: "Soins vétérinaires pour refuge",
        newImage: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Startup écologique",
        newImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Aide aux sinistrés de Sfax",
        newImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
      },
      {
        title: "Aide aux personnes âgées",
        newImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
      }
    ];

    console.log(`📊 Cagnottes à corriger: ${cagnottesToFix.length}\n`);

    let updatedCount = 0;
    for (const cagnotteData of cagnottesToFix) {
      try {
        const cagnotte = await prisma.cagnotte.findFirst({
          where: { title: cagnotteData.title }
        });

        if (cagnotte) {
          await prisma.cagnotte.update({
            where: { id: cagnotte.id },
            data: { coverImage: cagnotteData.newImage }
          });

          console.log(`✅ "${cagnotteData.title}" - Image corrigée`);
          updatedCount++;
        } else {
          console.log(`❌ "${cagnotteData.title}" - NON TROUVÉE`);
        }
      } catch (error) {
        console.error(`❌ Erreur lors de la correction de "${cagnotteData.title}":`, error);
      }
    }

    console.log('\n🎉 Processus terminé !');
    console.log(`📊 Cagnottes corrigées: ${updatedCount}/${cagnottesToFix.length}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDuplicateImages(); 