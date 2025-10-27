import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createDonationNotifications() {
  try {
    console.log('🔔 Création de notifications pour les promesses de dons...\n');

    // Récupérer toutes les promesses payées
    const paidPromises = await prisma.promise.findMany({
      where: { status: 'PAID' },
      include: {
        contributor: {
          select: { id: true, firstName: true, lastName: true }
        },
        cagnotte: {
          select: { id: true, title: true, creatorId: true }
        }
      },
      take: 10 // Limiter pour le test
    });

    console.log(`✅ ${paidPromises.length} promesses payées trouvées`);

    let notificationCount = 0;

    for (const promise of paidPromises) {
      try {
        // 1️⃣ Notification pour le créateur de la cagnotte (recevoir un don)
        const creatorNotification = await prisma.notification.create({
          data: {
            userId: promise.cagnotte.creatorId,
            type: 'DONATION',
            title: '💰 Nouveau don reçu !',
            message: `${promise.contributor.firstName} a fait un don de ${promise.amount} DT à votre cagnotte "${promise.cagnotte.title}".`,
            actionUrl: `/cagnottes/${promise.cagnotte.id}`,
            metadata: {
              promiseId: promise.id,
              amount: promise.amount,
              contributorName: `${promise.contributor.firstName} ${promise.contributor.lastName}`,
              cagnotteTitle: promise.cagnotte.title,
              type: 'donation_received'
            }
          }
        });

        // 2️⃣ Notification pour le contributeur (confirmation de don)
        const contributorNotification = await prisma.notification.create({
          data: {
            userId: promise.contributor.id,
            type: 'DONATION',
            title: '✅ Don confirmé !',
            message: `Votre don de ${promise.amount} DT pour "${promise.cagnotte.title}" a été confirmé. Merci pour votre générosité !`,
            actionUrl: `/cagnottes/${promise.cagnotte.id}`,
            metadata: {
              promiseId: promise.id,
              amount: promise.amount,
              cagnotteTitle: promise.cagnotte.title,
              type: 'donation_confirmed'
            }
          }
        });

        console.log(`✅ Notifications créées pour le don de ${promise.amount} DT`);
        notificationCount += 2;

      } catch (error) {
        console.error(`❌ Erreur lors de la création des notifications pour la promesse ${promise.id}:`, error);
      }
    }

    // 3️⃣ Créer quelques notifications système
    const systemNotifications = [
      {
        title: '🎉 Bienvenue sur Kollecta !',
        message: 'Votre compte a été créé avec succès. Vous pouvez maintenant créer des cagnottes et faire des dons.',
        type: 'SYSTEM' as const
      },
      {
        title: '📢 Nouvelles fonctionnalités disponibles',
        message: 'Découvrez les nouvelles fonctionnalités de Kollecta : notifications en temps réel, suivi des dons, et bien plus !',
        type: 'SYSTEM' as const
      },
      {
        title: '🔔 Système de notifications activé',
        message: 'Vous recevrez maintenant des notifications pour vos cagnottes et vos dons. Restez connecté !',
        type: 'SYSTEM' as const
      }
    ];

    // Récupérer quelques utilisateurs pour les notifications système
    const users = await prisma.user.findMany({ take: 3 });
    
    for (const user of users) {
      for (const notif of systemNotifications) {
        try {
          await prisma.notification.create({
            data: {
              userId: user.id,
              type: notif.type,
              title: notif.title,
              message: notif.message,
              actionUrl: '/profile',
              metadata: {
                type: 'system_update'
              }
            }
          });
          notificationCount++;
        } catch (error) {
          console.error(`❌ Erreur lors de la création de la notification système:`, error);
        }
      }
    }

    console.log('\n🎉 Processus terminé !');
    console.log(`📊 Total des notifications créées: ${notificationCount}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDonationNotifications();

