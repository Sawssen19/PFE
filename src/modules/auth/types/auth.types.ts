export enum UserStatus {
  EN_ATTENTE = 'EN_ATTENTE',
  ACTIF = 'ACTIF',
  SUSPENDU = 'SUSPENDU'
}

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}