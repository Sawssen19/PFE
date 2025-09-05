import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addDiscoverCagnottes() {
  try {
    console.log('🚀 Ajout des cagnottes manquantes pour la page Discover...\n');

    // Récupérer un utilisateur existant pour créer les cagnottes
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ Aucun utilisateur trouvé. Créez d\'abord un utilisateur.');
      return;
    }

    // Récupérer ou créer des catégories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: 'Santé' },
        update: {},
        create: { name: 'Santé', description: 'Campagnes liées à la santé' }
      }),
      prisma.category.upsert({
        where: { name: 'Urgence' },
        update: {},
        create: { name: 'Urgence', description: 'Campagnes d\'urgence' }
      }),
      prisma.category.upsert({
        where: { name: 'Social' },
        update: {},
        create: { name: 'Social', description: 'Campagnes sociales' }
      }),
      prisma.category.upsert({
        where: { name: 'Mémorial' },
        update: {},
        create: { name: 'Mémorial', description: 'Campagnes commémoratives' }
      })
    ]);

    console.log('✅ Catégories récupérées/créées');

    // Cagnottes manquantes pour la page Discover
    const discoverCagnottes = [
      {
        title: "Aide moi à retrouver une vie digne et pleine d'espoir ❤️",
        description: "Soutien pour une personne en difficulté qui cherche à reconstruire sa vie",
        goalAmount: 45000,
        currentAmount: 37321,
        status: 'ACTIVE',
        categoryName: 'Santé',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-15')
      },
      {
        title: "Aide Julien pour une chirurgie après un accident",
        description: "Soutien financier pour Julien qui a besoin d'une chirurgie urgente",
        goalAmount: 40000,
        currentAmount: 49633,
        status: 'ACTIVE',
        categoryName: 'Santé',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-05-20')
      },
      {
        title: "Opération du cœur pour Ahmed",
        description: "Aide pour l'opération du cœur d'Ahmed qui est en attente urgente",
        goalAmount: 22000,
        currentAmount: 15702,
        status: 'ACTIVE',
        categoryName: 'Santé',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-06-01')
      },
      {
        title: "En mémoire de Fatma - Une vie dédiée à l'éducation",
        description: "Hommage à Fatma qui a consacré sa vie à l'éducation des enfants",
        goalAmount: 9300,
        currentAmount: 8023,
        status: 'ACTIVE',
        categoryName: 'Mémorial',
        startDate: new Date('2024-01-25'),
        endDate: new Date('2024-04-25')
      },
      {
        title: "Mémorial pour les victimes de l'accident",
        description: "Soutien aux familles des victimes d'un tragique accident",
        goalAmount: 27000,
        currentAmount: 12231,
        status: 'ACTIVE',
        categoryName: 'Mémorial',
        startDate: new Date('2024-02-05'),
        endDate: new Date('2024-07-05')
      },
      {
        title: "Hommage à Mohamed, héros de la révolution",
        description: "Mémorial pour honorer la mémoire de Mohamed, héros de la révolution",
        goalAmount: 50000,
        currentAmount: 9552,
        status: 'ACTIVE',
        categoryName: 'Mémorial',
        startDate: new Date('2024-01-30'),
        endDate: new Date('2024-06-30')
      },
      {
        title: "Aide d'urgence pour les victimes des inondations",
        description: "Soutien urgent aux familles touchées par les inondations récentes",
        goalAmount: 22800,
        currentAmount: 25325,
        status: 'ACTIVE',
        categoryName: 'Urgence',
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-04-10')
      },
      {
        title: "Secours d'urgence après l'incendie de forêt",
        description: "Aide d'urgence pour les populations touchées par l'incendie de forêt",
        goalAmount: 35000,
        currentAmount: 34067,
        status: 'ACTIVE',
        categoryName: 'Urgence',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-05-15')
      },
      {
        title: "Aide d'urgence pour la famille Bouazizi",
        description: "Soutien d'urgence pour la famille Bouazizi en difficulté",
        goalAmount: 28500,
        currentAmount: 18373,
        status: 'ACTIVE',
        categoryName: 'Urgence',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-06-01')
      },
      {
        title: "Soutien à l'association Espoir pour les enfants",
        description: "Soutien à l'association Espoir qui aide les enfants défavorisés",
        goalAmount: 106600,
        currentAmount: 24398,
        status: 'ACTIVE',
        categoryName: 'Social',
        startDate: new Date('2024-01-18'),
        endDate: new Date('2024-07-18')
      },
      {
        title: "Sauvons l'association Croissant Rouge local",
        description: "Aide pour sauver l'association Croissant Rouge locale en difficulté",
        goalAmount: 41400,
        currentAmount: 16314,
        status: 'ACTIVE',
        categoryName: 'Social',
        startDate: new Date('2024-01-25'),
        endDate: new Date('2024-05-25')
      }
    ];

    console.log(`📊 Total des cagnottes à ajouter: ${discoverCagnottes.length}`);

    // Ajouter chaque cagnotte
    let addedCount = 0;
    for (const cagnotteData of discoverCagnottes) {
      const category = categories.find(cat => cat.name === cagnotteData.categoryName);
      if (!category) {
        console.log(`⚠️ Catégorie non trouvée: ${cagnotteData.categoryName}`);
        continue;
      }

      try {
        const cagnotte = await prisma.cagnotte.create({
          data: {
            title: cagnotteData.title,
            description: cagnotteData.description,
            goalAmount: cagnotteData.goalAmount,
            currentAmount: cagnotteData.currentAmount,
            status: cagnotteData.status as any,
            startDate: cagnotteData.startDate,
            endDate: cagnotteData.endDate,
            creatorId: user.id,
            beneficiaryId: user.id,
            categoryId: category.id
          }
        });

        console.log(`✅ Cagnotte créée: ${cagnotte.title} (${cagnotte.status}) - ${cagnotteData.currentAmount}/${cagnotteData.goalAmount} DT`);
        addedCount++;
      } catch (error) {
        console.error(`❌ Erreur lors de la création de "${cagnotteData.title}":`, error);
      }
    }

    console.log('\n🎉 Processus terminé !');
    console.log(`📊 Cagnottes ajoutées avec succès: ${addedCount}/${discoverCagnottes.length}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDiscoverCagnottes(); 