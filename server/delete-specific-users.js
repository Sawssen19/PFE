const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function deleteSpecificUsers() {
  try {
    console.log('🔍 Recherche des utilisateurs à supprimer...');
    
    // Rechercher les utilisateurs par email
    const user1 = await prisma.user.findUnique({
      where: { email: 'sawssen.yazidi@sesame.com.tn' }
    });
    
    const user2 = await prisma.user.findUnique({
      where: { email: 'yzs2142@gmail.com' }
    });
    
    const user3 = await prisma.user.findUnique({
      where: { email: 'sawssen1511919@gmail.com' }
    });
    
    console.log('\n📋 Utilisateurs trouvés :');
    if (user1) {
      console.log(`- ${user1.email} (ID: ${user1.id})`);
    } else {
      console.log('- sawssen.yazidi@sesame.com.tn : Non trouvé');
    }
    
    if (user2) {
      console.log(`- ${user2.email} (ID: ${user2.id})`);
    } else {
      console.log('- yzs2142@gmail.com : Non trouvé');
    }
    
    if (user3) {
      console.log(`- ${user3.email} (ID: ${user3.id})`);
    } else {
      console.log('- sawssen1511919@gmail.com : Non trouvé');
    }
    
    // Supprimer les utilisateurs trouvés
    let deletedCount = 0;
    
    if (user1) {
      console.log(`\n🗑️  Suppression de ${user1.email}...`);
      await prisma.user.delete({
        where: { id: user1.id }
      });
      console.log(`✅ ${user1.email} supprimé avec succès`);
      deletedCount++;
    }
    
    if (user2) {
      console.log(`\n🗑️  Suppression de ${user2.email}...`);
      await prisma.user.delete({
        where: { id: user2.id }
      });
      console.log(`✅ ${user2.email} supprimé avec succès`);
      deletedCount++;
    }
    
    if (user3) {
      console.log(`\n🗑️  Suppression de ${user3.email}...`);
      await prisma.user.delete({
        where: { id: user3.id }
      });
      console.log(`✅ ${user3.email} supprimé avec succès`);
      deletedCount++;
    }
    
    console.log(`\n🎯 Résumé : ${deletedCount} utilisateur(s) supprimé(s)`);
    
    if (deletedCount === 0) {
      console.log('ℹ️  Aucun utilisateur à supprimer trouvé');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la suppression :', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
deleteSpecificUsers(); 