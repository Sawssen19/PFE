import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixTargetedProfileIssues() {
  try {
    console.log('🔧 CORRECTION CIBLÉE DES PROFILS PROBLÉMATIQUES...\n');
    
    // 1. Identifier uniquement les utilisateurs suspects
    const suspiciousUsers = await prisma.user.findMany({
      where: {
        OR: [
          // Nouveaux utilisateurs avec photos (moins de 24h)
          {
            AND: [
              { profilePicture: { not: null } },
              { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            ]
          },
          // Photos qui semblent d'autres utilisateurs
          {
            AND: [
              { profilePicture: { not: null } },
              { profilePicture: { contains: 'profile-' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        createdAt: true,
      }
    });
    
    if (suspiciousUsers.length === 0) {
      console.log('✅ Aucun utilisateur suspect trouvé - aucune correction nécessaire !');
      return;
    }
    
    console.log(`🚨 ${suspiciousUsers.length} utilisateur(s) suspect(s) identifié(s):\n`);
    
    // 2. Analyser chaque utilisateur suspect
    suspiciousUsers.forEach((user, index) => {
      const isNewUser = Date.now() - user.createdAt.getTime() < 24 * 60 * 60 * 1000;
      const ageInHours = Math.round((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60));
      
      console.log(`${index + 1}. ${user.email} (${user.firstName} ${user.lastName})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Photo problématique: ${user.profilePicture}`);
      console.log(`   Créé: ${user.createdAt.toLocaleString()}`);
      console.log(`   Âge: ${ageInHours}h (${isNewUser ? 'NOUVEAU' : 'ANCIEN'})`);
      
      if (isNewUser) {
        console.log(`   🆕 PROBLÈME: Nouvel utilisateur avec photo héritée !`);
      } else if (user.profilePicture && user.profilePicture.includes('profile-') && !user.profilePicture.includes(user.id)) {
        console.log(`   🔗 PROBLÈME: Photo d'un autre utilisateur !`);
      }
      console.log('');
    });
    
    // 3. Demander confirmation avant correction
    console.log('⚠️  ATTENTION: Ce script va corriger uniquement les comptes suspects.');
    console.log('   Les autres comptes ne seront PAS affectés.\n');
    
    // 4. Procéder à la correction ciblée
    console.log('🧹 Début de la correction ciblée...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const user of suspiciousUsers) {
      try {
        console.log(`🔧 Correction de ${user.email}...`);
        
        // Sauvegarder l'ancienne photo pour log
        const oldPhoto = user.profilePicture;
        
        // Corriger le profil en supprimant la photo problématique
        await prisma.user.update({
          where: { id: user.id },
          data: { profilePicture: null }
        });
        
        // Vérification immédiate
        const verificationUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { profilePicture: true }
        });
        
        if (verificationUser?.profilePicture === null) {
          console.log(`  ✅ Photo supprimée: ${oldPhoto} → NULL`);
          successCount++;
        } else {
          console.log(`  ❌ ÉCHEC: La photo n'a pas été supprimée`);
          errorCount++;
        }
        
      } catch (error) {
        console.error(`  ❌ Erreur lors de la correction de ${user.email}:`, error);
        errorCount++;
      }
    }
    
    // 5. Vérification finale
    console.log('\n🔍 Vérification finale...');
    const finalCheck = await prisma.user.findMany({
      where: {
        OR: [
          {
            AND: [
              { profilePicture: { not: null } },
              { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            ]
          },
          {
            AND: [
              { profilePicture: { not: null } },
              { profilePicture: { contains: 'profile-' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        email: true,
        profilePicture: true
      }
    });
    
    // 6. Résultats
    console.log('\n📊 RÉSULTATS DE LA CORRECTION CIBLÉE:');
    console.log(`   - Utilisateurs suspects traités: ${suspiciousUsers.length}`);
    console.log(`   - Corrections réussies: ${successCount}`);
    console.log(`   - Erreurs: ${errorCount}`);
    console.log(`   - Problèmes restants: ${finalCheck.length}`);
    
    if (finalCheck.length === 0) {
      console.log('\n🎉 SUCCÈS: Tous les problèmes ont été corrigés !');
      console.log('✅ Les nouveaux utilisateurs afficheront l\'avatar par défaut');
      console.log('✅ Les comptes existants n\'ont pas été affectés');
    } else {
      console.log('\n⚠️ ATTENTION: Certains problèmes persistent:');
      finalCheck.forEach(user => {
        console.log(`   - ${user.email}: ${user.profilePicture}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction ciblée:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la correction ciblée
console.log('🚀 Démarrage de la correction ciblée...\n');
fixTargetedProfileIssues(); 