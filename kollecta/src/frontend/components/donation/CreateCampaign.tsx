import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const CreateCampaign: React.FC = () => {
  const navigate = useNavigate();
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
      // TODO: Implémenter l'API pour créer une cagnotte
      console.log('📝 Création de cagnotte:', formData);
      
      // Simulation d'une création réussie
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setNotification({
        open: true,
        message: 'Cagnotte créée avec succès !',
        severity: 'success',
      });

      // Rediriger vers la page de la cagnotte
      setTimeout(() => {
        navigate('/campaigns/1'); // ID simulé
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur lors de la création:', error);
      setNotification({
        open: true,
        message: 'Erreur lors de la création de la cagnotte',
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

        <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
          Démarrer une cagnotte
        </Typography>

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

            {/* Bouton Créer */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                bgcolor: '#02a95c',
                '&:hover': { bgcolor: '#02884a' },
                height: 48
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Créer la cagnotte'
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