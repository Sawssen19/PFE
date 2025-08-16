import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login as loginUser, register as registerUser, logout as logoutUser } from '../store/slices/authSlice';
import { authService } from '../services/auth/authService';

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput extends LoginInput {
  firstName: string;
  lastName: string;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAuthResponse = async (authAction: any, data: any) => {
    try {
      const result = await dispatch(authAction(data) as any);
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard');
      } else {
        throw new Error(result.payload as string || 'Erreur d\'authentification');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      throw err;
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      setError(null);
      await handleAuthResponse(registerUser, data);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setError(null);
      await handleAuthResponse(loginUser, data);
    } catch (err: any) {
      setError(err.message || 'Email ou mot de passe incorrect');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.forgotPassword(email);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.resetPassword(token, newPassword);
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    isLoading,
    error
  };
};