/**
 * Script pour lister toutes les cagnottes dans la base de données
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('📋 Récupération de la liste des cagnottes...\n');

    const cagnottes = await prisma.cagnotte.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        goalAmount: true,
        currentAmount: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        beneficiary: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        _count: {
          select: {
            promises: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ ${cagnottes.length} cagnotte(s) trouvée(s)\n`);
    console.log('='.repeat(80));

    if (cagnottes.length === 0) {
      console.log('Aucune cagnotte dans la base de données.');
    } else {
      cagnottes.forEach((cagnotte, index) => {
        const daysRemaining = Math.ceil(
          (new Date(cagnotte.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        const progress = ((cagnotte.currentAmount / cagnotte.goalAmount) * 100).toFixed(1);
        const isExpired = new Date(cagnotte.endDate) < new Date();

        console.log(`\n${index + 1}. ${cagnotte.title}`);
        console.log('   ─'.repeat(40));
        console.log(`   📝 ID: ${cagnotte.id}`);
        console.log(`   📊 Statut: ${cagnotte.status}`);
        console.log(`   💰 Montant collecté: ${cagnotte.currentAmount} TND / ${cagnotte.goalAmount} TND (${progress}%)`);
        console.log(`   👤 Créateur: ${cagnotte.creator.firstName} ${cagnotte.creator.lastName} (${cagnotte.creator.email})`);
        if (cagnotte.beneficiary) {
          console.log(`   🎯 Bénéficiaire: ${cagnotte.beneficiary.firstName} ${cagnotte.beneficiary.lastName} (${cagnotte.beneficiary.email})`);
        } else {
          console.log(`   🎯 Bénéficiaire: Aucun (cagnotte personnelle)`);
        }
        console.log(`   📅 Date de début: ${new Date(cagnotte.startDate).toLocaleDateString('fr-FR')}`);
        console.log(`   📅 Date de fin: ${new Date(cagnotte.endDate).toLocaleDateString('fr-FR')}`);
        if (isExpired) {
          console.log(`   ⏰ Statut: EXPIRÉE (il y a ${Math.abs(daysRemaining)} jour(s))`);
        } else {
          console.log(`   ⏰ Jours restants: ${daysRemaining} jour(s)`);
        }
        console.log(`   🤝 Nombre de promesses: ${cagnotte._count.promises}`);
        console.log(`   📅 Créée le: ${new Date(cagnotte.createdAt).toLocaleString('fr-FR')}`);
        if (cagnotte.description) {
          const shortDesc = cagnotte.description.length > 100 
            ? cagnotte.description.substring(0, 100) + '...' 
            : cagnotte.description;
          console.log(`   📄 Description: ${shortDesc}`);
        }
      });
    }

    console.log('\n' + '='.repeat(80));

    // Statistiques
    const stats = {
      total: cagnottes.length,
      active: cagnottes.filter(c => c.status === 'ACTIVE').length,
      success: cagnottes.filter(c => c.status === 'SUCCESS').length,
      closed: cagnottes.filter(c => c.status === 'CLOSED').length,
      pending: cagnottes.filter(c => c.status === 'PENDING').length,
      draft: cagnottes.filter(c => c.status === 'DRAFT').length,
      expired: cagnottes.filter(c => new Date(c.endDate) < new Date()).length,
      expiringSoon: cagnottes.filter(c => {
        const days = Math.ceil(
          (new Date(c.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        return days <= 7 && days > 0 && c.status === 'ACTIVE';
      }).length
    };

    console.log('\n📊 STATISTIQUES:');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Actives: ${stats.active}`);
    console.log(`   Succès: ${stats.success}`);
    console.log(`   Fermées: ${stats.closed}`);
    console.log(`   En attente: ${stats.pending}`);
    console.log(`   Brouillons: ${stats.draft}`);
    console.log(`   Expirées: ${stats.expired}`);
    console.log(`   Expirent bientôt (≤7 jours): ${stats.expiringSoon}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
















