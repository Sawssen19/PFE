import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addSampleCagnottes() {
  try {
    console.log('🚀 Ajout de cagnottes d\'exemple...\n');

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
        where: { name: 'Éducation' },
        update: {},
        create: { name: 'Éducation', description: 'Campagnes liées à l\'éducation' }
      }),
      prisma.category.upsert({
        where: { name: 'Urgence' },
        update: {},
        create: { name: 'Urgence', description: 'Campagnes d\'urgence' }
      }),
      prisma.category.upsert({
        where: { name: 'Culture' },
        update: {},
        create: { name: 'Culture', description: 'Campagnes culturelles' }
      }),
      prisma.category.upsert({
        where: { name: 'Environnement' },
        update: {},
        create: { name: 'Environnement', description: 'Campagnes environnementales' }
      })
    ]);

    console.log('✅ Catégories récupérées/créées');

    // Cagnottes d'exemple
    const sampleCagnottes = [
      {
        title: 'Aide médicale pour Ahmed',
        description: 'Ahmed a besoin d\'une opération urgente du cœur. Votre soutien peut sauver sa vie.',
        goalAmount: 15000,
        currentAmount: 8500,
        status: 'ACTIVE',
        categoryName: 'Santé',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-15')
      },
      {
        title: 'Éducation pour les enfants défavorisés',
        description: 'Aidez-nous à fournir des fournitures scolaires et des uniformes pour 50 enfants.',
        goalAmount: 5000,
        currentAmount: 3200,
        status: 'ACTIVE',
        categoryName: 'Éducation',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-04-20')
      },
      {
        title: 'Reconstruction après inondation',
        description: 'Les inondations ont dévasté notre village. Aidez-nous à reconstruire nos maisons.',
        goalAmount: 25000,
        currentAmount: 18000,
        status: 'ACTIVE',
        categoryName: 'Urgence',
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-05-10')
      },
      {
        title: 'Festival de musique traditionnelle',
        description: 'Organisons un festival pour préserver notre patrimoine musical tunisien.',
        goalAmount: 8000,
        currentAmount: 4500,
        status: 'ACTIVE',
        categoryName: 'Culture',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-06-01')
      },
      {
        title: 'Plantation d\'arbres dans le désert',
        description: 'Projet de reboisement pour lutter contre la désertification en Tunisie.',
        goalAmount: 12000,
        currentAmount: 7800,
        status: 'ACTIVE',
        categoryName: 'Environnement',
        startDate: new Date('2024-01-25'),
        endDate: new Date('2024-07-25')
      },
      {
        title: 'Aide aux familles touchées par la COVID',
        description: 'Soutien financier pour les familles qui ont perdu leurs revenus pendant la pandémie.',
        goalAmount: 10000,
        currentAmount: 6200,
        status: 'ACTIVE',
        categoryName: 'Urgence',
        startDate: new Date('2024-01-30'),
        endDate: new Date('2024-04-30')
      },
      {
        title: 'Bibliothèque mobile pour les zones rurales',
        description: 'Créons une bibliothèque mobile pour apporter la culture aux villages isolés.',
        goalAmount: 6000,
        currentAmount: 3800,
        status: 'ACTIVE',
        categoryName: 'Éducation',
        startDate: new Date('2024-02-05'),
        endDate: new Date('2024-05-05')
      },
      {
        title: 'Centre de soins pour animaux abandonnés',
        description: 'Construisons un refuge pour les chiens et chats abandonnés dans notre région.',
        goalAmount: 15000,
        currentAmount: 9200,
        status: 'ACTIVE',
        categoryName: 'Santé',
        startDate: new Date('2024-01-18'),
        endDate: new Date('2024-06-18')
      }
    ];

    // Ajouter chaque cagnotte
    for (const cagnotteData of sampleCagnottes) {
      const category = categories.find(cat => cat.name === cagnotteData.categoryName);
      if (!category) continue;

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

      console.log(`✅ Cagnotte créée: ${cagnotte.title} (${cagnotte.status})`);
    }

    console.log('\n🎉 Toutes les cagnottes d\'exemple ont été ajoutées avec succès !');
    console.log(`📊 Total: ${sampleCagnottes.length} cagnottes créées`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des cagnottes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleCagnottes(); 