import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserWithInheritedData {
  user: any;
  inheritedFields: string[];
  isNewUser: boolean;
  ageInHours: number;
}

async function diagnoseCompleteInheritance() {
  try {
    console.log('🔍 DIAGNOSTIC COMPLET DE L\'HÉRITAGE DE PROFIL...\n');
    
    // 1. Lister TOUS les utilisateurs avec TOUS leurs champs
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
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc' // Plus récents en premier
      }
    });
    
    console.log(`📊 ${allUsers.length} utilisateurs trouvés dans la base\n`);
    
    // 2. Analyser chaque utilisateur en détail
    const usersWithInheritedData: UserWithInheritedData[] = [];
    const cleanUsers: any[] = [];
    
    allUsers.forEach((user: any, index: number) => {
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
      
      // Vérifier s'il y a des données héritées suspectes
      let hasInheritedData = false;
      let inheritedFields = [];
      
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
        console.log(`   🚨 DONNÉES HÉRITÉES: ${inheritedFields.join(', ')}`);
        usersWithInheritedData.push({
          user,
          inheritedFields,
          isNewUser,
          ageInHours
        });
      } else {
        console.log(`   ✅ Aucune donnée héritée`);
        cleanUsers.push(user);
      }
      
      console.log('');
    });
    
    // 3. Résumé du diagnostic
    console.log('📋 RÉSUMÉ DU DIAGNOSTIC COMPLET:');
    console.log(`   - Utilisateurs avec données héritées: ${usersWithInheritedData.length}`);
    console.log(`   - Utilisateurs propres: ${cleanUsers.length}`);
    console.log(`   - Total: ${allUsers.length}`);
    
    if (usersWithInheritedData.length > 0) {
      console.log('\n🚨 UTILISATEURS AVEC DONNÉES HÉRITÉES:');
      usersWithInheritedData.forEach((problematic, index) => {
        console.log(`   ${index + 1}. ${problematic.user.email}`);
        console.log(`      Champs hérités: ${problematic.inheritedFields.join(', ')}`);
        console.log(`      Nouvel utilisateur: ${problematic.isNewUser ? 'OUI' : 'NON'}`);
        console.log(`      Âge: ${problematic.ageInHours}h`);
        console.log('');
      });
      
      // 4. Analyse du problème
      console.log('🔍 ANALYSE DU PROBLÈME:');
      console.log('   Le problème semble être dans la CRÉATION de l\'utilisateur, pas dans la logique de nettoyage.');
      console.log('   Possiblement:');
      console.log('   - Problème de séquence/auto-increment dans la base');
      console.log('   - Requête SQL défaillante lors de l\'insertion');
      console.log('   - Héritage de valeurs par défaut incorrectes');
      console.log('   - Problème de transaction ou de rollback');
      console.log('');
      
      // 5. Vérifier la structure de la base
      console.log('🏗️ VÉRIFICATION DE LA STRUCTURE DE LA BASE:');
      console.log('   Vérifions si le problème vient du schéma Prisma...');
      
      // 6. Recommandations
      console.log('💡 RECOMMANDATIONS IMMÉDIATES:');
      console.log('   1. Vérifier le schéma Prisma (profileUrl, profileDescription defaults)');
      console.log('   2. Examiner la logique de création d\'utilisateur');
      console.log('   3. Vérifier les contraintes de base de données');
      console.log('   4. Nettoyer TOUS les champs hérités, pas seulement la photo');
      
    } else {
      console.log('\n✅ Aucun utilisateur avec données héritées trouvé !');
      console.log('   La base de données semble propre.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic complet:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le diagnostic complet
diagnoseCompleteInheritance(); 