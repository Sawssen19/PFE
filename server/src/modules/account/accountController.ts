import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../../services/emailService';
import { emailConfig } from '../../config/emailConfig';

const prisma = new PrismaClient();

// Créer une nouvelle demande de suppression/désactivation
export const createAccountRequest = async (req: Request, res: Response) => {
  try {
    const { userId, email, requestType, reason } = req.body;

    console.log('✅ Demande reçue:', { userId, email, requestType, reason });

    // Validation des données
    if (!userId || !email || !requestType) {
      return res.status(400).json({
        success: false,
        message: 'Données manquantes: userId, email et requestType sont requis'
      });
    }

    // Convertir les valeurs string en enum Prisma
    const prismaRequestType = requestType.toUpperCase() as 'DELETION' | 'DEACTIVATION';
    
    // Créer la demande dans la base de données
    const accountRequest = await prisma.accountRequest.create({
      data: {
        userId,
        email,
        requestType: prismaRequestType,
        reason: reason || null,
        status: 'PENDING',
        submittedAt: new Date()
      }
    });

    console.log('✅ Demande de compte créée:', accountRequest);

    // Envoyer les emails de notification
    await sendNotificationEmails(accountRequest);

    res.status(201).json({
      success: true,
      message: 'Demande de compte créée avec succès',
      data: accountRequest
    });

  } catch (error) {
    console.error('❌ Erreur lors de la création de la demande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Fonction pour envoyer les emails de notification
async function sendNotificationEmails(accountRequest: any) {
  try {
    // Email à l'équipe Kollecta
    const teamEmail = emailConfig.ADMIN_EMAIL; // Email de l'équipe Kollecta
    const teamSubject = `🚨 Nouvelle demande de ${accountRequest.requestType === 'DELETION' ? 'suppression' : 'désactivation'} de compte`;
    const teamHtml = generateTeamEmailHTML(accountRequest);
    const teamText = generateTeamEmailText(accountRequest);

    // Email à l'utilisateur
    const userSubject = `📧 Demande de ${accountRequest.requestType === 'DELETION' ? 'suppression' : 'désactivation'} reçue - Kollecta`;
    const userHtml = generateUserEmailHTML(accountRequest);
    const userText = generateUserEmailText(accountRequest);

    // Envoyer les emails via SendGrid via EmailService
    try {
      await EmailService.sendEmail(teamEmail, teamSubject, teamText, teamHtml);
      console.log('✅ Email envoyé à l\'équipe Kollecta via SendGrid');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email à l\'équipe:', error);
    }

    try {
      await EmailService.sendEmail(accountRequest.email, userSubject, userText, userHtml);
      console.log('✅ Email envoyé à l\'utilisateur via SendGrid');
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de l\'email à l\'utilisateur:', error);
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des emails:', error);
  }
}

// Fonctions de génération des emails
function generateTeamEmailHTML(accountRequest: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #ff6b35; padding: 20px; text-align: center; color: white;">
        <h1>🚨 Nouvelle demande de compte</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Détails de la demande :</h2>
        <p><strong>Type :</strong> ${accountRequest.requestType === 'DELETION' ? 'Suppression définitive' : 'Désactivation temporaire'}</p>
        <p><strong>Utilisateur :</strong> ${accountRequest.email}</p>
        <p><strong>Raison :</strong> ${accountRequest.reason || 'Aucune raison fournie'}</p>
        <p><strong>Date :</strong> ${new Date(accountRequest.submittedAt).toLocaleString('fr-FR')}</p>
      </div>
    </div>
  `;
}

function generateTeamEmailText(accountRequest: any): string {
  return `Nouvelle demande de ${accountRequest.requestType === 'DELETION' ? 'suppression' : 'désactivation'} de compte
Type: ${accountRequest.requestType === 'DELETION' ? 'Suppression définitive' : 'Désactivation temporaire'}
Utilisateur: ${accountRequest.email}
Raison: ${accountRequest.reason || 'Aucune raison fournie'}
Date: ${new Date(accountRequest.submittedAt).toLocaleString('fr-FR')}`;
}

function generateUserEmailHTML(accountRequest: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #667eea; padding: 20px; text-align: center; color: white;">
        <h1>📧 Demande reçue</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Votre demande a été reçue</h2>
        <p>Nous avons bien reçu votre demande de ${accountRequest.requestType === 'DELETION' ? 'suppression' : 'désactivation'} de compte.</p>
        <p>L'équipe Kollecta va examiner votre demande et vous contactera dans les plus brefs délais.</p>
        <p><strong>Type de demande :</strong> ${accountRequest.requestType === 'DELETION' ? 'Suppression définitive' : 'Désactivation temporaire'}</p>
        <p><strong>Raison :</strong> ${accountRequest.reason || 'Aucune raison fournie'}</p>
      </div>
    </div>
  `;
}

function generateUserEmailText(accountRequest: any): string {
  return `Votre demande a été reçue
Nous avons bien reçu votre demande de ${accountRequest.requestType === 'DELETION' ? 'suppression' : 'désactivation'} de compte.
L'équipe Kollecta va examiner votre demande et vous contactera dans les plus brefs délais.
Type de demande: ${accountRequest.requestType === 'DELETION' ? 'Suppression définitive' : 'Désactivation temporaire'}
Raison: ${accountRequest.reason || 'Aucune raison fournie'}`;
}

// Récupérer toutes les demandes (pour l'admin)
export const getAllAccountRequests = async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des demandes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Récupérer une demande spécifique
export const getAccountRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      data: { id, status: 'pending' }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de la demande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
};

// Mettre à jour le statut d'une demande (pour l'admin)
export const updateAccountRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, reviewedBy } = req.body;

    console.log('✅ Mise à jour du statut:', { id, status, notes, reviewedBy });

    res.status(200).json({
      success: true,
      message: 'Statut de la demande mis à jour',
      data: { id, status, notes, reviewedBy, reviewedAt: new Date() }
    });

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur interne du serveur'
    });
  }
}; 