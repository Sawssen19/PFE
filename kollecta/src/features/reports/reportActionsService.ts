import { Report } from './reportsService';

const API_BASE_URL = 'http://localhost:5000/api/reports/actions';

export interface ReportActionData {
  adminNotes?: string;
  cagnotteAction?: 'SUSPEND' | 'DELETE' | 'NONE';
}

export interface ReportActionResponse {
  success: boolean;
  message: string;
  data: Report;
}

class ReportActionsService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    console.log('🔐 Token d\'authentification:', token ? 'Présent' : 'Absent');
    console.log('🌐 URL de la requête:', `${API_BASE_URL}${endpoint}`);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    console.log('📡 Statut de la réponse:', response.status);
    console.log('📡 Headers de la réponse:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Erreur API:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 🕒 Enquêter sur un signalement
   */
  async investigateReport(reportId: string, adminNotes?: string): Promise<ReportActionResponse> {
    return this.request<ReportActionResponse>(`/${reportId}/investigate`, {
      method: 'PUT',
      body: JSON.stringify({ adminNotes }),
    });
  }

  /**
   * ✔️ Résoudre un signalement
   */
  async resolveReport(
    reportId: string, 
    adminNotes?: string, 
    cagnotteAction?: 'SUSPEND' | 'DELETE' | 'NONE'
  ): Promise<ReportActionResponse> {
    return this.request<ReportActionResponse>(`/${reportId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ adminNotes, cagnotteAction }),
    });
  }

  /**
   * ⚠️ Rejeter un signalement
   */
  async rejectReport(reportId: string, adminNotes?: string): Promise<ReportActionResponse> {
    return this.request<ReportActionResponse>(`/${reportId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ adminNotes }),
    });
  }

  /**
   * 🚫 Bloquer la cagnotte
   */
  async blockCagnotte(reportId: string, adminNotes?: string): Promise<ReportActionResponse> {
    return this.request<ReportActionResponse>(`/${reportId}/block`, {
      method: 'PUT',
      body: JSON.stringify({ adminNotes }),
    });
  }

  /**
   * 🔄 Réactiver une cagnotte suspendue
   */
  async reactivateCagnotte(reportId: string, adminNotes?: string): Promise<ReportActionResponse> {
    return this.request<ReportActionResponse>(`/${reportId}/reactivate`, {
      method: 'PUT',
      body: JSON.stringify({ adminNotes }),
    });
  }

  /**
   * 🗑️ Supprimer un signalement
   */
  async deleteReport(reportId: string, adminNotes?: string): Promise<ReportActionResponse> {
    return this.request<ReportActionResponse>(`/${reportId}`, {
      method: 'DELETE',
      body: JSON.stringify({ adminNotes }),
    });
  }
}

export const reportActionsService = new ReportActionsService();