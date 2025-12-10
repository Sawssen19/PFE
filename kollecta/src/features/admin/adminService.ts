import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

export interface KYCVerification {
  verificationStatus: string;
  riskScore: number;
  verificationDate?: string;
  expiryDate?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface AMLCheck {
  riskLevel: string;
  ofacStatus: boolean;
  unStatus: boolean;
  suspiciousActivity: boolean;
  lastCheckDate: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string | null;
  profilePicture?: string;
  profileDescription?: string;
  profileUrl?: string;
  profileVisibility?: string;
  language?: string;
  // 🔐 Informations KYC (sans documents sensibles)
  kycVerification?: KYCVerification;
  amlCheck?: AMLCheck;
}

export interface UserUpdateData {
  status?: string;
  isActive?: boolean;
  isVerified?: boolean;
  role?: string;
}

export interface UserStats {
  total: number;
  active: number;
  verified: number;
  pending: number;
  admins: number;
  inactive: number;
  unverified: number;
}

class AdminService {
  private getAuthHeaders() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      return {
        'Authorization': `Bearer ${userData.token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  // Récupérer tous les utilisateurs
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  // Récupérer un utilisateur par ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'un utilisateur
  async updateUserStatus(id: string, data: UserUpdateData): Promise<User> {
    try {
      const response = await axios.put(`${API_URL}/users/${id}/status`, data, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  }

  // Mettre à jour le rôle d'un utilisateur
  async updateUserRole(id: string, role: string): Promise<User> {
    try {
      const response = await axios.put(`${API_URL}/users/${id}/role`, { role }, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: this.getAuthHeaders(),
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }

  // Obtenir les statistiques des utilisateurs
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await axios.get(`${API_URL}/stats`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Actions spécifiques pour les utilisateurs
  async approveUser(id: string): Promise<User> {
    return this.updateUserStatus(id, { status: 'ACTIVE', isActive: true });
  }

  // 🔐 Approuver un utilisateur basé sur son KYC
  async approveUserKYC(id: string): Promise<User> {
    try {
      const response = await axios.put(`${API_URL}/users/${id}/approve-kyc`, {}, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'approbation KYC:', error);
      throw error;
    }
  }

  async suspendUser(id: string): Promise<User> {
    try {
      const response = await axios.put(`${API_URL}/users/${id}/suspend`, {}, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suspension de l\'utilisateur:', error);
      throw error;
    }
  }

  async blockUser(id: string): Promise<User> {
    return this.updateUserStatus(id, { status: 'BLOCKED', isActive: false });
  }

  async activateUser(id: string): Promise<User> {
    return this.updateUserStatus(id, { isActive: true });
  }

  async verifyUser(id: string): Promise<User> {
    return this.updateUserStatus(id, { isVerified: true });
  }

  // 📋 Récupérer les logs d'administration
  async getLogs(filters?: {
    page?: number;
    limit?: number;
    level?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    success: boolean;
    data: {
      logs: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    };
  }> {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.level) params.append('level', filters.level);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const queryString = params.toString();
      const endpoint = queryString ? `${API_URL}/logs?${queryString}` : `${API_URL}/logs`;

      const response = await axios.get(endpoint, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des logs:', error);
      throw error;
    }
  }

  // ⚙️ Récupérer les paramètres système
  async getSystemSettings(): Promise<{
    success: boolean;
    data: any;
  }> {
    try {
      const response = await axios.get(`${API_URL}/settings`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      throw error;
    }
  }

  // ⚙️ Sauvegarder les paramètres système
  async updateSystemSettings(settings: any): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await axios.put(`${API_URL}/settings`, settings, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      throw error;
    }
  }

  // 📊 Récupérer les statistiques du dashboard
  async getDashboardStats(): Promise<{
    success: boolean;
    data: {
      users: { active: number; total: number; change: number; changeType: string };
      cagnottes: { active: number; total: number; pending: number; change: number; changeType: string };
      reports: { pending: number; total: number; change: number; changeType: string };
      actions: { required: number; change: number; changeType: string };
    };
  }> {
    try {
      const response = await axios.get(`${API_URL}/dashboard-stats`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du dashboard:', error);
      throw error;
    }
  }

  // 📊 Récupérer les statistiques analytiques détaillées
  async getAnalyticsStats(): Promise<{
    success: boolean;
    data: {
      users: { total: number; active: number; pending: number; suspended: number; growth: number };
      campaigns: { total: number; active: number; pending: number; completed: number; rejected: number; totalAmount: number; averageAmount: number };
      reports: { total: number; pending: number; resolved: number; urgent: number; high: number };
      performance: { responseTime: number; resolutionRate: number; userSatisfaction: number; platformUptime: number };
      topCategories: Array<{ name: string; count: number; percentage: number }>;
      recentActivity: Array<{ id: string; type: string; description: string; timestamp: string; user: string; status: string }>;
    };
  }> {
    try {
      const response = await axios.get(`${API_URL}/analytics`, {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques analytiques:', error);
      throw error;
    }
  }
}

export default new AdminService(); 