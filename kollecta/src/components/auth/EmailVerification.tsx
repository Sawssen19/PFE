import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { authService } from '../../features/auth/authService';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        
        if (!token) {
          setStatus('error');
          setMessage('Token de vérification manquant');
          return;
        }

        // 🔐 Vérifier l'email avec le token
        await authService.verifyEmail(token);
        
        // ✅ Succès
        setStatus('success');
        setMessage('Votre email a été vérifié avec succès !');
        
        // 🔄 Mettre à jour le localStorage avec isVerified: true
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, isVerified: true };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        // 🚀 Rediriger vers le profil après 3 secondes
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
        
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Erreur lors de la vérification');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Vérification de votre email...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Veuillez patienter pendant que nous vérifions votre compte.
            </Typography>
          </Box>
        );

      case 'success':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 2, color: 'success.main' }}>
              ✅ Email vérifié !
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
              <strong>Félicitations !</strong> Votre compte est maintenant vérifié. 
              Vous allez être redirigé vers votre profil dans quelques secondes.
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/profile')}
              sx={{ mt: 2 }}
            >
              Aller à mon profil maintenant
            </Button>
          </Box>
        );

      case 'error':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" sx={{ mb: 2, color: 'error.main' }}>
              ❌ Erreur de vérification
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              <strong>Problème :</strong> Nous n'avons pas pu vérifier votre email. 
              Cela peut être dû à un lien expiré ou invalide.
            </Alert>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={() => window.location.reload()}
              >
                Réessayer
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
              >
                Aller à la connexion
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <EmailIcon sx={{ fontSize: 60, color: 'primary.main', mb: 3 }} />
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
            Vérification de votre email
          </Typography>
          
          {renderContent()}
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification;