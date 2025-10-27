import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function restoreImages() {
  console.log('\n🔄 RESTAURATION DES IMAGES...\n');
  console.log('⚠️  Ce script va SEULEMENT ajouter des images aux cagnottes qui n\'en ont PAS.\n');
  console.log('✅ Il ne touchera PAS aux cagnottes qui ont déjà une image.\n');

  try {
    // 1. Lister tous les fichiers dans le dossier uploads
    const uploadsDir = path.join(__dirname, '../../uploads/cagnottes');
    const files = fs.readdirSync(uploadsDir);
    
    console.log(`📁 Trouvé ${files.length} fichiers dans uploads/cagnottes\n`);

    // 2. Récupérer les cagnottes SANS image
    const cagnottesWithoutImages = await prisma.cagnotte.findMany({
      where: {
        OR: [
          { coverImage: null },
          { coverImage: '' }
        ]
      },
      select: {
        id: true,
        title: true,
        coverImage: true,
        mediaFilename: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Trouvé ${cagnottesWithoutImages.length} cagnottes sans image\n`);

    // 3. Créer une correspondance basée sur mediaFilename
    let restoredCount = 0;

    for (const cagnotte of cagnottesWithoutImages) {
      // Si la cagnotte a un mediaFilename, essayer de le trouver
      if (cagnotte.mediaFilename && files.includes(cagnotte.mediaFilename)) {
        const ext = path.extname(cagnotte.mediaFilename).toLowerCase();
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const videoExtensions = ['.mp4', '.mov', '.avi', '.webm'];

        let updateData: any = {};

        if (imageExtensions.includes(ext)) {
          updateData.coverImage = `/uploads/cagnottes/${cagnotte.mediaFilename}`;
          updateData.mediaType = 'image';
        } else if (videoExtensions.includes(ext)) {
          updateData.coverVideo = `/uploads/cagnottes/${cagnotte.mediaFilename}`;
          updateData.mediaType = 'video';
        }

        if (updateData.coverImage || updateData.coverVideo) {
          await prisma.cagnotte.update({
            where: { id: cagnotte.id },
            data: updateData
          });

          console.log(`✅ RESTAURÉ: "${cagnotte.title}"`);
          console.log(`   Fichier: ${cagnotte.mediaFilename}\n`);
          restoredCount++;
        }
      }
    }

    console.log(`\n🎉 ${restoredCount} image(s) restaurée(s) !`);

    if (restoredCount === 0) {
      console.log('\n⚠️  Aucune image n\'a pu être restaurée automatiquement.');
      console.log('   Raison possible: Les cagnottes n\'ont pas de mediaFilename enregistré.');
      console.log('\n💡 Solution: Re-uploader les images via l\'interface de modification des cagnottes.');
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreImages()
  .then(() => {
    console.log('\n✅ Script terminé !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erreur:', error);
    process.exit(1);
  });

