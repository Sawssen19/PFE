import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface CagnotteData {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  status: string;
  coverImage?: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  category: {
    id: string;
    name: string;
    description?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const CagnotteView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cagnotte, setCagnotte] = useState<CagnotteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCagnotte(id);
    }
  }, [id]);

  const loadCagnotte = async (cagnotteId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cagnottes/${cagnotteId}`);
      
      if (!response.ok) {
        throw new Error('Cagnotte non trouvée');
      }

      const result = await response.json();
      setCagnotte(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      case 'DRAFT': return 'default';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !cagnotte) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Cagnotte non trouvée'}
        </Alert>
        <Button onClick={() => navigate('/admin')} variant="contained">
          Retour au dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* En-tête */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          📋 Détails de la cagnotte
        </Typography>
        <Button onClick={() => navigate('/admin')} variant="outlined">
          ← Retour au dashboard
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Image et informations principales */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            {cagnotte.coverImage ? (
              <img 
                src={cagnotte.coverImage} 
                alt={cagnotte.title}
                style={{ 
                  width: '100%', 
                  height: 200, 
                  objectFit: 'cover', 
                  borderRadius: 8,
                  marginBottom: 16
                }}
              />
            ) : (
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 200, 
                  bgcolor: '#e2e8f0', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <Typography variant="h2">🎯</Typography>
              </Box>
            )}
            
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {cagnotte.title}
            </Typography>
            
            <Chip 
              label={cagnotte.status} 
              color={getStatusColor(cagnotte.status) as any}
              sx={{ mb: 2 }}
            />
            
            <Chip 
              label={cagnotte.category.name} 
              variant="outlined"
              sx={{ ml: 1, mb: 2 }}
            />
          </Paper>
        </Grid>

        {/* Détails financiers */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              💰 Objectifs financiers
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: '#f8fafc' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Objectif
                    </Typography>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                      {formatCurrency(cagnotte.goalAmount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card sx={{ bgcolor: '#f0fdf4' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Collecté
                    </Typography>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                      {formatCurrency(cagnotte.currentAmount)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Progression
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1, bgcolor: '#e2e8f0', borderRadius: 1, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: `${getProgressPercentage(cagnotte.currentAmount, cagnotte.goalAmount)}%`,
                      height: 12,
                      bgcolor: '#10b981',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 60 }}>
                  {getProgressPercentage(cagnotte.currentAmount, cagnotte.goalAmount).toFixed(0)}%
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              📝 Description
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {cagnotte.description}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              👤 Créateur
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 48, height: 48 }}>
                {cagnotte.creator.profilePicture ? (
                  <img 
                    src={cagnotte.creator.profilePicture} 
                    alt="Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  `${cagnotte.creator.firstName.charAt(0)}${cagnotte.creator.lastName.charAt(0)}`
                )}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {cagnotte.creator.firstName} {cagnotte.creator.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cagnotte.creator.email}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date de création
                </Typography>
                <Typography variant="body2">
                  {formatDate(cagnotte.createdAt)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Dernière mise à jour
                </Typography>
                <Typography variant="body2">
                  {formatDate(cagnotte.updatedAt)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date de début
                </Typography>
                <Typography variant="body2">
                  {formatDate(cagnotte.startDate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date de fin
                </Typography>
                <Typography variant="body2">
                  {formatDate(cagnotte.endDate)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CagnotteView;