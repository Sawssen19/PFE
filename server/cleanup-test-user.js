// 🧹 Script de nettoyage - Supprimer l'utilisateur yzs2142@gmail.com
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupSpecificUser() {
  console.log('🧹 NETTOYAGE DE LA BASE DE DONNÉES');
  console.log('====================================');
  
  try {
    // 🔍 Rechercher l'utilisateur à supprimer
    console.log('🔍 Recherche de l\'utilisateur yzs2142@gmail.com...');
    const userToDelete = await prisma.user.findFirst({
      where: {
        email: 'yzs2142@gmail.com'
      }
    });
    
    if (userToDelete) {
      console.log('👤 Utilisateur trouvé :', userToDelete.email);
      console.log('📅 Date de création :', userToDelete.createdAt);
      console.log('📝 Nom :', userToDelete.firstName, userToDelete.lastName);
      
      // 🗑️ Supprimer l'utilisateur
      console.log('\n🗑️ Suppression de l\'utilisateur yzs2142@gmail.com...');
      await prisma.user.delete({
        where: {
          id: userToDelete.id
        }
      });
      
      console.log('✅ Utilisateur yzs2142@gmail.com supprimé avec succès !');
    } else {
      console.log('✅ Aucun utilisateur avec l\'email yzs2142@gmail.com trouvé');
    }
    
    // 🔍 Vérifier les utilisateurs restants
    console.log('\n🔍 Vérification des utilisateurs restants...');
    const remainingUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        isVerified: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📊 Total d'utilisateurs restants : ${remainingUsers.length}`);
    
    if (remainingUsers.length > 0) {
      console.log('\n👥 Liste des utilisateurs restants :');
      remainingUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - ${user.isVerified ? '✅ Vérifié' : '❌ Non vérifié'} - ${user.createdAt.toLocaleDateString('fr-FR')}`);
      });
    } else {
      console.log('📭 Aucun utilisateur restant dans la base');
    }
    
    console.log('\n🎯 La base est maintenant prête pour les tests !');
    console.log('📧 Vous pouvez créer un nouveau compte pour tester les notifications');
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 🚀 Exécuter le nettoyage
cleanupSpecificUser()
  .then(() => {
    console.log('\n✅ Nettoyage terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Nettoyage échoué:', error);
    process.exit(1);
  }); 