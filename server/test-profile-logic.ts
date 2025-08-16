import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProfileLogic() {
  try {
    console.log('🧪 Test de la logique de gestion des photos de profil...\n');
    
    // 1. Créer un utilisateur de test
    console.log('📝 Création d\'un utilisateur de test...');
    const testUser = await prisma.user.create({
      data: {
        email: 'test-profile@example.com',
        password: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'Profile',
        profilePicture: null, // Explicitement null
      },
    });
    
    console.log('✅ Utilisateur de test créé:', {
      id: testUser.id,
      email: testUser.email,
      profilePicture: testUser.profilePicture
    });
    
    // 2. Simuler une photo suspecte
    console.log('\n🔍 Simulation d\'une photo suspecte...');
    await prisma.user.update({
      where: { id: testUser.id },
      data: { 
        profilePicture: '/uploads/profile-123456789-old.jpg' // Photo suspecte
      }
    });
    
    const userWithSuspiciousPhoto = await prisma.user.findUnique({
      where: { id: testUser.id }
    });
    
    console.log('⚠️ Photo suspecte assignée:', userWithSuspiciousPhoto?.profilePicture);
    
    // 3. Tester la logique de nettoyage
    console.log('\n🧹 Test de la logique de nettoyage...');
    
    const user = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePicture: true,
        createdAt: true,
      }
    });
    
    if (!user) {
      throw new Error('Utilisateur de test non trouvé');
    }
    
    // LOGIQUE DE NETTOYAGE (copiée du contrôleur)
    let profilePicture = user.profilePicture;
    let shouldCleanPhoto = false;
    
    // Vérifier si c'est un nouvel utilisateur (moins de 24h)
    const isNewUser = Date.now() - user.createdAt.getTime() < 24 * 60 * 60 * 1000;
    
    // Vérifier si la photo semble suspecte
    if (profilePicture) {
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
        profilePicture!.toLowerCase().includes(pattern)
      );
      
      const hasValidExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(profilePicture);
      const seemsLikeOtherUser = profilePicture.includes('profile-') && 
                                !profilePicture.includes(user.id);
      
      if (isNewUser || isSuspicious || !hasValidExtension || seemsLikeOtherUser) {
        console.log('🚨 Photo suspecte détectée:', {
          profilePicture,
          isNewUser,
          isSuspicious,
          hasValidExtension,
          seemsLikeOtherUser
        });
        
        shouldCleanPhoto = true;
        profilePicture = null;
      }
    }
    
    // Nettoyer la base de données si nécessaire
    if (shouldCleanPhoto) {
      console.log('🧹 Nettoyage de la photo suspecte...');
      await prisma.user.update({
        where: { id: user.id },
        data: { profilePicture: null }
      });
      console.log('✅ Photo nettoyée avec succès');
    }
    
    // 4. Vérifier le résultat final
    const finalUser = await prisma.user.findUnique({
      where: { id: testUser.id }
    });
    
    console.log('\n📊 Résultat final:', {
      id: finalUser?.id,
      email: finalUser?.email,
      profilePicture: finalUser?.profilePicture,
      shouldShowDefaultAvatar: !finalUser?.profilePicture
    });
    
    if (!finalUser?.profilePicture) {
      console.log('✅ SUCCÈS: L\'utilisateur affichera l\'avatar par défaut');
    } else {
      console.log('❌ ÉCHEC: L\'utilisateur a encore une photo suspecte');
    }
    
    // 5. Nettoyer l'utilisateur de test
    console.log('\n🧹 Nettoyage de l\'utilisateur de test...');
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Utilisateur de test supprimé');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testProfileLogic(); 