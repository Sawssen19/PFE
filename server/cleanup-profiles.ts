import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupSuspiciousProfilePictures() {
  try {
    console.log('🧹 Début du nettoyage des photos de profil suspectes...');
    
    // 1. Trouver tous les utilisateurs avec des photos suspectes
    const usersWithSuspiciousPhotos = await prisma.user.findMany({
      where: {
        profilePicture: {
          not: null
        }
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        createdAt: true
      }
    });
    
    console.log(`📊 ${usersWithSuspiciousPhotos.length} utilisateurs avec des photos trouvés`);
    
    let cleanedCount = 0;
    let newUsersCleaned = 0;
    
    for (const user of usersWithSuspiciousPhotos) {
      let shouldClean = false;
      let reason = '';
      
      // Vérifier si c'est un nouvel utilisateur (moins de 24h)
      const isNewUser = Date.now() - user.createdAt.getTime() < 24 * 60 * 60 * 1000;
      
      if (isNewUser) {
        shouldClean = true;
        reason = 'Nouvel utilisateur';
        newUsersCleaned++;
      } else if (user.profilePicture) {
        // Vérifier les patterns suspects
        const suspiciousPatterns = [
          'default-avatar',
          'placeholder',
          'anonymous',
          'unknown',
          'temp',
          'old',
          'previous'
        ];
        
        const isSuspicious = suspiciousPatterns.some(pattern => 
          user.profilePicture!.toLowerCase().includes(pattern)
        );
        
        if (isSuspicious) {
          shouldClean = true;
          reason = 'Pattern suspect';
        }
        
        // Vérifier le format
        const hasValidExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(user.profilePicture);
        if (!hasValidExtension) {
          shouldClean = true;
          reason = 'Format invalide';
        }
      }
      
      if (shouldClean) {
        console.log(`🧹 Nettoyage de l'utilisateur ${user.email} (${user.firstName} ${user.lastName}): ${reason}`);
        
        await prisma.user.update({
          where: { id: user.id },
          data: { profilePicture: null }
        });
        
        cleanedCount++;
      }
    }
    
    console.log('\n✅ Nettoyage terminé !');
    console.log(`📊 Résultats:`);
    console.log(`   - Utilisateurs traités: ${usersWithSuspiciousPhotos.length}`);
    console.log(`   - Photos nettoyées: ${cleanedCount}`);
    console.log(`   - Nouveaux utilisateurs nettoyés: ${newUsersCleaned}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le nettoyage
cleanupSuspiciousProfilePictures(); 