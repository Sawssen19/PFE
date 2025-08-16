import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProfileRetrieval() {
  try {
    console.log('🧪 TEST DE RÉCUPÉRATION DE PROFIL...\n');
    
    // 1. Lister tous les utilisateurs
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        profileUrl: true,
        profileDescription: true,
        profileVisibility: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📊 ${allUsers.length} utilisateurs trouvés\n`);
    
    // 2. Tester la logique de récupération pour chaque utilisateur
    allUsers.forEach((user, index) => {
      const isNewUser = Date.now() - user.createdAt.getTime() < 24 * 60 * 60 * 1000;
      const ageInHours = Math.round((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60));
      
      console.log(`${index + 1}. ${user.email} (${user.firstName} ${user.lastName})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Créé: ${user.createdAt.toLocaleString()}`);
      console.log(`   Âge: ${ageInHours}h (${isNewUser ? 'NOUVEAU' : 'ANCIEN'})`);
      console.log(`   Photo: ${user.profilePicture || 'NULL'}`);
      console.log(`   URL: ${user.profileUrl || 'NULL'}`);
      console.log(`   Description: ${user.profileDescription || 'NULL'}`);
      console.log(`   Visibilité: ${user.profileVisibility || 'NULL'}`);
      
      // Simuler la logique du contrôleur
      let profilePicture = user.profilePicture;
      let shouldCleanPhoto = false;
      let reason = '';
      
      // RÈGLE ABSOLUE : Tout nouvel utilisateur doit avoir profilePicture = null
      if (isNewUser && profilePicture !== null) {
        shouldCleanPhoto = true;
        reason = 'Nouvel utilisateur - RÈGLE ABSOLUE';
        console.log(`   🚨 NETTOYAGE ACTIVÉ: ${reason}`);
      }
      
      // Vérifications supplémentaires
      if (profilePicture && !shouldCleanPhoto) {
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
        const seemsLikeOtherUser = profilePicture.includes('profile-') && !profilePicture.includes(user.id);
        
        if (isSuspicious || !hasValidExtension || seemsLikeOtherUser) {
          shouldCleanPhoto = true;
          reason = `Photo suspecte: isSuspicious=${isSuspicious}, hasValidExtension=${hasValidExtension}, seemsLikeOtherUser=${seemsLikeOtherUser}`;
          console.log(`   🚨 NETTOYAGE ACTIVÉ: ${reason}`);
        }
      }
      
      if (shouldCleanPhoto) {
        console.log(`   🧹 PHOTO SERAIT NETTOYÉE: ${profilePicture} → NULL`);
      } else {
        console.log(`   ✅ PHOTO CONSERVÉE: ${profilePicture || 'NULL'}`);
      }
      
      console.log('');
    });
    
    // 3. Analyser le problème
    console.log('🔍 ANALYSE DU PROBLÈME:');
    console.log('   Le contrôleur de profil nettoie TOUS les nouveaux utilisateurs (< 24h)');
    console.log('   Même s\'ils ont des photos valides !');
    console.log('   Cela explique pourquoi test1 hérite des photos de souzana');
    console.log('');
    
    // 4. Recommandations
    console.log('💡 RECOMMANDATIONS:');
    console.log('   1. Modifier la logique de nettoyage pour être plus intelligente');
    console.log('   2. Ne nettoyer que les photos réellement suspectes');
    console.log('   3. Permettre aux nouveaux utilisateurs d\'avoir des photos valides');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testProfileRetrieval(); 