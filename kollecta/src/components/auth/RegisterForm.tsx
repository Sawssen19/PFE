import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Container,
  CircularProgress,
  Paper,
  Alert,
} from '@mui/material';
import { registerSchema, RegisterInput } from '../../validations/auth.validation';
import { register as registerUser } from '../../store/slices/authSlice';
import Notification from '../common/Notification';
import Logo from '../common/Logo';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setIsLoading(true);
      
      // Use the register async thunk from authSlice
      const result = await dispatch(registerUser(data) as any);
      
      if (result.meta.requestStatus === 'fulfilled') {
        setNotification({
          open: true,
          message: 'Inscription réussie ! Vérifiez votre email pour activer votre compte.',
          severity: 'success',
        });

        // Rediriger après un court délai pour que l'utilisateur puisse voir le message
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        throw new Error(result.payload as string || 'Une erreur est survenue lors de l\'inscription');
      }
    } catch (error) {
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Une erreur est survenue',
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      pt: 12
    }}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Logo et titre */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
               {/* <Logo size={80} /> */}
              <Typography 
                component="h1" 
                variant="h4" 
                sx={{ 
                  mt: 2,
                  fontWeight: 700,
                  color: '#1a1a1a'
                }}
              >
                Créer un compte
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ mt: 1 }}
              >
                Rejoignez la communauté Kollecta
              </Typography>
            </Box>

            {/* Formulaire */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
              {/* Prénom et Nom sur la même ligne */}
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Prénom"
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00b289',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00b289',
                      }
                    }
                  }}
                />
                <TextField
                  fullWidth
                  label="Nom"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00b289',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00b289',
                      }
                    }
                  }}
                />
              </Box>

              <TextField
                fullWidth
                label="Adresse email"
                type="email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                required
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b289',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b289',
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                required
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b289',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b289',
                    }
                  }
                }}
              />

              <TextField
                fullWidth
                label="Confirmer le mot de passe"
                type="password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                required
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b289',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00b289',
                    }
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{ 
                  mt: 4, 
                  mb: 2,
                  bgcolor: '#00b289',
                  '&:hover': { 
                    bgcolor: '#008e6d',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 178, 137, 0.3)'
                  },
                  '&:disabled': { 
                    bgcolor: '#00b289', 
                    opacity: 0.7,
                    transform: 'none',
                    boxShadow: '0 4px 15px rgba(0, 178, 137, 0.2)'
                  },
                  height: 56,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 178, 137, 0.2)'
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Créer mon compte'
                )}
              </Button>

              {/* Lien vers la connexion */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Vous avez déjà un compte ?
                </Typography>
                <Link 
                  component={RouterLink} 
                  to="/login" 
                  sx={{ 
                    color: '#00b289',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Se connecter
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
      
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </Box>
  );
};

export default RegisterForm;