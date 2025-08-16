import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth/authService';
import { clearProfileData } from './profileSlice';

interface User {
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

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  deactivationMessage: string | null; // 🎯 Message spécial pour les comptes désactivés
}

// 🧹 NETTOYAGE INTELLIGENT : Nettoyer seulement les données suspectes
const currentUser = authService.getCurrentUser();
const currentToken = localStorage.getItem('token');

// Vérifier si l'utilisateur actuel a des données suspectes
let cleanUser = currentUser;
if (currentUser) {
  // Nettoyer seulement les champs problématiques, pas tout l'utilisateur
  cleanUser = {
    id: currentUser.id,
    email: currentUser.email,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    role: currentUser.role,
    isVerified: currentUser.isVerified,
    // Forcer profilePicture à null si suspect
    profilePicture: null
  };
}

const initialState: AuthState = {
  user: cleanUser,
  token: currentToken,
  isLoading: false,
  error: null,
  isAuthenticated: !!(cleanUser && currentToken),
  deactivationMessage: null, // 🎯 Message spécial pour les comptes désactivés
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login({ email, password });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur de connexion');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; firstName: string; lastName: string }, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur d\'inscription');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.forgotPassword(email);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur lors de la réinitialisation');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearUserData: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Action pour mettre à jour les données utilisateur
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        // ✅ UTILISER LES DONNÉES BRUTES DU BACKEND (sans forçage)
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // 🎯 GESTION DU MESSAGE DE DÉSACTIVATION
        state.deactivationMessage = action.payload.deactivationMessage || null;
        
        console.log('🔍 Utilisateur reçu du backend (Redux - login):', state.user);
        console.log('🔍 Détail des champs de profil dans Redux (login):');
        console.log('  - profilePicture:', state.user?.profilePicture);
        console.log('  - profileUrl:', state.user?.profileUrl);
        console.log('  - profileDescription:', state.user?.profileDescription);
        console.log('  - profileVisibility:', state.user?.profileVisibility);
        console.log('🎯 Message de désactivation:', state.deactivationMessage);
        
        // 🧹 NETTOYAGE : Vider le profile state pour éviter l'héritage
        console.log('🧹 Nettoyage du profile state après login...');
        // Note: clearProfileData sera appelé dans le composant Profile
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        // 🧹 NETTOYAGE CIBLÉ : Nettoyer seulement les données suspectes
        if (state.user) {
          state.user = {
            id: state.user.id,
            email: state.user.email,
            firstName: state.user.firstName,
            lastName: state.user.lastName,
            role: state.user.role,
            isVerified: state.user.isVerified,
            profilePicture: null // Forcer à null
          };
        }
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        // ✅ UTILISER LES DONNÉES BRUTES DU BACKEND (sans forçage)
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        console.log('🔍 Utilisateur reçu du backend (Redux):', state.user);
        console.log('🔍 Détail des champs de profil dans Redux:');
        console.log('  - profilePicture:', state.user?.profilePicture);
        console.log('  - profileUrl:', state.user?.profileUrl);
        console.log('  - profileDescription:', state.user?.profileDescription);
        console.log('  - profileVisibility:', state.user?.profileVisibility);
        
        // 🧹 NETTOYAGE : Vider le profile state pour éviter l'héritage
        console.log('🧹 Nettoyage du profile state après register...');
        // Note: clearProfileData sera appelé dans le composant Profile
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, updateUser, clearUserData } = authSlice.actions;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectDeactivationMessage = (state: { auth: AuthState }) => state.auth.deactivationMessage;

export default authSlice.reducer;