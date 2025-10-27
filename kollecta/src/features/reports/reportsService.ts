const API_BASE_URL = 'http://localhost:5000/api';

export interface ReportAnalysis {
  type: 'FRAUD' | 'INAPPROPRIATE' | 'SPAM' | 'DUPLICATE' | 'COMMENT' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  analyzedAt: string;
  keywords: string[];
  confidence: number;
}

export interface Report {
  id: string;
  cagnotteId: string;
  reason: string;
  description: string;
  reporterName: string;
  reporterEmail: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  adminNotes?: string;
  adminId?: string;
  createdAt: string;
  updatedAt: string;
  analysis?: ReportAnalysis;
  cagnotte: {
    id: string;
    title: string;
    description: string;
    creator: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  admin?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateReportData {
  cagnotteId: string;
  reason: string;
  description: string;
  reporterName: string;
  reporterEmail: string;
}

export interface ReportsResponse {
  reports: Report[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    total: number;
    pending: number;
    underReview: number;
    resolved: number;
    dismissed: number;
  };
}

export interface ReportFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

class ReportsService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur API Reports:', error);
      throw error;
    }
  }

  // Créer un signalement
  async createReport(data: CreateReportData): Promise<{ success: boolean; message: string; data: Report }> {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Récupérer tous les signalements (admin)
  async getReports(filters: ReportFilters = {}): Promise<{ success: boolean; data: ReportsResponse }> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = queryString ? `/reports?${queryString}` : '/reports';
    
    return this.request(endpoint);
  }

  // Récupérer un signalement par ID
  async getReportById(id: string): Promise<{ success: boolean; data: Report }> {
    return this.request(`/reports/${id}`);
  }

  // Mettre à jour le statut d'un signalement (admin)
  async updateReportStatus(
    id: string, 
    status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED',
    adminNotes?: string
  ): Promise<{ success: boolean; message: string; data: Report }> {
    return this.request(`/reports/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminNotes }),
    });
  }

  // Supprimer un signalement (admin)
  async deleteReport(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/reports/${id}`, {
      method: 'DELETE',
    });
  }
}

export const reportsService = new ReportsService();