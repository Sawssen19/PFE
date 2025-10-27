import { EmailService } from '../services/emailService';

async function testAllEmails() {
  console.log('🚀 Démarrage du test des emails SendGrid...\n');
  
  // Test de connexion SendGrid
  console.log('1️⃣ Test de connexion SendGrid...');
  const connectionTest = await EmailService.testConnection();
  if (connectionTest) {
    console.log('✅ Connexion SendGrid OK\n');
  } else {
    console.log('❌ Échec de la connexion SendGrid\n');
    process.exit(1);
  }

  console.log('📧 Test de tous les types d\'emails disponibles...\n');

  // Vous devrez modifier ces valeurs avec de vraies données pour tester
  const testData = {
    userEmail: 'kollecta19@gmail.com', // Email de test
    adminEmail: 'kollecta19@gmail.com',
    firstName: 'Test',
    lastName: 'User',
    verificationToken: 'test-verification-token-123',
    resetToken: 'test-reset-token-123',
    cagnotteTitle: 'Test Cagnotte',
    cagnotteId: 'test-cagnotte-id',
    goalAmount: 1000
  };

  // Liste des tests à effectuer
  const tests = [
    {
      name: 'Email de vérification',
      fn: () => EmailService.sendVerificationEmail(
        testData.userEmail,
        testData.verificationToken,
        testData.firstName
      )
    },
    {
      name: 'Email de réinitialisation de mot de passe',
      fn: () => EmailService.sendPasswordResetEmail(
        testData.userEmail,
        testData.firstName,
        testData.resetToken
      )
    },
    {
      name: 'Email de notification admin (nouveau compte)',
      fn: () => EmailService.sendAdminNotification(
        testData.userEmail,
        testData.firstName,
        testData.lastName
      )
    },
    {
      name: 'Email d\'approbation KYC',
      fn: () => EmailService.sendKYCApprovalEmail(
        testData.userEmail,
        testData.firstName,
        testData.lastName
      )
    },
    {
      name: 'Email de suspension de compte',
      fn: () => EmailService.sendSuspensionEmail(
        testData.userEmail,
        testData.firstName,
        testData.lastName
      )
    },
    {
      name: 'Email de confirmation de création de cagnotte',
      fn: () => EmailService.sendCagnotteCreationConfirmationEmail(
        testData.userEmail,
        testData.firstName,
        testData.cagnotteTitle,
        testData.cagnotteId
      )
    },
    {
      name: 'Email de notification admin (cagnotte créée)',
      fn: () => EmailService.sendCagnotteCreationAdminNotificationEmail(
        testData.adminEmail,
        testData.firstName,
        testData.lastName,
        testData.userEmail,
        testData.cagnotteTitle,
        testData.cagnotteId,
        testData.goalAmount
      )
    }
  ];

  // Exécuter tous les tests
  for (const test of tests) {
    console.log(`📤 Test: ${test.name}...`);
    try {
      const result = await test.fn();
      if (result) {
        console.log(`✅ ${test.name} - Envoyé avec succès\n`);
      } else {
        console.log(`❌ ${test.name} - Échec de l'envoi\n`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - Erreur: ${error}\n`);
    }
    // Attendre 1 seconde entre chaque email pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('✅ Tests terminés ! Vérifiez votre boîte mail.');
}

// Exécuter les tests
testAllEmails()
  .then(() => {
    console.log('\n🎉 Tous les tests sont terminés');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erreur lors des tests:', error);
    process.exit(1);
  });

