import React, { useState, useRef } from 'react';

// Configuration API
const API_URL = 'http://localhost:5000/api';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Chip,
  Paper,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Upload as UploadIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { selectUser } from '../../store/slices/authSlice';
import './KYCVerification.css';

interface KYCVerificationProps {
  onComplete?: () => void;
}

export const KYCVerification: React.FC<KYCVerificationProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [documentType, setDocumentType] = useState<'CARTE_IDENTITE' | 'PASSEPORT'>('CARTE_IDENTITE');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const frontFileRef = useRef<HTMLInputElement>(null);
  const backFileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (field: 'front' | 'back', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validation du fichier
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('Le fichier est trop volumineux. Taille maximale : 5MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Type de fichier non supporté. Utilisez JPEG, PNG ou WebP.');
        return;
      }
      
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user) {
      setError('Vous devez être connecté pour effectuer la vérification KYC');
      return;
    }

    const frontFile = frontFileRef.current?.files?.[0];
    const backFile = backFileRef.current?.files?.[0];

    if (!frontFile) {
      setError('Le document recto est obligatoire');
      return;
    }

    if (documentType === 'CARTE_IDENTITE' && !backFile) {
      setError('Document verso requis pour la carte d\'identité');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('documentType', documentType);
      formData.append('documentFront', frontFile);
      if (backFile) {
        formData.append('documentBack', backFile);
      }

      // Simulation de progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${API_URL}/kyc/local/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la vérification KYC');
      }

      const result = await response.json();
      setSuccess(true);
      
      // Appeler le callback de complétion
      if (onComplete) {
        onComplete();
      }

      // Rediriger vers la page de succès après 3 secondes
      setTimeout(() => {
        navigate('/kyc/success');
      }, 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setDocumentType('CARTE_IDENTITE');
    setError(null);
    setSuccess(false);
    if (frontFileRef.current) frontFileRef.current.value = '';
    if (backFileRef.current) backFileRef.current.value = '';
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Card elevation={0} sx={{ borderRadius: 3, textAlign: 'center', p: 4 }}>
          <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" component="h2" color="success.main" gutterBottom>
            Vérification KYC initiée avec succès !
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Vos documents ont été envoyés pour vérification. Vous recevrez une notification une fois la vérification terminée.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirection en cours...
          </Typography>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 8, sm: 12, md: 16 } }}>
      {/* Header moderne */}
      <Box sx={{ textAlign: 'center', mb: { xs: 10, sm: 14, md: 18 } }}>
        <Paper 
          elevation={0} 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: { xs: 3, sm: 4 },
            mb: { xs: 6, sm: 10, md: 14 }
          }}
        >
          <SecurityIcon sx={{ 
            fontSize: { xs: 40, sm: 50, md: 60 }, 
            mb: { xs: 1, sm: 2 } 
          }} />
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
            }}
          >
            🔐 Vérification d'identité KYC
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.9, 
              maxWidth: 600, 
              mx: 'auto',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              px: { xs: 1, sm: 2 }
            }}
          >
            Pour votre sécurité et conformité réglementaire, nous devons vérifier votre identité
          </Typography>
        </Paper>
      </Box>

      {/* Cartes d'information */}
      <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} sx={{ mb: { xs: 8, sm: 12, md: 16 } }}>
        <Grid item xs={12} md={6}>
                     <Card elevation={0} sx={{ 
             borderRadius: { xs: 2, sm: 3 }, 
             height: '100%',
             mb: { xs: 4, sm: 0 }
           }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                📋 Documents acceptés
              </Typography>
              <Box component="ul" sx={{ pl: 0, mt: 2 }}>
                <Box component="li" sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mb: 1,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' }
                }}>
                  <Chip 
                    label="Carte d'identité nationale tunisienne" 
                    size="small" 
                    color="primary"
                    sx={{ mb: { xs: 1, sm: 0 } }}
                  />
                  <Typography variant="body2" color="text.secondary">(recto + verso)</Typography>
                </Box>
                <Box component="li" sx={{ 
                  display: 'flex', 
                  gap: 1,
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' }
                }}>
                  <Chip 
                    label="Passeport tunisien" 
                    size="small" 
                    color="secondary"
                    sx={{ mb: { xs: 1, sm: 0 } }}
                  />
                  <Typography variant="body2" color="text.secondary">(recto uniquement)</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ 
            borderRadius: { xs: 2, sm: 3 }, 
            height: '100%' 
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' }
                }}
              >
                ⚠️ Exigences
              </Typography>
              <Box component="ul" sx={{ pl: 0, mt: 2 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">• Images claires et lisibles</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">• Format : JPEG, PNG ou WebP</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">• Taille maximale : 5MB par fichier</Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body2" color="text.secondary">• Documents non expirés</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Formulaire */}
      <Card elevation={0} sx={{ 
        borderRadius: { xs: 2, sm: 3 }, 
        mb: { xs: 6, sm: 8 } 
      }}>
        <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              mb: { xs: 4, sm: 6 }, 
              textAlign: 'center',
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            📝 Formulaire de vérification
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type de document *</InputLabel>
                  <Select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as 'CARTE_IDENTITE' | 'PASSEPORT')}
                    required
                  >
                    <MenuItem value="CARTE_IDENTITE">Carte d'identité nationale</MenuItem>
                    <MenuItem value="PASSEPORT">Passeport</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Document recto *
                  </Typography>
                  <input
                    ref={frontFileRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => handleFileChange('front', e)}
                    required
                    style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Photo du recto de votre document d'identité
                  </Typography>
                </Box>
              </Grid>

              {documentType === 'CARTE_IDENTITE' && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Document verso *
                    </Typography>
                    <input
                      ref={backFileRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => handleFileChange('back', e)}
                      required
                      style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px' }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Photo du verso de votre carte d'identité
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
                {error}
              </Alert>
            )}

            {isUploading && (
              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Envoi en cours... {uploadProgress}%
                </Typography>
                <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            )}

            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 3 }, 
              justifyContent: 'center', 
              mt: { xs: 6, sm: 8 }, 
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Button
                variant="outlined"
                onClick={resetForm}
                disabled={isUploading}
                sx={{ 
                  minWidth: { xs: '100%', sm: 160 },
                  mb: { xs: 1, sm: 0 }
                }}
              >
                Réinitialiser
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isUploading}
                startIcon={<UploadIcon />}
                sx={{ 
                  minWidth: { xs: '100%', sm: 160 },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  }
                }}
              >
                {isUploading ? 'Envoi en cours...' : 'Envoyer pour vérification'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Footer informatif */}
      <Card elevation={0} sx={{ 
        borderRadius: { xs: 2, sm: 3 },
        mt: { xs: 6, sm: 8 }
      }}>
        <CardContent sx={{ 
          p: { xs: 4, sm: 6 }, 
          textAlign: 'center' 
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            paragraph
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              px: { xs: 1, sm: 0 }
            }}
          >
            <strong>🔒 Sécurité :</strong> Vos documents sont chiffrés et stockés de manière sécurisée. 
            Cette vérification est obligatoire pour l'ouverture de cagnottes et les paiements.
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              px: { xs: 1, sm: 0 }
            }}
          >
            <strong>📞 Support :</strong> En cas de problème, contactez notre équipe support.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}; 