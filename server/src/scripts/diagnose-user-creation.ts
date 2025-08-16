import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function diagnoseUserCreation() {
  console.log('🔍 DIAGNOSTIC COMPLET - Création d\'utilisateur');
  console.log('================================================');

  try {
    // 1. Vérifier l'état actuel de la base
    console.log('\n📊 1. ÉTAT ACTUEL DE LA BASE DE DONNÉES:');
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
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`Total utilisateurs: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`\n👤 Utilisateur ${index + 1}:`);
      console.log(`  - ID: ${user.id}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Nom: ${user.firstName} ${user.lastName}`);
      console.log(`  - profilePicture: ${user.profilePicture} (type: ${typeof user.profilePicture})`);
      console.log(`  - profileUrl: ${user.profileUrl} (type: ${typeof user.profileUrl})`);
      console.log(`  - profileDescription: ${user.profileDescription} (type: ${typeof user.profileDescription})`);
      console.log(`  - profileVisibility: ${user.profileVisibility} (type: ${typeof user.profileVisibility})`);
      console.log(`  - Créé le: ${user.createdAt}`);
    });

    // 2. Vérifier les séquences PostgreSQL
    console.log('\n🔢 2. VÉRIFICATION DES SÉQUENCES:');
    try {
      const sequences = await prisma.$queryRaw`
        SELECT 
          schemaname,
          sequencename,
          last_value,
          start_value,
          increment_by
        FROM pg_sequences 
        WHERE schemaname = 'public'
      `;
      console.log('Séquences trouvées:', sequences);
    } catch (error) {
      console.log('❌ Erreur lors de la vérification des séquences:', error);
    }

    // 3. Vérifier les contraintes et valeurs par défaut
    console.log('\n🔒 3. VÉRIFICATION DES CONTRAINTES ET VALEURS PAR DÉFAUT:');
    try {
      const constraints = await prisma.$queryRaw`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = 'User' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      ` as any[];
      console.log('Structure de la table User:');
      constraints.forEach((col: any) => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable}, default: ${col.column_default})`);
      });
    } catch (error) {
      console.log('❌ Erreur lors de la vérification des contraintes:', error);
    }

    // 4. Test de création d'un utilisateur de test
    console.log('\n🧪 4. TEST DE CRÉATION D\'UTILISATEUR:');
    const testEmail = `test-diagnostic-${Date.now()}@example.com`;
    
    console.log(`Création d'un utilisateur de test: ${testEmail}`);
    
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: 'test-password-hash',
        firstName: 'Test',
        lastName: 'Diagnostic',
        profilePicture: null,
        profileUrl: null,
        profileDescription: null,
        profileVisibility: 'private',
      },
    });

    console.log('✅ Utilisateur de test créé:');
    console.log(`  - ID: ${testUser.id}`);
    console.log(`  - profilePicture: ${testUser.profilePicture}`);
    console.log(`  - profileUrl: ${testUser.profileUrl}`);
    console.log(`  - profileDescription: ${testUser.profileDescription}`);
    console.log(`  - profileVisibility: ${testUser.profileVisibility}`);

    // 5. Nettoyer l'utilisateur de test
    console.log('\n🧹 5. NETTOYAGE:');
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    console.log('✅ Utilisateur de test supprimé');

    // 6. Vérifier les logs de Prisma
    console.log('\n📝 6. RECOMMANDATIONS:');
    console.log('Si l\'héritage persiste, vérifiez:');
    console.log('  - Les logs du serveur lors de la création');
    console.log('  - Si des middlewares modifient les données');
    console.log('  - Si des hooks Prisma sont actifs');
    console.log('  - Si des triggers PostgreSQL existent');

  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le diagnostic
diagnoseUserCreation()
  .then(() => {
    console.log('\n✅ Diagnostic terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  }); 