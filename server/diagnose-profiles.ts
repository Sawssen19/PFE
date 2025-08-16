import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnoseProfileIssue() {
  try {
    console.log('🔍 DIAGNOSTIC CIBLÉ DES PROFILS UTILISATEURS...\n');
    
    // 1. Lister tous les utilisateurs avec leurs photos
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc' // Plus récents en premier
      }
    });
    
    console.log(`📊 ${allUsers.length} utilisateurs trouvés dans la base\n`);
    
    // 2. Analyser chaque utilisateur
    const usersWithPhotos = [];
    const usersWithoutPhotos = [];
    const suspiciousUsers = [];
    
    allUsers.forEach((user, index) => {
      const isNewUser = Date.now() - user.createdAt.getTime() < 24 * 60 * 60 * 1000;
      const ageInHours = Math.round((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60));
      
      console.log(`${index + 1}. ${user.email} (${user.firstName} ${user.lastName})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Photo: ${user.profilePicture || 'NULL'}`);
      console.log(`   Créé: ${user.createdAt.toLocaleString()}`);
      console.log(`   Âge: ${ageInHours}h (${isNewUser ? 'NOUVEAU' : 'ANCIEN'})`);
      
      if (user.profilePicture) {
        usersWithPhotos.push(user);
        
        // Vérifier si c'est suspect
        if (isNewUser) {
          suspiciousUsers.push({
            user,
            reason: 'Nouvel utilisateur avec photo',
            ageInHours
          });
        }
        
        // Vérifier si la photo semble d'un autre utilisateur
        if (user.profilePicture.includes('profile-') && !user.profilePicture.includes(user.id)) {
          suspiciousUsers.push({
            user,
            reason: 'Photo d\'un autre utilisateur',
            ageInHours
          });
        }
        
      } else {
        usersWithoutPhotos.push(user);
      }
      
      console.log('');
    });
    
    // 3. Résumé du diagnostic
    console.log('📋 RÉSUMÉ DU DIAGNOSTIC:');
    console.log(`   - Utilisateurs avec photos: ${usersWithPhotos.length}`);
    console.log(`   - Utilisateurs sans photos: ${usersWithoutPhotos.length}`);
    console.log(`   - Utilisateurs suspects: ${suspiciousUsers.length}`);
    
    if (suspiciousUsers.length > 0) {
      console.log('\n🚨 UTILISATEURS SUSPECTS IDENTIFIÉS:');
      suspiciousUsers.forEach((suspicious, index) => {
        console.log(`   ${index + 1}. ${suspicious.user.email}`);
        console.log(`      Raison: ${suspicious.reason}`);
        console.log(`      Photo: ${suspicious.user.profilePicture}`);
        console.log(`      Âge: ${suspicious.ageInHours}h`);
        console.log('');
      });
      
      // 4. Proposition de correction ciblée
      console.log('🔧 CORRECTION CIBLÉE RECOMMANDÉE:');
      console.log('   Au lieu de nettoyer toute la base, nous allons:');
      console.log('   1. Identifier le compte problématique spécifique');
      console.log('   2. Corriger uniquement ce compte');
      console.log('   3. S\'assurer que les nouveaux comptes n\'héritent jamais de photos');
      console.log('');
      
      // 5. Demander confirmation pour la correction
      console.log('✅ Voulez-vous procéder à la correction ciblée ?');
      console.log('   (Ce script corrigera uniquement les comptes suspects)');
      
    } else {
      console.log('\n✅ Aucun utilisateur suspect trouvé !');
      console.log('   La base de données semble propre.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le diagnostic
diagnoseProfileIssue(); 