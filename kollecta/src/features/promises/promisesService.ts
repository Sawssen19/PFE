import { authService } from '../auth/authService';

export interface Promise {
  id: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  promisedAt: string;
  paidAt?: string;
  message?: string;
  isAnonymous?: boolean;
  contributor: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  cagnotte?: {
    id: string;
    title: string;
    description?: string;
    goalAmount: number;
    currentAmount: number;
    status: string;
    coverImage?: string;
    creator?: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export interface CreatePromiseData {
  cagnotteId: string;
  amount: number;
  message?: string;
  isAnonymous?: boolean;
}

export interface UpdatePromiseData {
  amount?: number;
  message?: string;
  isAnonymous?: boolean;
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

export interface PromisesResponse {
  promises: Promise[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class PromisesService {
  private baseURL = 'http://localhost:5000/api/promises';

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Si le token est invalide, nettoyer le localStorage et relancer une erreur spécifique
      if (response.status === 401 || errorData.message?.toLowerCase().includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Votre session a expiré. Veuillez vous reconnecter.');
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || result;
  }

  /**
   * Créer une promesse de don
   */
  async createPromise(data: CreatePromiseData): Promise<Promise> {
    return this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Récupérer une promesse par ID
   */
  async getPromiseById(id: string): Promise<Promise> {
    return this.makeRequest(`/${id}`);
  }

  /**
   * Récupérer les promesses d'une cagnotte
   */
  async getCagnottePromises(cagnotteId: string, filters?: { status?: string; page?: number; limit?: number }): Promise<PromisesResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    const response = await this.makeRequest(`/cagnotte/${cagnotteId}${queryString ? `?${queryString}` : ''}`);
    // Le backend retourne { success: true, data: { promises: [...], pagination: {...} } }
    return response.promises ? response : { promises: response, pagination: { page: 1, limit: 20, total: response.length || 0, totalPages: 1 } };
  }

  /**
   * Récupérer les promesses de l'utilisateur connecté
   */
  async getUserPromises(filters?: { status?: string; page?: number; limit?: number }): Promise<PromisesResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const queryString = params.toString();
    return this.makeRequest(`/user/my-promises${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * Modifier une promesse (montant, message, isAnonymous)
   */
  async updatePromise(id: string, data: UpdatePromiseData): Promise<Promise> {
    return this.makeRequest(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Mettre à jour le statut d'une promesse
   */
  async updatePromiseStatus(id: string, status: 'PENDING' | 'PAID' | 'CANCELLED', adminNotes?: string): Promise<Promise> {
    return this.makeRequest(`/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    });
  }

  /**
   * Supprimer une promesse
   */
  async deletePromise(id: string): Promise<void> {
    return this.makeRequest(`/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Obtenir les statistiques des promesses
   */
  async getPromiseStats(cagnotteId?: string): Promise<PromiseStats> {
    const queryString = cagnotteId ? `?cagnotteId=${cagnotteId}` : '';
    return this.makeRequest(`/stats${queryString}`);
  }
}

export const promisesService = new PromisesService();
export type { Promise, CreatePromiseData, UpdatePromiseData, PromiseStats, PromisesResponse };
export default promisesService;

