import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Container,
} from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Notification from '../common/Notification';
import Logo from '../common/Logo';

const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Adresse email invalide')
    .min(1, 'L\'email est requis'),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
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
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Une erreur est survenue');
      }

      setNotification({
        open: true,
        message: 'Si un compte existe avec cet email, vous recevrez les instructions pour réinitialiser votre mot de passe.',
        severity: 'success',
      });
    } catch (error) {
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Une erreur est survenue',
        severity: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Logo size={80} />
        <Typography component="h1" variant="h5">
          Mot de passe oublié
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Entrez votre adresse email et nous vous enverrons les instructions pour réinitialiser votre mot de passe.
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Adresse email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#00A651', '&:hover': { bgcolor: '#008C44' } }}
          >
            Envoyer les instructions
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" sx={{ color: '#00A651' }}>
              Retour à la connexion
            </Link>
          </Box>
        </Box>
      </Box>
      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
      />
    </Container>
  );
};

export default ForgotPasswordForm;