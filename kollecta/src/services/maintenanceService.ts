import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Service pour vérifier le mode maintenance
 * Utilise une route publique pour éviter les problèmes d'authentification
 */
class MaintenanceService {
  /**
   * Vérifie si le mode maintenance est activé
   * Cette méthode peut être appelée sans authentification
   */
  async checkMaintenanceMode(): Promise<boolean> {
    try {
      // Essayer d'accéder à une route API publique
      // Si le mode maintenance est activé, on recevra une erreur 503
      const response = await axios.get(`${API_URL}/auth/check-maintenance`, {
        validateStatus: (status) => status < 500, // Accepter les erreurs 4xx
      });

      // Si on reçoit une réponse 503 avec maintenanceMode, c'est activé
      if (response.status === 503 && response.data?.maintenanceMode) {
        return true;
      }

      // Sinon, essayer de récupérer les paramètres système
      // (cette route nécessite une authentification, mais on peut gérer l'erreur)
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const settingsResponse = await axios.get(`${API_URL}/admin/settings`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            validateStatus: (status) => status < 500,
          });

          if (settingsResponse.status === 200) {
            return settingsResponse.data?.data?.general?.maintenanceMode === true;
          }
        }
      } catch (error: any) {
        // Si on reçoit 503, c'est que le mode maintenance est activé
        if (error.response?.status === 503 && error.response?.data?.maintenanceMode) {
          return true;
        }
      }

      return false;
    } catch (error: any) {
      // Si on reçoit une erreur 503 avec maintenanceMode, c'est activé
      if (error.response?.status === 503 && error.response?.data?.maintenanceMode) {
        return true;
      }
      // Par défaut, considérer que le mode maintenance n'est pas activé
      return false;
    }
  }
}

export default new MaintenanceService();

