import { authService } from '../auth/authService';

export interface CreateCagnotteData {
  title: string;
  story: string;
  goalAmount: number;
  currency: string;
  category: string;
  country: string;
  postalCode: string;
  beneficiaryType: 'self' | 'other';
  mediaFile?: File;
  endDate: string;
  status?: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'REJECTED';
  currentStep?: number;
}

export interface Cagnotte {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'COMPLETED' | 'PENDING' | 'REJECTED';
  coverImage?: string;
  coverVideo?: string;
  mediaType?: string;
  mediaFilename?: string;
  currentStep?: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  category: {
    name: string;
  };
}

class CagnottesService {
  private baseURL = 'http://localhost:5000/api/cagnottes';

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
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createCagnotte(data: CreateCagnotteData): Promise<Cagnotte> {
    const formData = new FormData();
    
    // Ajouter les données de base
    formData.append('title', data.title);
    formData.append('story', data.story);
    formData.append('goalAmount', data.goalAmount.toString());
    formData.append('currency', data.currency);
    formData.append('category', data.category);
    formData.append('country', data.country);
    formData.append('postalCode', data.postalCode);
    formData.append('beneficiaryType', data.beneficiaryType);
    formData.append('endDate', data.endDate);
    
    // Ajouter le statut si fourni
    if (data.status) {
      formData.append('status', data.status);
    }
    
    // Ajouter le fichier média s'il existe
    if (data.mediaFile) {
      formData.append('media', data.mediaFile);
    }

    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseURL}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Gérer spécifiquement l'erreur de validation du compte
      if (response.status === 403 && errorData.code === 'ACCOUNT_NOT_VALIDATED') {
        const validationError = new Error(errorData.message);
        (validationError as any).code = 'ACCOUNT_NOT_VALIDATED';
        (validationError as any).details = errorData.details;
        throw validationError;
      }
      
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getAllCagnottes(): Promise<Cagnotte[]> {
    return this.makeRequest('');
  }

  async getCagnotteById(id: string): Promise<Cagnotte> {
    console.log('🔍 Appel getCagnotteById...', id);
    const response = await this.makeRequest(`/${id}`);
    console.log('🔍 Réponse getCagnotteById:', response);
    return response;
  }

  async getUserCagnottes(): Promise<any> {
    console.log('🔍 Appel getUserCagnottes...');
    const response = await this.makeRequest('/user/my-cagnottes');
    console.log('🔍 Réponse getUserCagnottes:', response);
    return response;
  }

  async updateCagnotte(id: string, data: Partial<CreateCagnotteData>): Promise<Cagnotte> {
    const formData = new FormData();
    
    // Ajouter les données de base
    if (data.title) formData.append('title', data.title);
    if (data.story) formData.append('story', data.story);
    if (data.goalAmount) formData.append('goalAmount', data.goalAmount.toString());
    if (data.currency) formData.append('currency', data.currency);
    if (data.category) formData.append('category', data.category);
    if (data.country) formData.append('country', data.country);
    if (data.postalCode) formData.append('postalCode', data.postalCode);
    if (data.beneficiaryType) formData.append('beneficiaryType', data.beneficiaryType);
    if (data.endDate) formData.append('endDate', data.endDate);
    
    // Ajouter le fichier média s'il existe
    if (data.mediaFile) {
      formData.append('media', data.mediaFile);
    }

    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteCagnotte(id: string): Promise<void> {
    return this.makeRequest(`/${id}`, {
      method: 'DELETE',
    });
  }

  async makePromise(cagnotteId: string, amount: number, message?: string): Promise<any> {
    return this.makeRequest(`/${cagnotteId}/promises`, {
      method: 'POST',
      body: JSON.stringify({ amount, message }),
    });
  }

  async getCagnottePromises(cagnotteId: string): Promise<any[]> {
    return this.makeRequest(`/${cagnotteId}/promises`);
  }

  async publishCagnotte(cagnotteId: string): Promise<Cagnotte> {
    return this.makeRequest(`/${cagnotteId}/publish`, {
      method: 'POST',
    });
  }

  // Méthodes pour gérer les brouillons
  async saveDraft(data: Partial<CreateCagnotteData>): Promise<Cagnotte> {
    const formData = new FormData();
    
    // Ajouter les données de base
    if (data.title) formData.append('title', data.title);
    if (data.story) formData.append('description', data.story);
    if (data.goalAmount) formData.append('targetAmount', data.goalAmount.toString());
    if (data.category) formData.append('category', data.category);
    if (data.currentStep) formData.append('currentStep', data.currentStep.toString());
    if (data.beneficiaryType) formData.append('beneficiaryType', data.beneficiaryType);
    if (data.country) formData.append('country', data.country);
    if (data.postalCode) formData.append('postalCode', data.postalCode);
    if (data.currency) formData.append('currency', data.currency);
    
    // Ajouter le fichier média s'il existe
    if (data.mediaFile) {
      formData.append('media', data.mediaFile);
    }

    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseURL}/draft`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async updateDraft(draftId: string, data: Partial<CreateCagnotteData>): Promise<Cagnotte> {
    const formData = new FormData();
    
    // Ajouter les données de base
    if (data.title) formData.append('title', data.title);
    if (data.story) formData.append('description', data.story);
    if (data.goalAmount) formData.append('targetAmount', data.goalAmount.toString());
    if (data.category) formData.append('category', data.category);
    if (data.currentStep) formData.append('currentStep', data.currentStep.toString());
    if (data.beneficiaryType) formData.append('beneficiaryType', data.beneficiaryType);
    if (data.country) formData.append('country', data.country);
    if (data.postalCode) formData.append('postalCode', data.postalCode);
    if (data.currency) formData.append('currency', data.currency);
    if (data.endDate) formData.append('endDate', data.endDate);
    if (data.status) formData.append('status', data.status);
    
    // Ajouter le fichier média s'il existe
    if (data.mediaFile) {
      formData.append('media', data.mediaFile);
    }

    const token = localStorage.getItem('token');
    
    const response = await fetch(`${this.baseURL}/draft/${draftId}`, {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const cagnottesService = new CagnottesService();
export default cagnottesService; 