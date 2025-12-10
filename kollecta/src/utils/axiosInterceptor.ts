import axios from 'axios';

let isMaintenanceMode = false;
let maintenanceCheckInterval: NodeJS.Timeout | null = null;

/**
 * Vérifie le mode maintenance depuis l'API
 */
const checkMaintenanceMode = async (): Promise<boolean> => {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/check-maintenance', {
      timeout: 5000,
    });
    return response.data?.maintenanceMode === true;
  } catch (error: any) {
    // Si on reçoit une erreur 503, c'est que le mode maintenance est activé
    if (error.response?.status === 503 && error.response?.data?.maintenanceMode) {
      return true;
    }
    return false;
  }
};

/**
 * Vérifie si l'utilisateur est admin
 */
const isUserAdmin = (): boolean => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user?.role === 'ADMIN';
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Configure les intercepteurs axios pour bloquer les requêtes en mode maintenance
 */
export const setupMaintenanceInterceptor = () => {
  // Vérifier le mode maintenance au démarrage
  checkMaintenanceMode().then(mode => {
    isMaintenanceMode = mode;
  });

  // Vérifier périodiquement (toutes les 10 secondes)
  if (maintenanceCheckInterval) {
    clearInterval(maintenanceCheckInterval);
  }
  
  maintenanceCheckInterval = setInterval(async () => {
    isMaintenanceMode = await checkMaintenanceMode();
  }, 10000);

  // Intercepteur de requête
  axios.interceptors.request.use(
    async (config) => {
      // Routes exclues du blocage
      const excludedPaths = [
        '/api/auth/login',
        '/api/auth/register',
        '/api/auth/check-maintenance',
        '/api/admin/settings',
      ];

      const isExcluded = excludedPaths.some(path => config.url?.includes(path));

      // Si la route est exclue, continuer
      if (isExcluded) {
        return config;
      }

      // Vérifier le mode maintenance
      if (isMaintenanceMode) {
        // Si l'utilisateur est admin, autoriser la requête
        if (isUserAdmin()) {
          return config;
        }

        // Sinon, bloquer la requête
        return Promise.reject({
          response: {
            status: 503,
            data: {
              success: false,
              message: 'Le site est actuellement en maintenance. Veuillez réessayer plus tard.',
              maintenance: true,
              maintenanceMode: true,
            },
          },
        });
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Intercepteur de réponse pour gérer les erreurs 503
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      // Si on reçoit une erreur 503 avec maintenanceMode, mettre à jour le flag
      if (error.response?.status === 503 && error.response?.data?.maintenanceMode) {
        isMaintenanceMode = true;
        // Déclencher un événement personnalisé pour notifier le MaintenanceGuard
        window.dispatchEvent(new CustomEvent('maintenanceModeActivated'));
      }
      return Promise.reject(error);
    }
  );
};

/**
 * Intercepte les appels fetch pour bloquer en mode maintenance
 */
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  // Routes exclues du blocage
  const excludedPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/check-maintenance',
    '/api/admin/settings',
  ];

  const url = typeof args[0] === 'string' ? args[0] : args[0].url;
  const isExcluded = excludedPaths.some(path => url?.includes(path));

  // Si la route est exclue, continuer
  if (!isExcluded && isMaintenanceMode) {
    // Si l'utilisateur est admin, autoriser la requête
    if (!isUserAdmin()) {
      // Sinon, bloquer la requête
      return Promise.reject({
        status: 503,
        json: async () => ({
          success: false,
          message: 'Le site est actuellement en maintenance. Veuillez réessayer plus tard.',
          maintenance: true,
          maintenanceMode: true,
        }),
      } as Response);
    }
  }

  try {
    const response = await originalFetch(...args);
    
    // Si on reçoit une erreur 503 avec maintenanceMode, mettre à jour le flag
    if (response.status === 503) {
      const data = await response.clone().json().catch(() => ({}));
      if (data.maintenanceMode) {
        isMaintenanceMode = true;
        window.dispatchEvent(new CustomEvent('maintenanceModeActivated'));
      }
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Nettoie les intercepteurs (à appeler lors du démontage de l'application)
 */
export const cleanupMaintenanceInterceptor = () => {
  if (maintenanceCheckInterval) {
    clearInterval(maintenanceCheckInterval);
    maintenanceCheckInterval = null;
  }
  // Restaurer le fetch original si nécessaire
  window.fetch = originalFetch;
};

