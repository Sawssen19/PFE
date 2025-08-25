#!/usr/bin/env ts-node

import { SmsService } from '../services/smsService';

/**
 * 🧪 Script de test pour la configuration SMS
 * Teste la connexion et l'envoi de SMS de réinitialisation
 */

async function testSmsConfiguration() {
  console.log('🧪 TEST DE LA CONFIGURATION SMS');
  console.log('=====================================');
  
  try {
    // 1. Test de connexion au service SMS
    console.log('1. Test de connexion au service SMS...');
    const connectionTest = await SmsService.testConnection();
    
    if (connectionTest) {
      console.log('✅ Test de connexion SMS réussi !');
      console.log('✅ Configuration SMS valide !');
    } else {
      console.log('❌ Test de connexion SMS échoué !');
      return;
    }
    
    // 2. Test d'envoi de SMS de réinitialisation
    console.log('\n2. Test d\'envoi de SMS de réinitialisation...');
    const testPhone = '+33 6 12 34 56 78'; // Numéro de test
    const testFirstName = 'Test';
    const testToken = 'test-token-123';
    
    const smsTest = await SmsService.sendPasswordResetSMS(testPhone, testFirstName, testToken);
    
    if (smsTest) {
      console.log('✅ SMS de réinitialisation envoyé avec succès !');
    } else {
      console.log('❌ Échec de l\'envoi du SMS de réinitialisation !');
    }
    
    // 3. Test de validation de numéro de téléphone
    console.log('\n3. Test de validation de numéros de téléphone...');
    const testNumbers = [
      '+33 6 12 34 56 78',
      '06 12 34 56 78',
      '+1 555 123 4567',
      'invalid-phone',
      ''
    ];
    
    testNumbers.forEach(phone => {
      const isValid = SmsService.validatePhoneNumber(phone);
      const status = isValid ? '✅' : '❌';
      console.log(`${status} ${phone} -> ${isValid ? 'Valide' : 'Invalide'}`);
    });
    
    // 4. Test de formatage de numéros de téléphone
    console.log('\n4. Test de formatage de numéros de téléphone...');
    const formatTestNumbers = [
      '06 12 34 56 78',
      '+33 6 12 34 56 78',
      '1 555 123 4567'
    ];
    
    formatTestNumbers.forEach(phone => {
      const formatted = SmsService.formatPhoneNumber(phone);
      console.log(`📱 ${phone} -> ${formatted}`);
    });
    
    console.log('\n📝 RÉSUMÉ :');
    console.log('- Si vous voyez des erreurs de connexion, configurez votre service SMS');
    console.log('- Si la connexion réussit, votre configuration SMS est prête !');
    console.log('- Pour la production, configurez un vrai service SMS (Twilio, Vonage, etc.)');
    
    console.log('\n✅ Test terminé');
    
  } catch (error) {
    console.error('❌ Erreur lors du test SMS:', error);
  }
}

// Exécuter le test si le script est appelé directement
if (require.main === module) {
  testSmsConfiguration();
}

export { testSmsConfiguration }; 