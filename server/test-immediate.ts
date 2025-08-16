import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testImmediateProfileLogic() {
  try {
    console.log('🧪 TEST IMMÉDIAT DE LA LOGIQUE DE PROFIL...\n');
    
    // 1. Créer un utilisateur de test
    console.log('📝 Création d\'un utilisateur de test...');
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'Immediate',
        // NE PAS spécifier profilePicture - doit être null par défaut
      },
    });
    
    console.log('✅ Utilisateur de test créé:', {
      id: testUser.id,
      email: testUser.email,
      profilePicture: testUser.profilePicture,
      isClean: testUser.profilePicture === null
    });
    
    // 2. Vérifier immédiatement si profilePicture est null
    if (testUser.profilePicture !== null) {
      console.log('🚨 PROBLÈME: L\'utilisateur a été créé avec une photo!');
      console.log('🧹 Tentative de nettoyage immédiat...');
      
      await prisma.user.update({
        where: { id: testUser.id },
        data: { profilePicture: null }
      });
      
      console.log('✅ Nettoyage effectué');
    } else {
      console.log('✅ SUCCÈS: L\'utilisateur a été créé sans photo');
    }
    
    // 3. Simuler la récupération du profil (comme dans le contrôleur)
    console.log('\n🔍 Test de la logique de récupération du profil...');
    
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
    let reason = '';
    
    // Vérifier si c'est un nouvel utilisateur (moins de 24h)
    const isNewUser = Date.now() - user.createdAt.getTime() < 24 * 60 * 60 * 1000;
    
    // RÈGLE ABSOLUE : Tout nouvel utilisateur doit avoir profilePicture = null
    if (isNewUser) {
      shouldCleanPhoto = true;
      reason = 'Nouvel utilisateur - RÈGLE ABSOLUE';
      console.log('🆕 NOUVEL UTILISATEUR DÉTECTÉ - Application de la RÈGLE ABSOLUE');
    }
    
    if (shouldCleanPhoto) {
      console.log('🚨 NETTOYAGE AGGRESSIF:', {
        userId: user.id,
        reason,
        currentPhoto: profilePicture,
        isNewUser
      });
      
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { profilePicture: null }
        });
        
        profilePicture = null;
        console.log('✅ Photo nettoyée avec succès');
        
      } catch (cleanupError) {
        console.error('❌ Erreur lors du nettoyage:', cleanupError);
        profilePicture = null;
      }
    }
    
    // 4. Vérifier le résultat final
    const finalUser = await prisma.user.findUnique({
      where: { id: testUser.id }
    });
    
    console.log('\n📊 RÉSULTAT FINAL:', {
      id: finalUser?.id,
      email: finalUser?.email,
      profilePicture: finalUser?.profilePicture,
      shouldShowDefaultAvatar: !finalUser?.profilePicture,
      isClean: finalUser?.profilePicture === null
    });
    
    if (!finalUser?.profilePicture) {
      console.log('✅ SUCCÈS TOTAL: L\'utilisateur affichera l\'avatar par défaut');
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

// Exécuter le test immédiat
console.log('🚀 Démarrage du test immédiat...\n');
testImmediateProfileLogic(); 