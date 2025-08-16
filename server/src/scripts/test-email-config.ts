import { EmailService } from '../services/emailService';

// 🧪 Script de test pour la configuration SendGrid
async function testSendGridConfiguration() {
  console.log('🧪 TEST DE LA CONFIGURATION SENDGRID');
  console.log('=====================================');
  
  try {
    // ✅ Tester la connexion au service SendGrid
    console.log('1. Test de connexion au service SendGrid...');
    const isConnected = await EmailService.testConnection();
    
    if (isConnected) {
      console.log('✅ Configuration SendGrid valide !');
      
      // 📧 Test d'envoi d'email de vérification
      console.log('\n2. Test d\'envoi d\'email de vérification...');
      const testToken = 'test-verification-token-12345';
      
      try {
        await EmailService.sendVerificationEmail(
          'test@example.com',
          'Test User',
          testToken
        );
        console.log('✅ Email de vérification envoyé avec succès !');
      } catch (emailError: any) {
        console.log('⚠️ Erreur lors de l\'envoi (normal en mode test):', emailError.message);
      }
      
      // 🔄 Test d'envoi d'email de renvoi
      console.log('\n3. Test d\'envoi d\'email de renvoi...');
      try {
        await EmailService.sendResendVerificationEmail(
          'test@example.com',
          'Test User',
          testToken
        );
        console.log('✅ Email de renvoi envoyé avec succès !');
      } catch (emailError: any) {
        console.log('⚠️ Erreur lors de l\'envoi (normal en mode test):', emailError.message);
      }
      
    } else {
      console.log('❌ Configuration SendGrid invalide !');
      console.log('\n🔧 Pour configurer SendGrid :');
      console.log('1. Créez un compte sur https://sendgrid.com');
      console.log('2. Générez une clé API dans Settings > API Keys');
      console.log('3. Vérifiez votre domaine d\'expédition');
      console.log('4. Ajoutez ces variables dans votre .env :');
      console.log('   SENDGRID_API_KEY="votre-clé-api-sendgrid"');
      console.log('   FROM_EMAIL="votre-email-verifie@votre-domaine.com"');
      console.log('\n💡 Pour le développement, vous pouvez utiliser :');
      console.log('   - Un email de test temporaire');
      console.log('   - L\'email de votre domaine si vous en avez un');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
  
  console.log('\n📝 RÉSUMÉ :');
  console.log('- Si vous voyez des erreurs d\'authentification, configurez votre clé API SendGrid');
  console.log('- Si la connexion réussit, votre configuration email est prête !');
  console.log('- SendGrid offre 100 emails gratuits par jour pour le développement');
}

// 🚀 Exécuter le test
testSendGridConfiguration()
  .then(() => {
    console.log('\n✅ Test terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test échoué:', error);
    process.exit(1);
  }); 