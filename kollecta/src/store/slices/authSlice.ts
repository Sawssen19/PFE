import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../features/auth/authService';

// Types basés sur la structure réelle du authService
interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
  profilePicture?: string | null;
  profileUrl?: string | null;
  profileDescription?: string | null;
  profileVisibility?: string;
}

interface AuthResponse {
  user: UserResponse;
  token: string;
  deactivationMessage?: string; // 🎯 Message optionnel pour les comptes désactivés
}

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  deactivationMessage: string | null; // 🎯 Message spécial pour les comptes désactivés
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isAuthenticated: false,
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
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erreur lors de l\'envoi de l\'email');
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
      state.deactivationMessage = null; // 🎯 Effacer le message de désactivation
    },
    clearError: (state) => {
      state.error = null;
    },
    // 🎯 NOUVELLE ACTION : Effacer le message de désactivation
    clearDeactivationMessage: (state) => {
      state.deactivationMessage = null;
    },
    // 🔄 NOUVELLE ACTION : Mettre à jour l'utilisateur
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Mettre à jour aussi le localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
      }
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        
        // 🎯 GESTION DU MESSAGE DE DÉSACTIVATION
        // Si le backend renvoie un message de désactivation, l'utilisateur peut continuer
        if (action.payload.deactivationMessage) {
          state.deactivationMessage = action.payload.deactivationMessage;
          console.log('🎯 Message de désactivation reçu:', action.payload.deactivationMessage);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
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

export const { logout, clearError, clearDeactivationMessage, updateUser } = authSlice.actions;

// Sélecteurs
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectDeactivationMessage = (state: { auth: AuthState }) => state.auth.deactivationMessage;

export default authSlice.reducer;