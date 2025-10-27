import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowBack, Email, LockReset, Phone, Message } from '@mui/icons-material';
import PhoneInput from '../common/PhoneInput';

const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide').optional(),
  phone: z.string().min(1, 'Numéro de téléphone requis').optional(),
}).refine((data) => data.email || data.phone, {
  message: "Veuillez fournir un email ou un numéro de téléphone",
  path: ["email"]
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [method, setMethod] = useState<'email' | 'sms'>('email');
  const [sentMethod, setSentMethod] = useState<'email' | 'sms'>('email');
  const [resetLink, setResetLink] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleMethodChange = (event: React.SyntheticEvent, newValue: 'email' | 'sms') => {
    setMethod(newValue);
    // Réinitialiser les champs et erreurs
    setValue('email', '');
    setValue('phone', '');
    clearErrors();
  };

  const onSubmit = async (data: ForgotPasswordInput) => {
    console.log('🚀 onSubmit appelé avec:', { data, method });
    setLoading(true);
    setError('');

    try {
      const payload = method === 'email' ? { email: data.email } : { phone: data.phone };
      console.log('📤 Payload envoyé:', payload);
      
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('📥 Réponse reçue:', { status: response.status, result });

      if (!response.ok) {
        throw new Error(result.message || 'Une erreur est survenue');
      }

      // Si c'est un SMS et qu'on a un lien de réinitialisation
      if (method === 'sms' && result.resetUrl) {
        console.log('🔗 Lien de réinitialisation reçu:', result.resetUrl);
        setResetLink(result.resetUrl);
      }

      console.log('✅ Succès, mise à jour de l\'état');
      setSentMethod(method);
      setSuccess(true);
      reset();
    } catch (error) {
      console.error('❌ Erreur dans onSubmit:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setError('');
    setResetLink('');
    reset();
  };

  if (success) {
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
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'var(--kollecta-gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                }}>
                  {sentMethod === 'email' ? (
                    <Email sx={{ fontSize: 40, color: 'white' }} />
                  ) : (
                    <Message sx={{ fontSize: 40, color: 'white' }} />
                  )}
                </Box>
                
                <Typography variant="h4" component="h1" gutterBottom sx={{ 
                  fontWeight: 700,
                  color: '#1a1a1a',
                  mb: 2
                }}>
                  ✅ {sentMethod === 'email' ? 'Email envoyé !' : 'SMS envoyé !'}
                </Typography>
                
                <Typography variant="body1" sx={{ 
                  color: '#666',
                  lineHeight: 1.6,
                  mb: 3
                }}>
                  {sentMethod === 'email' 
                    ? 'Si un compte existe avec cet identifiant, vous recevrez les instructions pour réinitialiser votre mot de passe dans quelques minutes.'
                    : 'Votre lien de réinitialisation a été généré avec succès !'
                  }
                </Typography>

                {/* Afficher le lien de réinitialisation pour SMS */}
                {sentMethod === 'sms' && resetLink && (
                  <Box sx={{ 
                    p: 3, 
                    bgcolor: '#f8f9fa', 
                    borderRadius: 2, 
                    border: '2px solid #e9ecef',
                    mb: 3
                  }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#495057', fontWeight: 600 }}>
                      🔗 Lien de réinitialisation
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: '#6c757d' }}>
                      Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :
                    </Typography>
                    <Button
                      component="a"
                      href={resetLink}
                      variant="contained"
                      fullWidth
                      sx={{
                        bgcolor: 'var(--kollecta-primary)',
                        '&:hover': { bgcolor: 'var(--kollecta-primary-dark)' },
                        borderRadius: 2,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      🔑 Réinitialiser mon mot de passe
                    </Button>
                    <Typography variant="caption" sx={{ 
                      display: 'block', 
                      mt: 1, 
                      color: '#6c757d',
                      textAlign: 'center'
                    }}>
                      Ce lien expire dans 1 heure
                    </Typography>
                  </Box>
                )}

                <Alert severity="info" sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  textAlign: 'left',
                  '& .MuiAlert-message': {
                    fontSize: '0.95rem',
                    lineHeight: 1.5
                  }
                }}>
                  <strong>💡 Conseil :</strong> 
                  {sentMethod === 'email' 
                    ? 'Vérifiez également votre dossier spam si vous ne recevez pas l\'email dans votre boîte de réception.'
                    : 'Assurez-vous que votre téléphone est allumé et que vous avez une bonne réception réseau.'
                  }
                </Alert>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    startIcon={<LockReset />}
                    sx={{
                      borderColor: 'var(--kollecta-primary)',
                      color: 'var(--kollecta-primary)',
                      '&:hover': {
                        borderColor: 'var(--kollecta-primary-dark)',
                        backgroundColor: 'rgba(0, 178, 137, 0.04)'
                      },
                      borderRadius: 2,
                      px: 3,
                      py: 1.5
                    }}
                  >
                    Nouvelle demande
                  </Button>
                  
                  <Button
                    variant="contained"
                    component={RouterLink}
                    to="/login"
                    startIcon={<ArrowBack />}
                    sx={{
                      bgcolor: 'var(--kollecta-primary)',
                      '&:hover': { 
                        bgcolor: 'var(--kollecta-primary-dark)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 178, 137, 0.3)'
                      },
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: 'none'
                    }}
                  >
                    Retour à la connexion
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    );
  }

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
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
              }}>
                <LockReset sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography variant="h4" component="h1" gutterBottom sx={{ 
                fontWeight: 700,
                color: '#1a1a1a',
                mb: 2
              }}>
                🔑 Mot de passe oublié ?
              </Typography>
              
              <Typography variant="body1" sx={{ 
                color: '#666',
                lineHeight: 1.6,
                mb: 3
              }}>
                Pas de panique ! Choisissez votre méthode de récupération et nous vous enverrons 
                les instructions pour réinitialiser votre mot de passe.
              </Typography>
            </Box>

            {/* Onglets Email/SMS */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={method} 
                onChange={handleMethodChange}
                centered
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    minHeight: 48
                  },
                  '& .Mui-selected': {
                    color: '#f59e0b'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#f59e0b'
                  }
                }}
              >
                <Tab 
                  value="email" 
                  label="📧 Par Email" 
                  icon={<Email sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                />
                <Tab 
                  value="sms" 
                  label="📱 Par SMS" 
                  icon={<Phone sx={{ fontSize: 20 }} />}
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {error && (
              <Alert severity="error" sx={{ 
                mb: 3, 
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '1rem',
                  lineHeight: 1.5
                }
              }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
              {method === 'email' ? (
                <TextField
                  fullWidth
                  label="Adresse email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  required
                  autoComplete="email"
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
              ) : (
                <PhoneInput
                  label="Numéro de téléphone"
                  value={watch('phone') || ''}
                  onChange={(value) => setValue('phone', value)}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  required
                />
              )}
              
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
                    {method === 'email' ? (
                      <>
                        <Email sx={{ mr: 1, fontSize: 20 }} />
                        Envoyer par email
                      </>
                    ) : (
                      <>
                        <Message sx={{ mr: 1, fontSize: 20 }} />
                        Envoyer par SMS
                      </>
                    )}
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
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPasswordForm;