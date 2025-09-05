import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addSamplePromises() {
  try {
    console.log('🚀 Ajout de promesses de dons d\'exemple...\n');

    // Récupérer quelques utilisateurs existants
    const users = await prisma.user.findMany({ take: 5 });
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé. Créez d\'abord des utilisateurs.');
      return;
    }

    // Récupérer quelques cagnottes existantes
    const cagnottes = await prisma.cagnotte.findMany({ take: 10 });
    if (cagnottes.length === 0) {
      console.log('❌ Aucune cagnotte trouvée. Créez d\'abord des cagnottes.');
      return;
    }

    console.log(`✅ ${users.length} utilisateurs trouvés`);
    console.log(`✅ ${cagnottes.length} cagnottes trouvées`);

    // Promesses de dons d'exemple
    const samplePromises = [
      // Cagnotte 1: Aider Youssef à vaincre le cancer
      { amount: 500, status: 'PAID', contributorIndex: 0, cagnotteIndex: 0 },
      { amount: 1000, status: 'PAID', contributorIndex: 1, cagnotteIndex: 0 },
      { amount: 250, status: 'PENDING', contributorIndex: 2, cagnotteIndex: 0 },
      { amount: 750, status: 'PAID', contributorIndex: 3, cagnotteIndex: 0 },
      { amount: 300, status: 'PENDING', contributorIndex: 4, cagnotteIndex: 0 },

      // Cagnotte 2: Bourse d'étude pour Amina
      { amount: 200, status: 'PAID', contributorIndex: 0, cagnotteIndex: 1 },
      { amount: 500, status: 'PAID', contributorIndex: 1, cagnotteIndex: 1 },
      { amount: 150, status: 'PENDING', contributorIndex: 2, cagnotteIndex: 1 },

      // Cagnotte 3: Reconstruction maison familiale
      { amount: 1000, status: 'PAID', contributorIndex: 0, cagnotteIndex: 2 },
      { amount: 2000, status: 'PAID', contributorIndex: 1, cagnotteIndex: 2 },
      { amount: 500, status: 'PAID', contributorIndex: 2, cagnotteIndex: 2 },
      { amount: 1500, status: 'PENDING', contributorIndex: 3, cagnotteIndex: 2 },

      // Cagnotte 4: Soins pour Noura
      { amount: 300, status: 'PAID', contributorIndex: 0, cagnotteIndex: 3 },
      { amount: 600, status: 'PAID', contributorIndex: 1, cagnotteIndex: 3 },
      { amount: 450, status: 'PENDING', contributorIndex: 2, cagnotteIndex: 3 },

      // Cagnotte 5: Startup écologique
      { amount: 800, status: 'PAID', contributorIndex: 0, cagnotteIndex: 4 },
      { amount: 1200, status: 'PENDING', contributorIndex: 1, cagnotteIndex: 4 },

      // Cagnotte 6: Aide aux sinistrés de Sfax
      { amount: 1500, status: 'PAID', contributorIndex: 0, cagnotteIndex: 5 },
      { amount: 3000, status: 'PAID', contributorIndex: 1, cagnotteIndex: 5 },
      { amount: 2000, status: 'PAID', contributorIndex: 2, cagnotteIndex: 5 },
      { amount: 1000, status: 'PENDING', contributorIndex: 3, cagnotteIndex: 5 },

      // Cagnotte 7: Équipement pour école rurale
      { amount: 400, status: 'PAID', contributorIndex: 0, cagnotteIndex: 6 },
      { amount: 600, status: 'PAID', contributorIndex: 1, cagnotteIndex: 6 },
      { amount: 300, status: 'PENDING', contributorIndex: 2, cagnotteIndex: 6 },

      // Cagnotte 8: Soins vétérinaires pour refuge
      { amount: 250, status: 'PAID', contributorIndex: 0, cagnotteIndex: 7 },
      { amount: 500, status: 'PAID', contributorIndex: 1, cagnotteIndex: 7 },
      { amount: 350, status: 'PENDING', contributorIndex: 2, cagnotteIndex: 7 },

      // Cagnotte 9: Formation professionnelle
      { amount: 600, status: 'PAID', contributorIndex: 0, cagnotteIndex: 8 },
      { amount: 800, status: 'PENDING', contributorIndex: 1, cagnotteIndex: 8 },

      // Cagnotte 10: Aide aux personnes âgées
      { amount: 1000, status: 'PAID', contributorIndex: 0, cagnotteIndex: 9 },
      { amount: 1500, status: 'PAID', contributorIndex: 1, cagnotteIndex: 9 },
      { amount: 800, status: 'PENDING', contributorIndex: 2, cagnotteIndex: 9 }
    ];

    console.log(`📊 Total des promesses à ajouter: ${samplePromises.length}`);

    // Ajouter chaque promesse
    let addedCount = 0;
    for (const promiseData of samplePromises) {
      try {
        const contributor = users[promiseData.contributorIndex % users.length];
        const cagnotte = cagnottes[promiseData.cagnotteIndex % cagnottes.length];

        const promise = await prisma.promise.create({
          data: {
            amount: promiseData.amount,
            status: promiseData.status as any,
            contributorId: contributor.id,
            cagnotteId: cagnotte.id,
            promisedAt: new Date(),
            paidAt: promiseData.status === 'PAID' ? new Date() : null
          }
        });

        console.log(`✅ Promesse créée: ${promise.amount} DT (${promise.status}) pour "${cagnotte.title}"`);
        addedCount++;

        // Si la promesse est payée, mettre à jour le montant actuel de la cagnotte
        if (promiseData.status === 'PAID') {
          await prisma.cagnotte.update({
            where: { id: cagnotte.id },
            data: {
              currentAmount: {
                increment: promiseData.amount
              }
            }
          });
        }

      } catch (error) {
        console.error(`❌ Erreur lors de la création de la promesse:`, error);
      }
    }

    console.log('\n🎉 Processus terminé !');
    console.log(`📊 Promesses ajoutées avec succès: ${addedCount}/${samplePromises.length}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSamplePromises(); 