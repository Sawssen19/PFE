import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthController {
  // Inscription
  async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
        },
      });

      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'Inscription réussie',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ message: 'Erreur lors de l\'inscription' });
    }
  }

  // Connexion
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
  }

  // Réinitialisation du mot de passe - Demande
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Générer un token de réinitialisation
      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      // Sauvegarder le token et sa date d'expiration
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExp: new Date(Date.now() + 3600000), // 1 heure
        },
      });

      // TODO: Envoyer l'email avec le lien de réinitialisation

      res.json({ message: 'Instructions envoyées par email' });
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation' });
    }
  }

  // Réinitialisation du mot de passe - Reset
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      // Vérifier le token
      const user = await prisma.user.findFirst({
        where: {
          resetToken: token,
          resetTokenExp: {
            gt: new Date(),
          },
        },
      });

      if (!user) {
        return res.status(400).json({ message: 'Token invalide ou expiré' });
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe et réinitialiser le token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExp: null,
        },
      });

      res.json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
    }
  }
}