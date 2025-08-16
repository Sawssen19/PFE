import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function testProfileEndpoint() {
  console.log('🧪 TEST DE L\'ENDPOINT DE PROFIL');
  console.log('==================================');

  try {
    // 1. Trouver l'utilisateur test6
    const test6User = await prisma.user.findUnique({
      where: { email: 'test6@live.com' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        profileUrl: true,
        profileDescription: true,
        profileVisibility: true,
      }
    });

    if (!test6User) {
      console.log('❌ Utilisateur test6 non trouvé');
      return;
    }

    console.log('👤 Utilisateur test6 trouvé:');
    console.log('  - ID:', test6User.id);
    console.log('  - Email:', test6User.email);
    console.log('  - profilePicture:', test6User.profilePicture);
    console.log('  - profileUrl:', test6User.profileUrl);

    // 2. Créer un token JWT pour test6
    const token = jwt.sign(
      { userId: test6User.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '24h' }
    );

    console.log('\n🔑 Token JWT créé pour test6:');
    console.log('  - Token:', token.substring(0, 50) + '...');

    // 3. Simuler l'appel à l'endpoint
    console.log('\n📡 Simulation de l\'appel à /api/users/:userId/profile');
    console.log('  - URL:', `/api/users/${test6User.id}/profile`);
    console.log('  - Method: GET');
    console.log('  - Headers: Authorization: Bearer [TOKEN]');

    // 4. Vérifier ce que devrait retourner l'endpoint
    console.log('\n🔍 Ce que l\'endpoint devrait retourner:');
    console.log('  - ID:', test6User.id);
    console.log('  - Email:', test6User.email);
    console.log('  - profilePicture:', test6User.profilePicture);
    console.log('  - profileUrl:', test6User.profileUrl);

    // 5. Vérifier la logique du controller
    console.log('\n🧠 Logique du controller:');
    console.log('  - req.user.id devrait être:', test6User.id);
    console.log('  - req.params.userId sera:', test6User.id);
    console.log('  - L\'endpoint devrait chercher l\'utilisateur avec ID:', test6User.id);

    // 6. Vérifier si l'utilisateur existe bien avec cet ID
    const userFromDB = await prisma.user.findUnique({
      where: { id: test6User.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        profileUrl: true,
        profileDescription: true,
        profileVisibility: true,
      }
    });

    console.log('\n📊 Vérification directe en base:');
    if (userFromDB) {
      console.log('✅ Utilisateur trouvé en base:');
      console.log('  - ID:', userFromDB.id);
      console.log('  - Email:', userFromDB.email);
      console.log('  - profilePicture:', userFromDB.profilePicture);
      console.log('  - profileUrl:', userFromDB.profileUrl);
    } else {
      console.log('❌ Utilisateur NON trouvé en base avec cet ID');
    }

    // 7. Vérifier s'il y a un problème de cache ou de session
    console.log('\n🔍 Vérifications supplémentaires:');
    console.log('  - Le backend a-t-il redémarré ?');
    console.log('  - Les routes sont-elles bien montées ?');
    console.log('  - Le middleware d\'auth est-il actif ?');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le test
testProfileEndpoint()
  .then(() => {
    console.log('\n✅ Test terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }); 