import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

export class NotificationService {
  private prisma: PrismaClient;
  private transporter: any;

  constructor() {
    this.prisma = new PrismaClient();
    // Configuration du transporteur email (à remplacer par vos paramètres SMTP)
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async envoyerEmailConfirmation(email: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Utilisateur non trouvé');

      // Envoyer l'email de confirmation
      await this.transporter.sendMail({
        from: '"KOLLECTA" <noreply@kollecta.com>',
        to: email,
        subject: 'Bienvenue sur KOLLECTA - Confirmez votre compte',
        html: `
          <h1>Bienvenue sur KOLLECTA !</h1>
          <p>Merci de vous être inscrit. Pour confirmer votre compte, cliquez sur le lien ci-dessous :</p>
          <a href="http://localhost:3000/confirm-email?token=${user.verificationToken}">Confirmer mon compte</a>
        `
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
      throw error;
    }
  }

  async envoyerLienReinitialisation(email: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Utilisateur non trouvé');

      // Envoyer l'email de réinitialisation
      await this.transporter.sendMail({
        from: '"KOLLECTA" <noreply@kollecta.com>',
        to: email,
        subject: 'KOLLECTA - Réinitialisation de votre mot de passe',
        html: `
          <h1>Réinitialisation de votre mot de passe</h1>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous :</p>
          <a href="http://localhost:3000/reset-password?token=${user.resetToken}">Réinitialiser mon mot de passe</a>
        `
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi du lien de réinitialisation:', error);
      throw error;
    }
  }

  async notifierSuspension(email: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error('Utilisateur non trouvé');

      // Envoyer l'email de notification de suspension
      await this.transporter.sendMail({
        from: '"KOLLECTA" <noreply@kollecta.com>',
        to: email,
        subject: 'KOLLECTA - Suspension de votre compte',
        html: `
          <h1>Suspension de votre compte</h1>
          <p>Votre compte a été suspendu. Pour plus d'informations, veuillez contacter notre support.</p>
        `
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de suspension:', error);
      throw error;
    }
  }
}