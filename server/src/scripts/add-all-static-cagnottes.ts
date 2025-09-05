import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addAllStaticCagnottes() {
  try {
    console.log('🚀 Ajout de toutes les cagnottes statiques du frontend...\n');

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
        where: { name: 'Urgences' },
        update: {},
        create: { name: 'Urgences', description: 'Campagnes d\'urgence' }
      }),
      prisma.category.upsert({
        where: { name: 'Entreprises' },
        update: {},
        create: { name: 'Entreprises', description: 'Campagnes entrepreneuriales' }
      }),
      prisma.category.upsert({
        where: { name: 'Animaux' },
        update: {},
        create: { name: 'Animaux', description: 'Campagnes pour les animaux' }
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
      }),
      prisma.category.upsert({
        where: { name: 'Social' },
        update: {},
        create: { name: 'Social', description: 'Campagnes sociales' }
      })
    ]);

    console.log('✅ Catégories récupérées/créées');

    // Toutes les cagnottes statiques extraites du frontend
    const allStaticCagnottes = [
      // Page 1 - Cagnottes actuelles
      {
        title: "Aider Youssef à vaincre le cancer",
        description: "Soutien pour le traitement de Youssef, 8 ans, atteint d'une leucémie aiguë",
        goalAmount: 100000,
        currentAmount: 78000,
        status: 'ACTIVE',
        categoryName: 'Santé',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-03-15')
      },
      {
        title: "Bourse d'étude pour Amina",
        description: "Permettre à Amina de poursuivre ses études d'ingénieur",
        goalAmount: 20000,
        currentAmount: 13000,
        status: 'ACTIVE',
        categoryName: 'Éducation',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-04-20')
      },
      {
        title: "Reconstruction maison familiale",
        description: "Aide pour la famille Ben Ali après l'incendie de leur maison",
        goalAmount: 50000,
        currentAmount: 46000,
        status: 'ACTIVE',
        categoryName: 'Urgences',
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-05-10')
      },
      {
        title: "Soins pour Noura",
        description: "Traitement médical urgent pour Noura, 5 ans",
        goalAmount: 50000,
        currentAmount: 22500,
        status: 'ACTIVE',
        categoryName: 'Santé',
        startDate: new Date('2024-01-18'),
        endDate: new Date('2024-06-18')
      },
      {
        title: "Startup écologique",
        description: "Soutien à un jeune entrepreneur tunisien",
        goalAmount: 50000,
        currentAmount: 16000,
        status: 'ACTIVE',
        categoryName: 'Entreprises',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-07-01')
      },
      // Page 2 - Nouvelles cagnottes
      {
        title: "Aide aux sinistrés de Sfax",
        description: "Soutien aux familles touchées par les inondations récentes",
        goalAmount: 200000,
        currentAmount: 125000,
        status: 'ACTIVE',
        categoryName: 'Urgences',
        startDate: new Date('2024-01-30'),
        endDate: new Date('2024-04-30')
      },
      {
        title: "Équipement pour école rurale",
        description: "Fournitures scolaires pour l'école primaire de Douz",
        goalAmount: 40000,
        currentAmount: 28500,
        status: 'ACTIVE',
        categoryName: 'Éducation',
        startDate: new Date('2024-02-05'),
        endDate: new Date('2024-05-05')
      },
      {
        title: "Soins vétérinaires pour refuge",
        description: "Aide au refuge pour animaux abandonnés de Tunis",
        goalAmount: 50000,
        currentAmount: 34200,
        status: 'ACTIVE',
        categoryName: 'Animaux',
        startDate: new Date('2024-01-25'),
        endDate: new Date('2024-06-25')
      },
      {
        title: "Formation professionnelle",
        description: "Formation en informatique pour jeunes défavorisés",
        goalAmount: 40000,
        currentAmount: 18750,
        status: 'ACTIVE',
        categoryName: 'Éducation',
        startDate: new Date('2024-02-10'),
        endDate: new Date('2024-05-10')
      },
      {
        title: "Aide aux personnes âgées",
        description: "Soutien pour les soins à domicile des seniors isolés",
        goalAmount: 80000,
        currentAmount: 67800,
        status: 'ACTIVE',
        categoryName: 'Social',
        startDate: new Date('2024-01-28'),
        endDate: new Date('2024-04-28')
      },
      // Page 3 - Autres cagnottes
      {
        title: "Projet agricole communautaire",
        description: "Développement d'une ferme coopérative dans le sud tunisien",
        goalAmount: 150000,
        currentAmount: 89500,
        status: 'ACTIVE',
        categoryName: 'Environnement',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-15')
      },
      {
        title: "Bibliothèque mobile",
        description: "Camion-bibliothèque pour les villages isolés",
        goalAmount: 40000,
        currentAmount: 22300,
        status: 'ACTIVE',
        categoryName: 'Éducation',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-01')
      },
      {
        title: "Centre de réhabilitation",
        description: "Centre pour personnes en situation de handicap",
        goalAmount: 200000,
        currentAmount: 156000,
        status: 'ACTIVE',
        categoryName: 'Santé',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-07-20')
      },
      {
        title: "Projet artistique",
        description: "Ateliers d'art pour enfants des quartiers populaires",
        goalAmount: 50000,
        currentAmount: 19800,
        status: 'ACTIVE',
        categoryName: 'Culture',
        startDate: new Date('2024-02-05'),
        endDate: new Date('2024-06-05')
      },
      {
        title: "Aide alimentaire d'urgence",
        description: "Distribution de paniers alimentaires aux plus démunis",
        goalAmount: 220000,
        currentAmount: 203500,
        status: 'ACTIVE',
        categoryName: 'Social',
        startDate: new Date('2024-01-10'),
        endDate: new Date('2024-04-10')
      },
      // Cagnottes de la page Discover
      {
        title: "Aide Saeb à poursuivre ses études en informatique",
        description: "Soutien financier pour permettre à Saeb de continuer ses études supérieures",
        goalAmount: 20000,
        currentAmount: 8832,
        status: 'ACTIVE',
        categoryName: 'Éducation',
        startDate: new Date('2024-01-25'),
        endDate: new Date('2024-05-25')
      },
      {
        title: "Bourse d'études pour Nour en médecine",
        description: "Aide financière pour Nour qui souhaite devenir médecin",
        goalAmount: 14400,
        currentAmount: 13840,
        status: 'ACTIVE',
        categoryName: 'Éducation',
        startDate: new Date('2024-01-30'),
        endDate: new Date('2024-04-30')
      },
      {
        title: "Équipement informatique pour l'école rurale",
        description: "Modernisation de l'équipement informatique d'une école rurale",
        goalAmount: 56200,
        currentAmount: 18010,
        status: 'ACTIVE',
        categoryName: 'Éducation',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-06-01')
      }
    ];

    console.log(`📊 Total des cagnottes à ajouter: ${allStaticCagnottes.length}`);

    // Ajouter chaque cagnotte
    let addedCount = 0;
    for (const cagnotteData of allStaticCagnottes) {
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
    console.log(`📊 Cagnottes ajoutées avec succès: ${addedCount}/${allStaticCagnottes.length}`);

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addAllStaticCagnottes(); 