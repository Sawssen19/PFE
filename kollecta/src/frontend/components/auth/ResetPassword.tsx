import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Visibility, VisibilityOff, LockReset, ArrowBack } from '@mui/icons-material';
import { authService } from '../../services/auth/authService';

const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Token de réinitialisation manquant ou invalide');
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      setError('Token de réinitialisation manquant');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword(token, data.newPassword);
      setSuccess(true);
      reset();
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (!token) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#f8fafc'
      }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              Token de réinitialisation manquant ou invalide
            </Alert>
            <Button
              component={RouterLink}
              to="/forgot-password"
              variant="contained"
              startIcon={<ArrowBack />}
              sx={{ 
                bgcolor: '#f59e0b',
                '&:hover': { bgcolor: '#d97706' }
              }}
            >
              Retour à la récupération de mot de passe
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#f8fafc'
      }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Mot de passe réinitialisé avec succès !
            </Alert>
            <Typography variant="body1" sx={{ mb: 3, color: '#666' }}>
              Vous allez être redirigé vers la page de connexion dans quelques secondes...
            </Typography>
            <Button
              component={RouterLink}
              to="/login"
              variant="contained"
              sx={{ 
                bgcolor: '#f59e0b',
                '&:hover': { bgcolor: '#d97706' }
              }}
            >
              Aller à la connexion maintenant
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#f8fafc'
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LockReset sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700, 
              color: '#1f2937',
              mb: 1
            }}>
              Réinitialiser le mot de passe
            </Typography>
            <Typography variant="body1" sx={{ color: '#6b7280' }}>
              Entrez votre nouveau mot de passe
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('newPassword')}
              label="Nouveau mot de passe"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              autoComplete="new-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f59e0b',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f59e0b',
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#666'
                }
              }}
            />

            <TextField
              {...register('confirmPassword')}
              label="Confirmer le mot de passe"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              autoComplete="new-password"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f59e0b',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#f59e0b',
                  }
                },
                '& .MuiInputLabel-root': {
                  color: '#666'
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ 
                mt: 4, 
                mb: 3,
                bgcolor: '#f59e0b',
                '&:hover': { 
                  bgcolor: '#d97706',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
                },
                '&:disabled': {
                  bgcolor: '#fbbf24'
                },
                height: 56,
                borderRadius: 3,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.2)'
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                <>
                  <LockReset sx={{ mr: 1, fontSize: 20 }} />
                  Réinitialiser le mot de passe
                </>
              )}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Button
                component={RouterLink}
                to="/login"
                startIcon={<ArrowBack />}
                sx={{ 
                  color: '#6b7280',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  '&:hover': {
                    color: '#374151',
                    backgroundColor: 'rgba(107, 114, 128, 0.04)'
                  }
                }}
              >
                ← Retour à la connexion
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword; 