import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  LinearProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
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
  donorsCount: number;
}

const CampaignsList: React.FC = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    'Toutes',
    'Santé',
    'Éducation',
    'Urgences',
    'Entreprises',
    'Animaux',
    'Autre'
  ];

  // Données simulées pour la démo
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: '1',
        title: 'Aide médicale pour Marie',
        description: 'Marie a besoin d\'une opération urgente pour soigner son cœur.',
        category: 'Santé',
        goalAmount: 15000,
        currentAmount: 8750,
        endDate: '2024-12-31',
        imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
        creator: { name: 'Sophie Martin' },
        donorsCount: 45
      },
      {
        id: '2',
        title: 'École pour les enfants du village',
        description: 'Construction d\'une école primaire dans un village reculé.',
        category: 'Éducation',
        goalAmount: 25000,
        currentAmount: 18200,
        endDate: '2024-11-15',
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
        creator: { name: 'Association Éducation Plus' },
        donorsCount: 123
      },
      {
        id: '3',
        title: 'Sauvetage des chiens abandonnés',
        description: 'Aide pour nourrir et soigner les chiens abandonnés du refuge.',
        category: 'Animaux',
        goalAmount: 5000,
        currentAmount: 3200,
        endDate: '2024-10-20',
        imageUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400',
        creator: { name: 'Refuge des Amis' },
        donorsCount: 67
      },
      {
        id: '4',
        title: 'Urgence : Famille sinistrée',
        description: 'Aide d\'urgence pour une famille qui a tout perdu dans un incendie.',
        category: 'Urgences',
        goalAmount: 8000,
        currentAmount: 6500,
        endDate: '2024-09-30',
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
        creator: { name: 'Croix-Rouge' },
        donorsCount: 89
      },
      {
        id: '5',
        title: 'Startup éco-responsable',
        description: 'Développement d\'une solution innovante pour réduire les déchets plastiques.',
        category: 'Entreprises',
        goalAmount: 35000,
        currentAmount: 28400,
        endDate: '2024-12-01',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        creator: { name: 'GreenTech Solutions' },
        donorsCount: 156
      },
      {
        id: '6',
        title: 'Festival de musique local',
        description: 'Organisation d\'un festival de musique pour promouvoir les artistes locaux.',
        category: 'Autre',
        goalAmount: 12000,
        currentAmount: 7800,
        endDate: '2024-11-10',
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        creator: { name: 'Association Culture Plus' },
        donorsCount: 34
      }
    ];

    setTimeout(() => {
      setCampaigns(mockCampaigns);
      setFilteredCampaigns(mockCampaigns);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrer les cagnottes
  useEffect(() => {
    let filtered = campaigns;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.creator.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory && selectedCategory !== 'Toutes') {
      filtered = filtered.filter(campaign => campaign.category === selectedCategory);
    }

    setFilteredCampaigns(filtered);
  }, [campaigns, searchTerm, selectedCategory]);

  const handleCampaignClick = (campaignId: string) => {
    navigate(`/campaigns/${campaignId}`);
  };

  const handleCreateCampaign = () => {
    navigate('/campaigns/create');
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* En-tête */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Cagnottes en cours
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Découvrez et soutenez des causes qui vous tiennent à cœur
          </Typography>

          {/* Filtres */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Rechercher une cagnotte..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Catégorie"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleCreateCampaign}
                sx={{
                  bgcolor: '#00b289',
                  '&:hover': { bgcolor: '#008f73' },
                  height: 56
                }}
              >
                Créer
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Liste des cagnottes */}
        {filteredCampaigns.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Aucune cagnotte trouvée
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Essayez de modifier vos critères de recherche
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredCampaigns.map((campaign) => {
              const progress = (campaign.currentAmount / campaign.goalAmount) * 100;
              const daysLeft = Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Grid item xs={12} sm={6} md={4} key={campaign.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => handleCampaignClick(campaign.id)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={campaign.imageUrl}
                      alt={campaign.title}
                    />
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          label={campaign.category} 
                          size="small" 
                          color="primary" 
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="h6" gutterBottom>
                          {campaign.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {campaign.description.length > 100 
                            ? `${campaign.description.substring(0, 100)}...` 
                            : campaign.description
                          }
                        </Typography>
                      </Box>

                      {/* Progression */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            {campaign.currentAmount.toLocaleString()} €
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {progress.toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(progress, 100)} 
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Objectif : {campaign.goalAmount.toLocaleString()} €
                        </Typography>
                      </Box>

                      {/* Statistiques */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PeopleIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {campaign.donorsCount} donateurs
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {daysLeft} jours
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        startIcon={<EuroIcon />}
                        sx={{
                          mt: 2,
                          bgcolor: '#00b289',
                          '&:hover': { bgcolor: '#008f73' }
                        }}
                      >
                        Faire un don
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default CampaignsList; 