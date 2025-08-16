import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { login, selectError, selectLoading, selectDeactivationMessage, clearError } from '../../store/slices/authSlice';
import DeactivationMessage from './DeactivationMessage';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  // ✅ Utiliser les états Redux au lieu des états locaux
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const deactivationMessage = useSelector(selectDeactivationMessage);

  // 🚫 EMPÊCHER TOUTE ACTUALISATION AUTOMATIQUE
  React.useEffect(() => {
    // Ne rien faire qui puisse causer une actualisation
  }, []); // Dépendances vides = exécution UNE SEULE FOIS



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await dispatch(login(formData) as any);
      
      // 🎯 GESTION SPÉCIALE POUR LES COMPTES DÉSACTIVÉS
      if (deactivationMessage) {
        // Si il y a un message de désactivation, ne pas rediriger immédiatement
        // L'utilisateur verra le message et pourra cliquer sur un bouton pour continuer
        console.log('🎯 Compte désactivé détecté, affichage du message de bienvenue');
        return;
      }
      
      // ✅ SUCCÈS : Redirection normale pour les comptes actifs
      window.location.href = '/profile';
    } catch (error: any) {
      // ❌ ERREUR : Ne pas rediriger, laisser l'erreur s'afficher
      // L'erreur est gérée par Redux et s'affichera automatiquement
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      pt: 12 // Augmenté de 4 à 12 pour créer plus d'espace sous le header
    }}>
      <Container maxWidth="sm">
        <Box sx={{ mt: 8 }}> {/* Augmenté de 4 à 8 pour plus d'espace */}
          <Paper elevation={3} sx={{ 
            p: 4, 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ 
              mb: 4,
              fontWeight: 700,
              color: '#1a1a1a'
            }}>
              Connexion
            </Typography>
            
            {/* 🎯 MESSAGE DE DÉSACTIVATION (après connexion réussie) */}
            <DeactivationMessage message={deactivationMessage || ''} />
            
            {/* 🎯 BOUTON POUR CONTINUER VERS LE PROFIL (si compte désactivé) */}
            {deactivationMessage && (
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => window.location.href = '/profile'}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Continuer vers le profil
                </Button>
              </Box>
            )}
            
            {/* 🚨 AFFICHER TOUJOURS L'ERREUR SI ELLE EXISTE */}
            {error && (
              <Alert 
                severity={error.includes('Connexion bloquée') ? 'warning' : 'error'} 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    fontSize: '1rem',
                    lineHeight: 1.5
                  }
                }}
              >
                {error}
              </Alert>
            )}
            


            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="email"
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
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="current-password"
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
                sx={{ 
                  mt: 4, 
                  mb: 2,
                  bgcolor: '#00b289',
                  '&:hover': { 
                    bgcolor: '#008e6d',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 178, 137, 0.3)'
                  },
                  height: 56,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 178, 137, 0.2)'
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Se connecter'}
              </Button>

              {/* Lien vers l'inscription */}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Pas encore de compte ?
                </Typography>
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none',
                    color: '#00b289',
                    fontWeight: 600,
                    fontSize: '1rem'
                  }}
                >
                  S'inscrire
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginForm;