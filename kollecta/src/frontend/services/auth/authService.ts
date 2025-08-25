import axios from 'axios';

// Types pour le frontend uniquement
interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  // ✅ Tous les champs de profil explicitement définis
  profilePicture?: string | null;
  profileUrl?: string | null;
  profileDescription?: string | null;
  profileVisibility?: string;
}

interface AuthResponse {
  user: UserResponse;
  token: string;
}

interface ApiResponse {
  success: boolean;
  data: AuthResponse;
}

const API_URL = 'http://localhost:5000/api';

class AuthService {
  private async request<T>(method: string, endpoint: string, data?: any): Promise<T> {
    const token = localStorage.getItem('token');
    try {
      const response = await axios({
        method,
        url: `${API_URL}/auth/${endpoint}`,
        data,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      return response.data;
    } catch (error: any) {
      // 🚨 Gestion spéciale pour les comptes bloqués (erreur 403)
      if (error.response?.status === 403 && error.response?.data?.blocked) {
        const blockedMessage = error.response.data.message;
        console.log('🚨 Compte bloqué détecté:', blockedMessage);
        throw new Error(blockedMessage);
      }
      
      // Gestion des autres erreurs
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      // Erreur générique
      throw new Error('Erreur de connexion au serveur');
    }
  }

  async register(data: RegisterInput): Promise<AuthResponse> {
    // 🧹 DÉCONTAMINATION COMPLÈTE : Vider TOUT le localStorage
    console.log('🧹 DÉCONTAMINATION COMPLÈTE avant inscription...');
    localStorage.clear(); // Supprime TOUT le localStorage
    
    console.log('✅ DÉCONTAMINATION complète effectuée');
    
    const response = await this.request<ApiResponse>('POST', 'register', data);
    
    // ✅ LOGS DE DÉBOGAGE : Vérifier ce que le backend renvoie vraiment
    console.log('🔍 Données reçues du backend (BRUTES):', response.data.user);
    
    // 🔧 SAUVEGARDE DANS LOCALSTORAGE : Comme pour login
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('💾 Données sauvegardées dans localStorage après register');
      
      // 🔍 VÉRIFICATION IMMÉDIATE : Confirmer que les données sont bien sauvegardées
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      console.log('🔍 Vérification localStorage après sauvegarde:');
      console.log('  - Token sauvegardé:', savedToken ? 'OUI' : 'NON');
      console.log('  - User sauvegardé:', savedUser ? 'OUI' : 'NON');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        console.log('  - User profilePicture:', parsedUser.profilePicture);
        console.log('  - User profileUrl:', parsedUser.profileUrl);
        console.log('  - User profileDescription:', parsedUser.profileDescription);
      }
    }
    
    // Extraire les données de la réponse API
    return {
      user: response.data.user,
      token: response.data.token
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    // 🧹 DÉCONTAMINATION COMPLÈTE : Vider TOUT le localStorage
    console.log('🧹 DÉCONTAMINATION COMPLÈTE avant connexion...');
    localStorage.clear(); // Supprime TOUT le localStorage
    
    console.log('✅ DÉCONTAMINATION complète effectuée');
    
    const response = await this.request<ApiResponse>('POST', 'login', data);
    // Extraire les données de la réponse API
    const authData = {
      user: response.data.user,
      token: response.data.token
    };
    
    // Stocker le token dans localStorage
    if (authData.token) {
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
    }
    
    return authData;
  }

  async forgotPassword(email: string): Promise<void> {
    return this.request<void>('POST', 'forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.request<void>('POST', 'reset-password', { token, newPassword });
  }

  async verifyEmail(token: string): Promise<void> {
    return this.request<void>('POST', 'verify-email', { token });
  }

  async getProfile(): Promise<UserResponse> {
    return this.request<UserResponse>('GET', 'profile');
  }

  async updateProfile(data: Partial<RegisterInput>): Promise<UserResponse> {
    return this.request<UserResponse>('PUT', 'profile', data);
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return this.request<void>('POST', 'change-password', { oldPassword, newPassword });
  }

  getCurrentUser(): UserResponse | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // 🔧 VALIDATION : Vérifier que l'utilisateur est valide
        if (typeof user.email !== 'string' || typeof user.id !== 'string') {
          console.warn('⚠️ Utilisateur invalide dans localStorage, suppression...');
          localStorage.removeItem('user');
          return null;
        }
        
        // 🔧 VÉRIFICATION DES CHAMPS DE PROFIL : S'assurer qu'ils sont propres
        if (user.profilePicture && typeof user.profilePicture === 'string') {
          console.log('🔍 getCurrentUser - profilePicture trouvé:', user.profilePicture);
        }
        if (user.profileUrl && typeof user.profileUrl === 'string') {
          console.log('🔍 getCurrentUser - profileUrl trouvé:', user.profileUrl);
        }
        
        return user;
      } catch (err) {
        console.error('❌ Erreur lors du parsing de l\'utilisateur:', err);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

export const authService = new AuthService();