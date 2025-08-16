import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterDTO, LoginDTO, UpdateProfileDTO, UserResponse, UserStatus } from '../types/auth.types';

const prisma = new PrismaClient();

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
  private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  // Inscription
  async register(data: RegisterDTO): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        status: UserStatus.EN_ATTENTE,
        role: 'USER'
      }
    });

    // TODO: Envoyer email de confirmation
    
    return this.formatUserResponse(user);
  }

  // Connexion
  async login(data: LoginDTO): Promise<{ user: UserResponse; token: string }> {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    if (user.status === UserStatus.SUSPENDU) {
      throw new Error('Compte suspendu');
    }

    if (user.status === UserStatus.EN_ATTENTE) {
      throw new Error('Compte non vérifié');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const token = this.generateToken(user);
    
    return {
      user: this.formatUserResponse(user),
      token
    };
  }

  // Réinitialisation mot de passe - Demande
  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const resetToken = jwt.sign(
      { userId: user.id },
      this.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp: new Date(Date.now() + 3600000) // 1 heure
      }
    });

    // TODO: Envoyer email avec lien de réinitialisation
  }

  // Mise à jour du profil
  async updateProfile(userId: string, data: UpdateProfileDTO): Promise<UserResponse> {
    const user = await prisma.user.update({
      where: { id: userId },
      data
    });

    return this.formatUserResponse(user);
  }

  // Liste des utilisateurs (admin)
  async listUsers(): Promise<UserResponse[]> {
    const users = await prisma.user.findMany();
    return users.map(this.formatUserResponse);
  }

  // Suspension de compte (admin)
  async suspendUser(userId: string): Promise<UserResponse> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.SUSPENDU }
    });

    // TODO: Envoyer notification de suspension

    return this.formatUserResponse(user);
  }

  // Modification de rôle (admin)
  async updateUserRole(userId: string, newRole: string): Promise<UserResponse> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    });

    return this.formatUserResponse(user);
  }

  // Utilitaires
  private generateToken(user: any): string {
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  private formatUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}