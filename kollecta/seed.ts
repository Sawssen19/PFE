import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding pour Kollecta...');

  try {
    // Supprimer toutes les données existantes dans l'ordre des relations
    console.log('🧹 Suppression des données existantes...');
    
    // Supprimer d'abord les promesses (dépendances)
    await prisma.promise.deleteMany({});
    console.log('✅ Promesses supprimées');
    
    // Puis les cagnottes
    await prisma.cagnotte.deleteMany({});
    console.log('✅ Cagnottes supprimées');
    
    // Puis les catégories
    await prisma.category.deleteMany({});
    console.log('✅ Catégories supprimées');
    
    // Enfin les utilisateurs
    await prisma.user.deleteMany({});
    console.log('✅ Utilisateurs supprimés');

    console.log('🧹 Données existantes supprimées');

    // Créer l'utilisateur administrateur principal selon le diagramme de classes Sprint 1
    const adminPassword = await bcrypt.hash('Sy@1511919', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'sawssen.yazidi@sesame.com.tn',
        password: adminPassword,
        firstName: 'Sawssen',
        lastName: 'Yazidi',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });

    console.log('✅ Utilisateur administrateur créé:', adminUser.email);

    // Créer quelques utilisateurs de test
    const testPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        email: 'test@example.com',
        password: testPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
      },
      {
        email: 'john@example.com',
        password: testPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
      },
      {
        email: 'jane@example.com',
        password: testPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
      },
    ];

    for (const userData of users) {
      const user = await prisma.user.create({
        data: userData,
      });
      console.log('✅ Utilisateur créé:', user.email);
    }

    // Créer quelques catégories de base
    const categories = [
      { name: 'Santé', description: 'Campagnes liées à la santé et aux soins médicaux' },
      { name: 'Éducation', description: 'Soutien à l\'éducation et à la formation' },
      { name: 'Environnement', description: 'Projets environnementaux et écologiques' },
      { name: 'Solidarité', description: 'Actions de solidarité et d\'entraide' },
    ];

    for (const categoryData of categories) {
      const category = await prisma.category.create({
        data: categoryData,
      });
      console.log('✅ Catégorie créée:', category.name);
    }

    console.log('\n🎉 Seeding terminé avec succès !');
    console.log('\n📋 Comptes disponibles selon le diagramme de classes Sprint 1 :');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 ADMINISTRATEUR PRINCIPAL :');
    console.log('   Email: sawssen.yazidi@sesame.com.tn');
    console.log('   Mot de passe: Sy@1511919');
    console.log('   Rôle: ADMIN');
    console.log('   Statut: ACTIF');
    console.log('');
    console.log('👥 UTILISATEURS DE TEST :');
    console.log('   Email: test@example.com | Mot de passe: password123 | Rôle: USER');
    console.log('   Email: john@example.com | Mot de passe: password123 | Rôle: USER');
    console.log('   Email: jane@example.com | Mot de passe: password123 | Rôle: USER');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 L\'utilisateur administrateur correspond au diagramme de classes Sprint 1 :');
    console.log('   - Rôle: ADMIN (hérite de Utilisateur)');
    console.log('   - Statut: ACTIF (Statut.ACTIF)');
    console.log('   - Peut consulterUtilisateurs(), suspendreCompte(), modifierRole()');
    console.log('\n🏗️  Structure conforme au schéma Prisma :');
    console.log('   - Modèle User avec Role et UserStatus');
    console.log('   - Modèle Profil intégré dans User');
    console.log('   - Relations avec Cagnotte, Promise, Category');

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 