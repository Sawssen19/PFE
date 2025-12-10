// Types et interfaces pour le module Promises

export interface Promise {
  id: string;
  amount: number;
  status: PromiseStatus;
  contributorId: string;
  cagnotteId: string;
  promisedAt: Date;
  paidAt?: Date;
  message?: string;
  isAnonymous?: boolean;
}

export type PromiseStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface PromiseWithUser extends Promise {
  contributor: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    email?: string;
  };
  cagnotte?: {
    id: string;
    title: string;
    creatorId: string;
  };
}

export interface PromiseWithCagnotte extends Promise {
  cagnotte: {
    id: string;
    title: string;
    description: string;
    goalAmount: number;
    currentAmount: number;
    status: string;
    creator: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreatePromiseRequest {
  cagnotteId: string;
  amount: number;
  message?: string;
  isAnonymous?: boolean;
}

export interface UpdatePromiseRequest {
  amount?: number;
  message?: string;
  isAnonymous?: boolean;
}

export interface UpdatePromiseStatusRequest {
  status: PromiseStatus;
  adminNotes?: string;
}

export interface PromiseFilters {
  page?: number;
  limit?: number;
  status?: PromiseStatus;
  cagnotteId?: string;
  contributorId?: string;
}

export interface PromiseStats {
  totalPromises: number;
  pendingPromises: number;
  paidPromises: number;
  cancelledPromises: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
}

// Validation schemas
export const createPromiseSchema = {
  cagnotteId: { type: 'string', required: true },
  amount: { type: 'number', minimum: 1, required: true },
  message: { type: 'string', maxLength: 500, optional: true }
};

export const updatePromiseStatusSchema = {
  status: { type: 'string', enum: ['PENDING', 'PAID', 'CANCELLED'], required: true },
  adminNotes: { type: 'string', maxLength: 1000, optional: true }
};

// Utilitaires
export const formatPromiseAmount = (amount: number, currency: string = 'TND'): string => {
  return `${amount.toFixed(2)} ${currency}`;
};

export const getPromiseStatusLabel = (status: PromiseStatus): string => {
  const labels = {
    PENDING: 'En attente',
    PAID: 'Payée',
    CANCELLED: 'Annulée'
  };
  return labels[status] || status;
};

export const isPromiseEditable = (status: PromiseStatus): boolean => {
  return status === 'PENDING';
};

