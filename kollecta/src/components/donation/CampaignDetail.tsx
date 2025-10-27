import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  Grid,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Euro as EuroIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  currentAmount: number;
  endDate: string;
  imageUrl?: string;
  creator: {
    name: string;
    avatar?: string;
  };
  donors: Array<{
    name: string;
    amount: number;
    date: string;
    message?: string;
  }>;
}

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donationDialog, setDonationDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Données simulées pour la démo
  useEffect(() => {
    const mockCampaign: Campaign = {
      id: id || '1',
      title: 'Aide médicale pour Marie',
      description: 'Marie a besoin d\'une opération urgente pour soigner son cœur. Cette jeune femme de 28 ans est maman de deux enfants et a besoin de notre soutien pour financer cette intervention vitale.',
      category: 'Santé',
      goalAmount: 15000,
      currentAmount: 8750,
      endDate: '2024-12-31',
      imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
      creator: {
        name: 'Sophie Martin',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100'
      },
      donors: [
        { name: 'Jean D.', amount: 500, date: '2024-08-01', message: 'Courage Marie !' },
        { name: 'Marie L.', amount: 200, date: '2024-08-02' },
        { name: 'Pierre M.', amount: 1000, date: '2024-08-03', message: 'Toute ma famille pense à vous' },
        { name: 'Anonyme', amount: 150, date: '2024-08-04' },
      ]
    };

    setTimeout(() => {
      setCampaign(mockCampaign);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const progress = campaign ? (campaign.currentAmount / campaign.goalAmount) * 100 : 0;
  const daysLeft = campaign ? Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  const handleDonate = () => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
      // Rediriger vers la page de connexion avec un message
      navigate('/login?message=connectez-vous pour faire un don');
      return;
    }
    setDonationDialog(true);
  };

  const handleDonationSubmit = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setNotification({
        open: true,
        message: 'Veuillez entrer un montant valide',
        severity: 'error',
      });
      return;
    }

    setIsDonating(true);

    try {
      // TODO: Implémenter l'API de donation
      console.log('💝 Donation:', { amount: donationAmount, message: donationMessage });
      
      // Simulation d'une donation réussie
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mettre à jour les données locales
      if (campaign) {
        setCampaign({
          ...campaign,
          currentAmount: campaign.currentAmount + parseFloat(donationAmount),
          donors: [
            {
              name: 'Vous',
              amount: parseFloat(donationAmount),
              date: new Date().toISOString().split('T')[0],
              message: donationMessage || undefined,
            },
            ...campaign.donors,
          ]
        });
      }

      setNotification({
        open: true,
        message: 'Merci pour votre donation !',
        severity: 'success',
      });

      setDonationDialog(false);
      setDonationAmount('');
      setDonationMessage('');

    } catch (error) {
      console.error('❌ Erreur lors de la donation:', error);
      setNotification({
        open: true,
        message: 'Erreur lors de la donation',
        severity: 'error',
      });
    } finally {
      setIsDonating(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h5">Cagnotte non trouvée</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Image de la cagnotte */}
        <Box
          sx={{
            height: 300,
            backgroundImage: `url(${campaign.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: 2,
            mb: 3,
            position: 'relative',
          }}
        />

        {/* Informations principales */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              {campaign.title}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={campaign.category} 
                color="primary" 
                sx={{ mr: 1 }}
              />
              <Chip 
                label={`${daysLeft} jours restants`}
                variant="outlined"
                icon={<CalendarIcon />}
                sx={{ mr: 1 }}
              />
              <Chip 
                label={`Fin: ${new Date(campaign.endDate).toLocaleDateString('fr-FR')}`}
                variant="outlined"
                color="info"
              />
            </Box>

            <Typography variant="body1" paragraph>
              {campaign.description}
            </Typography>

            {/* Créateur */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar src={campaign.creator.avatar} sx={{ mr: 2 }}>
                {campaign.creator.name[0]}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Créé par {campaign.creator.name}
              </Typography>
            </Box>

            {/* Dernières donations */}
            <Typography variant="h6" gutterBottom>
              Dernières donations
            </Typography>
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {campaign.donors.map((donor, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" fontWeight="bold">
                      {donor.name}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {donor.amount} €
                    </Typography>
                  </Box>
                  {donor.message && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      "{donor.message}"
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {donor.date}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
              {/* Progression */}
              <Typography variant="h6" gutterBottom>
                Progression
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {campaign.currentAmount.toLocaleString()} €
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  sur {campaign.goalAmount.toLocaleString()} €
                </Typography>
              </Box>

              <LinearProgress 
                variant="determinate" 
                value={Math.min(progress, 100)} 
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {progress.toFixed(1)}% atteint
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {campaign.donors.length} donateurs
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleDonate}
                startIcon={<EuroIcon />}
                sx={{
                  bgcolor: '#00b289',
                  '&:hover': { bgcolor: '#008f73' },
                  mb: 2
                }}
              >
                Faire un don
              </Button>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<FavoriteIcon />}
                >
                  Soutenir
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ShareIcon />}
                >
                  Partager
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Dialog de donation */}
      <Dialog open={donationDialog} onClose={() => setDonationDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Faire un don</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Votre don aidera {campaign.creator.name} à atteindre son objectif.
          </Typography>
          
          <TextField
            fullWidth
            label="Montant (€)"
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Message (optionnel)"
            multiline
            rows={3}
            value={donationMessage}
            onChange={(e) => setDonationMessage(e.target.value)}
            placeholder="Laissez un message d'encouragement..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDonationDialog(false)}>
            Annuler
          </Button>
          <Button
            onClick={handleDonationSubmit}
            variant="contained"
            disabled={isDonating}
            sx={{ bgcolor: '#00b289', '&:hover': { bgcolor: '#008f73' } }}
          >
            {isDonating ? <CircularProgress size={20} /> : 'Confirmer le don'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default CampaignDetail; 