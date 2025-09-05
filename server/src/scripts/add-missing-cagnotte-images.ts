import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addMissingCagnotteImages() {
  try {
    console.log('🖼️ Ajout des images manquantes aux cagnottes...\n');

    // Images de couverture par catégorie (URLs Unsplash)
    const categoryImages = {
      'Éducation': [
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Santé': [
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Urgence': [
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1574263867128-a3b09ba3c5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Social': [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Mémorial': [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Environnement': [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Sport': [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Culture': [
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ],
      'Animal': [
        'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'
      ]
    };

    // Récupérer toutes les cagnottes sans image
    const cagnottesWithoutImages = await prisma.cagnotte.findMany({
      where: {
        OR: [
          { coverImage: null },
          { coverImage: '' }
        ]
      },
      include: {
        category: true
      }
    });

    console.log(`📊 Cagnottes sans images trouvées: ${cagnottesWithoutImages.length}\n`);

    let updatedCount = 0;
    for (const cagnotte of cagnottesWithoutImages) {
      try {
        // Trouver une image appropriée pour la catégorie
        const categoryName = cagnotte.category?.name || 'Social';
        const availableImages = categoryImages[categoryName as keyof typeof categoryImages] || categoryImages['Social'];
        
        // Sélectionner une image aléatoire
        const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];

        // Mettre à jour la cagnotte avec l'image
        await prisma.cagnotte.update({
          where: { id: cagnotte.id },
          data: { coverImage: randomImage }
        });

        console.log(`✅ "${cagnotte.title}" - Image ajoutée (${categoryName})`);
        updatedCount++;
      } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour de "${cagnotte.title}":`, error);
      }
    }

    console.log('\n🎉 Processus terminé !');
    console.log(`📊 Cagnottes mises à jour: ${updatedCount}/${cagnottesWithoutImages.length}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingCagnotteImages(); 