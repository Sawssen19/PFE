import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Supprimer toutes les données existantes
  await prisma.user.deleteMany({});

  // Créer un utilisateur de test
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      firstName: 'Sawssen',
      lastName: 'Yz',
      role: 'USER',
      isVerified: true,
      profileVisibility: 'public',
      profileDescription: 'Développeuse passionnée par les projets innovants',
      profileUrl: 'https://www.kollecta.com/u/sawssen-yz',
      profilePicture: null,
    },
  });

  console.log('✅ Utilisateur de test créé:', testUser.email);

  // Créer quelques utilisateurs supplémentaires
  const users = [
    {
      email: 'john@example.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER' as const,
      isVerified: true,
      profileVisibility: 'public' as const,
      profileDescription: 'Passionné de technologie et d\'innovation',
      profileUrl: 'https://www.kollecta.com/u/john-doe',
    },
    {
      email: 'jane@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'USER' as const,
      isVerified: true,
      profileVisibility: 'public' as const,
      profileDescription: 'Designer créative et entrepreneuse',
      profileUrl: 'https://www.kollecta.com/u/jane-smith',
    },
    {
      email: 'admin@kollecta.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'Kollecta',
      role: 'ADMIN' as const,
      isVerified: true,
      profileVisibility: 'public' as const,
      profileDescription: 'Administrateur de la plateforme Kollecta',
      profileUrl: 'https://www.kollecta.com/u/admin',
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.create({
      data: userData,
    });
    console.log('✅ Utilisateur créé:', user.email);
  }

  console.log('🎉 Seeding terminé avec succès !');
  console.log('\n📋 Comptes de test disponibles :');
  console.log('Email: test@example.com | Mot de passe: password123');
  console.log('Email: john@example.com | Mot de passe: password123');
  console.log('Email: jane@example.com | Mot de passe: password123');
  console.log('Email: admin@kollecta.com | Mot de passe: password123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 