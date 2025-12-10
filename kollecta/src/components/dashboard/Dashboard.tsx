import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../store/slices/authSlice';
import Navbar from '../layout/Navbar';
import CagnotteDraftCard from './CagnotteDraftCard';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  color: string;
}> = ({ title, value, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ 
          bgcolor: color,
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mr: 2
        }} />
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [showDraftCard, setShowDraftCard] = useState(true);

  // Ces données seront remplacées par des données réelles plus tard
  const stats = {
    totalCagnottes: 0,
    totalPromesses: 0,
    totalParticipants: 0,
  };

  // Vérifier s'il y a un brouillon de cagnotte
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    checkForDraft();
  }, []);

  const checkForDraft = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cagnottes/user/my-cagnottes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const cagnottes = result.data?.cagnottes || [];
        const draftExists = cagnottes.some((c: any) => c.status === 'DRAFT');
        setHasDraft(draftExists);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des brouillons:', error);
    }
  };

  const handleResumeDraft = (draftId: string) => {
    // Sauvegarder l'ID du brouillon pour le wizard
    localStorage.setItem('cagnotte_draft_id', draftId);
    navigate('/cagnottes/new');
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      // Supprimer le brouillon de la base de données
      await fetch(`http://localhost:5000/api/cagnottes/${draftId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Nettoyer le localStorage
      localStorage.removeItem('cagnotte_draft_data');
      localStorage.removeItem('cagnotte_current_step');
      localStorage.removeItem('cagnotte_draft_id');
      setShowDraftCard(false);
    } catch (error) {
      console.error('Erreur lors de la suppression du brouillon:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tableau de bord
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Bienvenue, {user?.firstName} {user?.lastName} !
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Cagnottes actives"
              value={stats.totalCagnottes}
              color="#00A651"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Promesses de dons"
              value={stats.totalPromesses}
              color="#2196F3"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Participants"
              value={stats.totalParticipants}
              color="#FF9800"
            />
          </Grid>
        </Grid>

        {/* Affichage du brouillon de cagnotte s'il existe */}
        {showDraftCard && hasDraft && (
          <Box sx={{ mb: 4 }}>
            <CagnotteDraftCard 
              onResume={handleResumeDraft}
              onDelete={handleDeleteDraft}
            />
          </Box>
        )}

        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Actions rapides
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="contained"
                fullWidth
                sx={{ 
                  bgcolor: '#00A651',
                  '&:hover': { bgcolor: '#008C44' },
                  height: '48px'
                }}
                onClick={() => navigate('/create/fundraiser?new=true')}
              >
                Créer une cagnotte
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ 
                  borderColor: '#00A651',
                  color: '#00A651',
                  '&:hover': { borderColor: '#008C44', color: '#008C44' },
                  height: '48px'
                }}
                onClick={() => navigate('/cagnottes')}
              >
                Voir mes cagnottes
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ 
                  borderColor: '#00A651',
                  color: '#00A651',
                  '&:hover': { borderColor: '#008C44', color: '#008C44' },
                  height: '48px'
                }}
                onClick={() => navigate('/promises')}
              >
                Gérer mes promesses
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ 
                  borderColor: '#00A651',
                  color: '#00A651',
                  '&:hover': { borderColor: '#008C44', color: '#008C44' },
                  height: '48px'
                }}
                onClick={() => navigate('/profile')}
              >
                Mon profil
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Activité récente
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Aucune activité récente à afficher.
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default Dashboard;