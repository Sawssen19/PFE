#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🧪 Script pour ajouter des numéros de téléphone valides aux utilisateurs existants
 * Ce script met à jour la base de données pour avoir des numéros de téléphone valides
 * pour tester la fonctionnalité SMS
 */

async function addPhoneNumbers() {
  try {
    console.log('🔍 Recherche des utilisateurs sans numéro de téléphone...');
    
    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true
      }
    });

    console.log(`📊 ${users.length} utilisateurs trouvés`);

    // Utilisateurs sans numéro de téléphone
    const usersWithoutPhone = users.filter(user => !user.phone);
    console.log(`📱 ${usersWithoutPhone.length} utilisateurs sans numéro de téléphone`);

    if (usersWithoutPhone.length === 0) {
      console.log('✅ Tous les utilisateurs ont déjà un numéro de téléphone');
      return;
    }

    // Numéros de téléphone de test (Tunisie en premier)
    const testPhoneNumbers = [
      '+216 71 234 567', // Tunisie - Tunis
      '+216 73 456 789', // Tunisie - Sousse
      '+216 74 567 890', // Tunisie - Sfax
      '+33 6 12 34 56 78', // France
      '+33 6 98 76 54 32', // France
      '+213 5 61 23 45 67', // Algérie
      '+212 6 12 34 56 78', // Maroc
      '+20 10 1234 5678', // Égypte
      '+1 555 123 4567', // États-Unis
      '+44 20 7946 0958', // Royaume-Uni
    ];

    console.log('📝 Ajout des numéros de téléphone de test...');

    // Mettre à jour les utilisateurs sans numéro de téléphone
    for (let i = 0; i < usersWithoutPhone.length; i++) {
      const user = usersWithoutPhone[i];
      const phoneNumber = testPhoneNumbers[i % testPhoneNumbers.length];
      
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { phone: phoneNumber }
        });
        
        console.log(`✅ ${user.email} -> ${phoneNumber}`);
      } catch (error) {
        console.error(`❌ Erreur lors de la mise à jour de ${user.email}:`, error);
      }
    }

    console.log('✅ Mise à jour terminée !');

    // Vérifier le résultat
    const updatedUsers = await prisma.user.findMany({
      select: {
        email: true,
        phone: true
      }
    });

    console.log('\n📊 Résultat final :');
    updatedUsers.forEach(user => {
      const status = user.phone ? '✅' : '❌';
      console.log(`${status} ${user.email}: ${user.phone || 'Aucun numéro'}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution du script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  addPhoneNumbers();
}

export { addPhoneNumbers }; 