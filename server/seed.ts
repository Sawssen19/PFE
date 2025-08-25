import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Supprimer toutes les données existantes
  await prisma.user.deleteMany({});
  await prisma.accountRequest.deleteMany({});

  console.log('🧹 Données existantes supprimées');

  // Créer l'utilisateur administrateur principal selon le diagramme de classes
  const adminPassword = await bcrypt.hash('Sy@1511919', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'sawssen.yazidi@sesame.com.tn',
      password: adminPassword,
      firstName: 'Sawssen',
      lastName: 'Yazidi',
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
      profileDescription: 'Administrateur principal de la plateforme Kollecta',
      profileUrl: 'https://www.kollecta.com/u/sawssen-yazidi',
      profilePicture: null,
      phone: null,
      birthday: null,
      language: 'fr',
    },
  });

  console.log('✅ Utilisateur administrateur créé:', adminUser.email);

  // Créer quelques utilisateurs de test supplémentaires
  const testPassword = await bcrypt.hash('password123', 10);
  
  const users = [
    {
      email: 'test@example.com',
      password: testPassword,
      firstName: 'Test',
      lastName: 'User',
      role: 'USER' as const,
      isVerified: true,
      isActive: true,
      profileDescription: 'Utilisateur de test pour le développement',
      profileUrl: 'https://www.kollecta.com/u/test-user',
      profilePicture: null,
      phone: null,
      birthday: null,
      language: 'fr',
    },
    {
      email: 'john@example.com',
      password: testPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER' as const,
      isVerified: true,
      isActive: true,
      profileDescription: 'Passionné de technologie et d\'innovation',
      profileUrl: 'https://www.kollecta.com/u/john-doe',
      profilePicture: null,
      phone: null,
      birthday: null,
      language: 'en',
    },
    {
      email: 'jane@example.com',
      password: testPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'USER' as const,
      isVerified: true,
      isActive: true,
      profileDescription: 'Designer créative et entrepreneuse',
      profileUrl: 'https://www.kollecta.com/u/jane-smith',
      profilePicture: null,
      phone: null,
      birthday: null,
      language: 'fr',
    },
    {
      email: 'support@kollecta.com',
      password: testPassword,
      firstName: 'Support',
      lastName: 'Kollecta',
      role: 'SUPPORT' as const,
      isVerified: true,
      isActive: true,
      profileDescription: 'Équipe de support utilisateur',
      profileUrl: 'https://www.kollecta.com/u/support',
      profilePicture: null,
      phone: null,
      birthday: null,
      language: 'fr',
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData,
    });
    console.log('✅ Utilisateur créé:', user.email);
  }

  console.log('\n🎉 Seeding terminé avec succès !');
  console.log('\n📋 Comptes disponibles selon le diagramme de classes Sprint 1 :');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 ADMINISTRATEUR PRINCIPAL :');
  console.log('   Email: sawssen.yazidi@sesame.com.tn');
  console.log('   Mot de passe: Sy@1511919');
  console.log('   Rôle: ADMIN');
  console.log('   Statut: ACTIF & VÉRIFIÉ');
  console.log('');
  console.log('👥 UTILISATEURS DE TEST :');
  console.log('   Email: test@example.com | Mot de passe: password123 | Rôle: USER');
  console.log('   Email: john@example.com | Mot de passe: password123 | Rôle: USER');
  console.log('   Email: jane@example.com | Mot de passe: password123 | Rôle: USER');
  console.log('   Email: support@kollecta.com | Mot de passe: password123 | Rôle: SUPPORT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 L\'utilisateur administrateur correspond au diagramme de classes Sprint 1 :');
  console.log('   - Rôle: ADMIN (hérite de Utilisateur)');
  console.log('   - Statut: ACTIF (Statut.ACTIF)');
  console.log('   - Peut consulterUtilisateurs(), suspendreCompte(), modifierRole()');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 