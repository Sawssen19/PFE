import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDTO, LoginDTO, UpdateProfileDTO } from '../types/auth.types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  // Inscription
  async register(req: Request, res: Response) {
    try {
      const userData: RegisterDTO = req.body;
      const user = await this.authService.register(userData);
      res.status(201).json({
        message: 'Inscription réussie. Veuillez vérifier votre email.',
        user
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Erreur lors de l\'inscription'
      });
    }
  }

  // Connexion
  async login(req: Request, res: Response) {
    try {
      const loginData: LoginDTO = req.body;
      const { user, token } = await this.authService.login(loginData);
      res.json({
        message: 'Connexion réussie',
        user,
        token
      });
    } catch (error: any) {
      res.status(401).json({
        message: error.message || 'Erreur lors de la connexion'
      });
    }
  }

  // Demande de réinitialisation de mot de passe
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res.json({
        message: 'Instructions de réinitialisation envoyées par email'
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Erreur lors de la demande de réinitialisation'
      });
    }
  }

  // Mise à jour du profil
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // From JWT middleware
      if (!userId) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      const profileData: UpdateProfileDTO = req.body;
      const updatedUser = await this.authService.updateProfile(userId, profileData);
      res.json({
        message: 'Profil mis à jour avec succès',
        user: updatedUser
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Erreur lors de la mise à jour du profil'
      });
    }
  }

  // Liste des utilisateurs (admin)
  async listUsers(req: Request, res: Response) {
    try {
      const users = await this.authService.listUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({
        message: error.message || 'Erreur lors de la récupération des utilisateurs'
      });
    }
  }

  // Suspension de compte (admin)
  async suspendUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await this.authService.suspendUser(userId);
      res.json({
        message: 'Compte suspendu avec succès',
        user
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Erreur lors de la suspension du compte'
      });
    }
  }

  // Modification de rôle (admin)
  async updateUserRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      const user = await this.authService.updateUserRole(userId, role);
      res.json({
        message: 'Rôle mis à jour avec succès',
        user
      });
    } catch (error: any) {
      res.status(400).json({
        message: error.message || 'Erreur lors de la modification du rôle'
      });
    }
  }
}