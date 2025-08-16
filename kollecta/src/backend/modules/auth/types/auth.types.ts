import { Role, User } from '@prisma/client';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  profileVisibility?: string;
  profileDescription?: string;
  profileUrl?: string;
  profilePicture?: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export type UserResponse = Omit<User, 'password' | 'verificationToken' | 'resetToken' | 'resetTokenExp'>;

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}