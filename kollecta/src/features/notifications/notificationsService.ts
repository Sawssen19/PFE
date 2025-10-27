const API_BASE_URL = 'http://localhost:5000/api';

export interface Notification {
  id: string;
  userId: string;
  type: 'SYSTEM' | 'DONATION' | 'CAGNOTTE' | 'COMMENT' | 'REPORT' | 'ADMIN';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    cagnotteId?: string;
    donationAmount?: number;
    reportId?: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    unreadCount: number;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

class NotificationsService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * 📥 Récupérer les notifications de l'utilisateur
   */
  async getNotifications(page = 1, limit = 10): Promise<NotificationsResponse> {
    return this.request<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}`);
  }

  /**
   * 📖 Marquer une notification comme lue
   */
  async markAsRead(notificationId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  /**
   * 📖 Marquer toutes les notifications comme lues
   */
  async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    return this.request('/notifications/mark-all-read', {
      method: 'PUT',
    });
  }

  /**
   * 🗑️ Supprimer une notification
   */
  async deleteNotification(notificationId: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  /**
   * 🔔 Récupérer le nombre de notifications non lues
   */
  async getUnreadCount(): Promise<{ success: boolean; unreadCount: number }> {
    return this.request('/notifications/unread-count');
  }
}

export const notificationsService = new NotificationsService();


