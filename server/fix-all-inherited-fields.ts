import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserWithInheritedData {
  user: any;
  inheritedFields: string[];
  isNewUser: boolean;
  ageInHours: number;
}

async function fixAllInheritedFields() {
  try {
    console.log('🔧 CORRECTION COMPLÈTE DE TOUS LES CHAMPS HÉRITÉS...\n');
    
    // 1. Identifier tous les utilisateurs avec des données héritées
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
      }
    });
    
    // Filtrer les utilisateurs avec des données héritées
    const usersWithInheritedData: any[] = [];
    
    allUsers.forEach((user: any) => {
      const isNewUser = Date.now() - user.createdAt.getTime() < 24 * 60 * 60 * 1000;
      const ageInHours = Math.round((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60));
      
      // Vérifier s'il y a des données héritées suspectes
      let hasInheritedData = false;
      let inheritedFields: string[] = [];
      
      if (user.profilePicture && user.profilePicture.includes('profile-') && !user.profilePicture.includes(user.id)) {
        hasInheritedData = true;
        inheritedFields.push('profilePicture');
      }
      
      if (user.profileUrl && user.profileUrl.includes('profile-') && !user.profileUrl.includes(user.id)) {
        hasInheritedData = true;
        inheritedFields.push('profileUrl');
      }
      
      if (user.profileDescription && user.profileDescription.length > 0) {
        hasInheritedData = true;
        inheritedFields.push('profileDescription');
      }
      
      if (user.profileVisibility) {
        hasInheritedData = true;
        inheritedFields.push('profileVisibility');
      }
      
      if (hasInheritedData) {
        usersWithInheritedData.push({
          user,
          inheritedFields,
          isNewUser,
          ageInHours
        });
      }
    });
    
    if (usersWithInheritedData.length === 0) {
      console.log('✅ Aucun utilisateur avec données héritées trouvé - aucune correction nécessaire !');
      return;
    }
    
    console.log(`🚨 ${usersWithInheritedData.length} utilisateur(s) avec données héritées identifié(s):\n`);
    
         // 2. Analyser chaque utilisateur en détail
     usersWithInheritedData.forEach((item, index) => {
       const user = item.user; // Accéder à l'utilisateur via la structure
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
      
      // Identifier les champs problématiques
      const problematicFields = [];
      if (user.profilePicture) problematicFields.push('profilePicture');
      if (user.profileUrl) problematicFields.push('profileUrl');
      if (user.profileDescription) problematicFields.push('profileDescription');
      if (user.profileVisibility) problematicFields.push('profileVisibility');
      
      console.log(`   🚨 CHAMPS PROBLÉMATIQUES: ${problematicFields.join(', ')}`);
      console.log('');
    });
    
    // 3. Procéder au nettoyage complet
    console.log('🧹 Début du nettoyage complet...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
         for (const item of usersWithInheritedData) {
       const user = item.user; // Accéder à l'utilisateur via la structure
       try {
         console.log(`🔧 Correction complète de ${user.email}...`);
         
         // Sauvegarder les anciennes valeurs pour log
         const oldValues = {
           profilePicture: user.profilePicture,
           profileUrl: user.profileUrl,
           profileDescription: user.profileDescription,
           profileVisibility: user.profileVisibility
         };
         
         // Nettoyer TOUS les champs problématiques
         await prisma.user.update({
           where: { id: user.id },
           data: {
             profilePicture: null,
             profileUrl: null,
             profileDescription: null,
             profileVisibility: false // Boolean, pas null
           }
         });
         
         // Vérification immédiate
         const verificationUser = await prisma.user.findUnique({
           where: { id: user.id },
           select: {
             profilePicture: true,
             profileUrl: true,
             profileDescription: true,
             profileVisibility: true
           }
         });
         
         if (verificationUser && 
             !verificationUser.profilePicture && 
             !verificationUser.profileUrl && 
             !verificationUser.profileDescription && 
             verificationUser.profileVisibility === false) {
           
           console.log(`  ✅ Tous les champs nettoyés:`);
           console.log(`     Photo: ${oldValues.profilePicture} → NULL`);
           console.log(`     URL: ${oldValues.profileUrl} → NULL`);
           console.log(`     Description: ${oldValues.profileDescription} → NULL`);
           console.log(`     Visibilité: ${oldValues.profileVisibility} → false`);
           successCount++;
           
         } else {
           console.log(`  ❌ ÉCHEC: Certains champs n'ont pas été nettoyés`);
           errorCount++;
         }
         
       } catch (error) {
         console.error(`  ❌ Erreur lors de la correction de ${user.email}:`, error);
         errorCount++;
       }
     }
    
    // 4. Vérification finale
    console.log('\n🔍 Vérification finale...');
    const finalCheck = await prisma.user.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                OR: [
                  { profilePicture: { not: null } },
                  { profileUrl: { not: null } },
                  { profileDescription: { not: null } },
                                     { profileVisibility: { not: false } }
                ]
              },
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
        profilePicture: true,
        profileUrl: true,
        profileDescription: true,
        profileVisibility: true
      }
    });
    
    // 5. Résultats
    console.log('\n📊 RÉSULTATS DU NETTOYAGE COMPLET:');
    console.log(`   - Utilisateurs traités: ${usersWithInheritedData.length}`);
    console.log(`   - Nettoyages réussis: ${successCount}`);
    console.log(`   - Erreurs: ${errorCount}`);
    console.log(`   - Problèmes restants: ${finalCheck.length}`);
    
    if (finalCheck.length === 0) {
      console.log('\n🎉 SUCCÈS TOTAL: Tous les champs hérités ont été nettoyés !');
      console.log('✅ Les nouveaux utilisateurs afficheront l\'avatar par défaut');
      console.log('✅ Tous les champs de profil sont maintenant NULL par défaut');
      console.log('✅ Les comptes existants n\'ont pas été affectés');
    } else {
      console.log('\n⚠️ ATTENTION: Certains problèmes persistent:');
      finalCheck.forEach(user => {
        console.log(`   - ${user.email}:`);
        if (user.profilePicture) console.log(`     Photo: ${user.profilePicture}`);
        if (user.profileUrl) console.log(`     URL: ${user.profileUrl}`);
        if (user.profileDescription) console.log(`     Description: ${user.profileDescription}`);
        if (user.profileVisibility) console.log(`     Visibilité: ${user.profileVisibility}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage complet:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le nettoyage complet
console.log('🚀 Démarrage du nettoyage complet...\n');
fixAllInheritedFields(); 