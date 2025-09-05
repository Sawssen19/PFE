// Types et interfaces pour le module Cagnottes

export interface Cagnotte {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  startDate: Date;
  endDate: Date;
  status: CagnotteStatus;
  creatorId: string;
  beneficiaryId: string;
  categoryId: string;
  coverImage?: string;
  coverVideo?: string;
  mediaType?: string;
  mediaFilename?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CagnotteStatus = 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'SUCCESS' | 'FAILED' | 'PENDING' | 'REJECTED';

export interface CreateCagnotteRequest {
  title: string;
  description: string;
  targetAmount: number;
  endDate: string; // ISO date string
  category: string;
}

export interface UpdateCagnotteRequest {
  title?: string;
  description?: string;
  targetAmount?: number;
  endDate?: string; // ISO date string
  category?: string;
  status?: CagnotteStatus;
}

export interface CagnotteFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: CagnotteStatus;
  search?: string;
}

export interface CagnotteWithCreator extends Cagnotte {
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  category: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface CagnotteWithPromesses extends CagnotteWithCreator {
  promises: PromiseWithUser[];
  _count: {
    promises: number;
  };
}

export interface PromiseWithUser {
  id: string;
  amount: number;
  status: PromiseStatus;
  promisedAt: Date;
  paidAt?: Date;
  contributor: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export type PromiseStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface CagnotteStats {
  totalCagnottes: number;
  activeCagnottes: number;
  completedCagnottes: number;
  totalAmountRaised: number;
  averageAmountPerCagnotte: number;
}

export interface CagnotteProgress {
  currentAmount: number;
  targetAmount: number;
  percentage: number;
  daysRemaining: number;
  isExpired: boolean;
}

// Validation schemas (pour Zod si utilisé)
export const createCagnotteSchema = {
  title: { type: 'string', minLength: 3, maxLength: 100 },
  description: { type: 'string', minLength: 10, maxLength: 1000 },
  targetAmount: { type: 'number', minimum: 1 },
  endDate: { type: 'string', format: 'date' },
  category: { type: 'string', minLength: 1, maxLength: 50 }
};

export const updateCagnotteSchema = {
  title: { type: 'string', minLength: 3, maxLength: 100, optional: true },
  description: { type: 'string', minLength: 10, maxLength: 1000, optional: true },
  targetAmount: { type: 'number', minimum: 1, optional: true },
  endDate: { type: 'string', format: 'date', optional: true },
  category: { type: 'string', minLength: 1, maxLength: 50, optional: true },
  status: { type: 'string', enum: ['active', 'completed', 'cancelled'], optional: true }
};

// Catégories prédéfinies pour les cagnottes
export const CAGNOTTE_CATEGORIES = [
  'Solidarité',
  'Éducation',
  'Santé',
  'Environnement',
  'Culture',
  'Sport',
  'Entrepreneuriat',
  'Urgence',
  'Autre'
] as const;

export type CagnotteCategory = typeof CAGNOTTE_CATEGORIES[number];

// Utilitaires
export const calculateProgress = (currentAmount: number, targetAmount: number): CagnotteProgress => {
  const percentage = Math.min((currentAmount / targetAmount) * 100, 100);
  return {
    currentAmount,
    targetAmount,
    percentage: Math.round(percentage * 100) / 100,
    daysRemaining: 0, // À calculer avec endDate
    isExpired: false // À calculer avec endDate
  };
};

export const isCagnotteExpired = (endDate: Date): boolean => {
  return new Date() > endDate;
};

export const getDaysRemaining = (endDate: Date): number => {
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}; 