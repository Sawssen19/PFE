import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface VerificationFormInputs {
  code: string;
}

const EmailVerification = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');
  
  const { register, handleSubmit, formState: { errors } } = useForm<VerificationFormInputs>();

  // 🔍 Récupérer le token depuis l'URL si présent
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Auto-vérification si le token est dans l'URL
      handleAutoVerification(token);
    }
  }, [searchParams]);

  // 🚀 Vérification automatique avec le token de l'URL
  const handleAutoVerification = async (token: string) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', {
        token: token
      });

      if (response.data.success) {
        setSuccess('🎉 Email vérifié avec succès ! Redirection vers la page de connexion...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la vérification automatique');
    } finally {
      setLoading(false);
    }
  };

  // 📝 Vérification manuelle avec le code saisi
  const onSubmit = async (data: VerificationFormInputs) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-email', {
        token: data.code
      });

      if (response.data.success) {
        setSuccess('🎉 Email vérifié avec succès ! Redirection vers la page de connexion...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la vérification');
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Renvoyer un nouveau code de vérification
  const handleResendCode = async () => {
    if (!email) {
      setError('Veuillez d\'abord saisir votre email');
      return;
    }

    setResendLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:5000/api/auth/resend-verification', { email });
      setSuccess('📧 Un nouveau code de vérification a été envoyé à votre email');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setResendLoading(false);
    }
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
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom sx={{ color: '#02a95c', fontWeight: 'bold' }}>
            🔐 Vérification de l'email
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Veuillez entrer le code de vérification envoyé à votre adresse email
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              {success}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#02a95c', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Vérification en cours...
              </Typography>
            </Box>
          ) : (
            <>
              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Code de vérification"
                  placeholder="Entrez le code reçu par email"
                  {...register('code', { required: 'Le code est requis' })}
                  error={!!errors.code}
                  helperText={errors.code?.message}
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: '#02a95c',
                    '&:hover': { bgcolor: '#02884a' },
                    mb: 2,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  }}
                >
                  ✅ Vérifier mon email
                </Button>
              </Box>

              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                  Vous n'avez pas reçu le code ?
                </Typography>
                
                <TextField
                  margin="normal"
                  fullWidth
                  label="Votre email"
                  type="email"
                  placeholder="Entrez votre email pour recevoir un nouveau code"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleResendCode}
                  disabled={resendLoading || !email}
                  sx={{
                    color: '#02a95c',
                    borderColor: '#02a95c',
                    '&:hover': { 
                      borderColor: '#02884a',
                      bgcolor: 'rgba(2, 169, 92, 0.04)' 
                    },
                    py: 1.5,
                  }}
                >
                  {resendLoading ? (
                    <CircularProgress size={20} sx={{ color: '#02a95c' }} />
                  ) : (
                    '🔄 Renvoyer le code'
                  )}
                </Button>
              </Box>
            </>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{
                color: '#666',
                '&:hover': { bgcolor: 'rgba(102, 102, 102, 0.04)' },
              }}
            >
              ← Retour à la connexion
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification;