import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCagnotteImages() {
  try {
    console.log('🔍 Vérification des images des cagnottes...\n');

    // Vérifier toutes les cagnottes
    const cagnottes = await prisma.cagnotte.findMany({
      select: {
        id: true,
        title: true,
        coverImage: true,
        status: true
      }
    });

    console.log(`📊 Total des cagnottes: ${cagnottes.length}\n`);

    let withImages = 0;
    let withoutImages = 0;

    for (const cagnotte of cagnottes) {
      if (cagnotte.coverImage) {
        withImages++;
        console.log(`✅ "${cagnotte.title}"`);
        console.log(`   ID: ${cagnotte.id}`);
        console.log(`   Status: ${cagnotte.status}`);
        console.log(`   Cover Image: ${cagnotte.coverImage || 'Aucune'}`);

        console.log('');
      } else {
        withoutImages++;
        console.log(`❌ "${cagnotte.title}" - AUCUNE IMAGE`);
        console.log(`   ID: ${cagnotte.id}`);
        console.log(`   Status: ${cagnotte.status}`);
        console.log('');
      }
    }

    console.log('📈 Résumé:');
    console.log(`   ✅ Cagnottes avec images: ${withImages}`);
    console.log(`   ❌ Cagnottes sans images: ${withoutImages}`);
    console.log(`   📊 Total: ${cagnottes.length}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCagnotteImages(); 