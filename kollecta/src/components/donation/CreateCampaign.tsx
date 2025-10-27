import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    goalAmount: '',
    endDate: '',
    imageUrl: '',
  });

  const categories = [
    'Santé',
    'Éducation',
    'Urgences',
    'Entreprises',
    'Animaux',
    'Autre'
  ];

  // Vérifier s'il y a un brouillon à reprendre
  useEffect(() => {
    const draftIdFromUrl = new URLSearchParams(location.search).get('draftId');
    if (draftIdFromUrl) {
      loadDraft(draftIdFromUrl);
    }
  }, [location.search]);

  // Sauvegarde automatique
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Sauvegarder automatiquement après 2 secondes d'inactivité
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (formData.title || formData.description) {
        saveDraft();
      }
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData]);

  // Sauvegarder avant de quitter la page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (formData.title || formData.description) {
        // Sauvegarde synchrone avant de quitter
        const draftData = {
          title: formData.title || 'Brouillon sans titre',
          description: formData.description || '',
          targetAmount: parseFloat(formData.goalAmount) || 0,
          endDate: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          category: formData.category || 'Autre',
          coverImage: formData.imageUrl || ''
        };
        
        // Utiliser fetch avec keepalive pour la sauvegarde avant fermeture
        fetch('/api/cagnottes/draft', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(draftData),
          keepalive: true
        }).catch(() => {
          // Ignorer les erreurs de réseau lors de la fermeture
        });
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData]);

  const saveDraft = async () => {
    try {
      // Si on a déjà un brouillon, le mettre à jour
      if (draftId) {
        const response = await fetch(`/api/cagnottes/${draftId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: formData.title || 'Brouillon sans titre',
            description: formData.description || '',
            targetAmount: parseFloat(formData.goalAmount) || 0,
            endDate: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            category: formData.category || 'Autre',
            coverImage: formData.imageUrl || ''
          })
        });

        if (response.ok) {
          console.log('💾 Brouillon mis à jour automatiquement');
        }
      } else {
        // Créer un nouveau brouillon
        const response = await fetch('/api/cagnottes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: formData.title || 'Brouillon sans titre',
            description: formData.description || '',
            targetAmount: parseFloat(formData.goalAmount) || 0,
            endDate: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            category: formData.category || 'Autre',
            coverImage: formData.imageUrl || ''
          })
        });

        if (response.ok) {
          const result = await response.json();
          setDraftId(result.data.id);
          setIsDraft(true);
          console.log('💾 Nouveau brouillon créé automatiquement');
        }
      }
    } catch (error) {
      console.error('Erreur sauvegarde brouillon:', error);
    }
  };

  const loadDraft = async (draftId: string) => {
    try {
      console.log('🔄 Chargement du brouillon:', draftId);
      const response = await fetch(`/api/cagnottes/${draftId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('📡 Réponse du serveur:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('📦 Données reçues:', result);
        const cagnotte = result.data;
        
        setFormData({
          title: cagnotte.title || '',
          description: cagnotte.description || '',
          category: cagnotte.category?.name || '',
          goalAmount: cagnotte.goalAmount?.toString() || '',
          endDate: cagnotte.endDate ? new Date(cagnotte.endDate).toISOString().split('T')[0] : '',
          imageUrl: cagnotte.coverImage || '',
        });
        
        setDraftId(draftId);
        setIsDraft(true);
        setCurrentStep(1);
        
        setNotification({
          open: true,
          message: 'Brouillon chargé ! Vous pouvez continuer votre création.',
          severity: 'info',
        });
      } else {
        console.error('❌ Erreur de chargement:', response.status, response.statusText);
        setNotification({
          open: true,
          message: 'Erreur lors du chargement du brouillon',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('❌ Erreur chargement brouillon:', error);
      setNotification({
        open: true,
        message: 'Erreur lors du chargement du brouillon',
        severity: 'error',
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (event: any) => {
    setFormData(prev => ({
      ...prev,
      category: event.target.value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      let cagnotteId = draftId;

      // Si on n'a pas de brouillon, créer la cagnotte directement en PENDING
      if (!draftId) {
        const createResponse = await fetch('/api/cagnottes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            targetAmount: parseFloat(formData.goalAmount),
            endDate: formData.endDate,
            category: formData.category,
            coverImage: formData.imageUrl,
            status: 'PENDING' // Créer directement en PENDING
          })
        });

        if (!createResponse.ok) {
          throw new Error('Erreur lors de la création de la cagnotte');
        }

        const result = await createResponse.json();
        cagnotteId = result.data.id;
      } else {
        // Si on a un brouillon, le soumettre pour validation
        const submitResponse = await fetch(`/api/cagnottes/${draftId}/submit`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!submitResponse.ok) {
          throw new Error('Erreur lors de la soumission de la cagnotte');
        }
      }
      
      setNotification({
        open: true,
        message: 'Cagnotte lancée avec succès ! Elle est maintenant en attente de validation admin.',
        severity: 'success',
      });

      // Rediriger vers la page de gestion des cagnottes
      setTimeout(() => {
        navigate('/my-cagnottes');
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur lors du lancement:', error);
      setNotification({
        open: true,
        message: 'Erreur lors du lancement de la cagnotte',
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
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3, color: '#666666' }}
        >
          RETOUR
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            {isDraft ? 'Terminer votre cagnotte' : 'Démarrer une cagnotte'}
          </Typography>
          {isDraft && (
            <Chip 
              label="Brouillon" 
              color="warning" 
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </Box>
        
        {isDraft && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Vous reprenez votre brouillon. Vos modifications sont sauvegardées automatiquement.
          </Alert>
        )}

        <Paper elevation={0} sx={{ p: 4, bgcolor: '#f8f9fa' }}>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Titre */}
            <TextField
              fullWidth
              name="title"
              label="Titre de votre cagnotte"
              value={formData.title}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 3 }}
              required
            />

            {/* Description */}
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              variant="outlined"
              multiline
              rows={4}
              sx={{ mb: 3 }}
              required
            />

            {/* Catégorie */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={formData.category}
                label="Catégorie"
                onChange={handleSelectChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Objectif */}
            <TextField
              fullWidth
              name="goalAmount"
              label="Objectif de collecte"
              value={formData.goalAmount}
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
              sx={{ mb: 3 }}
              required
            />

            {/* Date de fin */}
            <TextField
              fullWidth
              name="endDate"
              label="Date de fin"
              value={formData.endDate}
              onChange={handleInputChange}
              variant="outlined"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 3 }}
              required
            />

            {/* Image URL */}
            <TextField
              fullWidth
              name="imageUrl"
              label="URL de l'image (optionnel)"
              value={formData.imageUrl}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ mb: 4 }}
            />

            {/* Bouton Lancer */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                bgcolor: '#00b289',
                '&:hover': { bgcolor: '#008f73' },
                height: 48
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isDraft ? 'Lancer la cagnotte' : 'Créer et lancer la cagnotte'
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateCampaign; 