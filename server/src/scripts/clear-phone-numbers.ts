#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 🧹 Script pour effacer tous les numéros de téléphone de test
 * Ce script remet tous les numéros de téléphone à null
 * pour que vous puissiez les saisir manuellement dans les paramètres
 */

async function clearPhoneNumbers() {
  try {
    console.log('🧹 Suppression de tous les numéros de téléphone...');
    
    // Récupérer tous les utilisateurs avec leur numéro de téléphone
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true
      }
    });

    console.log(`📊 ${users.length} utilisateurs trouvés`);

    // Utilisateurs avec numéro de téléphone
    const usersWithPhone = users.filter(user => user.phone);
    console.log(`📱 ${usersWithPhone.length} utilisateurs avec numéro de téléphone`);

    if (usersWithPhone.length === 0) {
      console.log('✅ Aucun numéro de téléphone à supprimer');
      return;
    }

    // Afficher les numéros qui vont être supprimés
    console.log('\n📝 Numéros qui vont être supprimés :');
    usersWithPhone.forEach(user => {
      console.log(`  - ${user.email}: ${user.phone}`);
    });

    // Supprimer tous les numéros de téléphone
    console.log('\n🗑️ Suppression en cours...');
    
    const result = await prisma.user.updateMany({
      data: {
        phone: null
      }
    });

    console.log(`✅ ${result.count} utilisateurs mis à jour`);

    // Vérifier le résultat
    const updatedUsers = await prisma.user.findMany({
      select: {
        email: true,
        phone: true
      }
    });

    console.log('\n📊 Résultat final :');
    updatedUsers.forEach(user => {
      const status = user.phone ? '📱' : '❌';
      console.log(`${status} ${user.email}: ${user.phone || 'Aucun numéro'}`);
    });

    console.log('\n🎯 Maintenant vous pouvez :');
    console.log('1. Aller dans les paramètres de votre profil');
    console.log('2. Saisir votre vrai numéro : +21648086786');
    console.log('3. Tester la fonctionnalité SMS');

  } catch (error) {
    console.error('❌ Erreur lors de la suppression des numéros de téléphone:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  clearPhoneNumbers();
}

export { clearPhoneNumbers }; 