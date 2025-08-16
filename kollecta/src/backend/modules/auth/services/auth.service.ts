import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { RegisterInput, LoginInput, ResetPasswordInput, UpdateProfileInput, ChangePasswordInput, UserResponse, AuthResponse, TokenPayload } from '../types/auth.types';

class AuthService {
  private prisma: PrismaClient;
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;

  constructor() {
    this.prisma = new PrismaClient();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET must be defined');
    }
    this.JWT_SECRET = secret;
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
  }

  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private mapUserToResponse(user: any): UserResponse {
    const { password, verificationToken, resetToken, resetTokenExp, ...userResponse } = user;
    return userResponse;
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: input.email }
      });

      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      const hashedPassword = await this.hashPassword(input.password);
      const verificationToken = this.generateVerificationToken();

      const user = await this.prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          firstName: input.firstName,
          lastName: input.lastName,
          role: Role.USER,
          isVerified: false,
          verificationToken,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      const token = this.generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      // TODO: Envoyer l'email de vérification

      return {
        user: this.mapUserToResponse(user),
        token
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message.includes('Unique constraint failed on the fields: (`email`)')) {
        throw new Error('Cet email est déjà utilisé.');
      }
      throw new Error(error.message || 'Échec de l\'inscription. Veuillez réessayer.');
    }
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email }
    });

    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await this.comparePasswords(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    if (!user.isVerified) {
      throw new Error('Veuillez vérifier votre email pour activer votre compte');
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      user: this.mapUserToResponse(user),
      token
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token }
    });

    if (!user) {
      throw new Error('Token de vérification invalide');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
        updatedAt: new Date()
      }
    });
  }

  async resendVerification(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    if (user.isVerified) {
      throw new Error('Ce compte est déjà vérifié');
    }

    const verificationToken = this.generateVerificationToken();

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        verificationToken,
        updatedAt: new Date()
      }
    });

    // TODO: Envoyer le nouvel email de vérification
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Pour des raisons de sécurité, ne pas indiquer si l'email existe
      return;
    }

    const resetToken = this.generateVerificationToken();
    const resetTokenExp = new Date();
    resetTokenExp.setHours(resetTokenExp.getHours() + 1); // Token valide 1 heure

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp,
        updatedAt: new Date()
      }
    });

    // TODO: Envoyer l'email avec le token
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: input.token,
        resetTokenExp: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      throw new Error('Token invalide ou expiré');
    }

    const hashedPassword = await this.hashPassword(input.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
        updatedAt: new Date()
      }
    });
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserResponse> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...input,
        updatedAt: new Date()
      }
    });

    return this.mapUserToResponse(user);
  }

  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const isPasswordValid = await this.comparePasswords(input.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error('Ancien mot de passe incorrect');
    }

    const hashedPassword = await this.hashPassword(input.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    });
  }

  async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return this.mapUserToResponse(user);
  }
}

export const authService = new AuthService();