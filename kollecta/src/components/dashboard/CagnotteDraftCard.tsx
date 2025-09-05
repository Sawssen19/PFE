import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { cagnottesService } from '../../features/cagnottes/cagnottesService';
import './CagnotteDraftCard.css';

interface CagnotteDraftCardProps {
  onResume: (draftId: string) => void;
  onDelete: (draftId: string) => void;
}

interface DraftCagnotte {
  id: string;
  title: string;
  description: string;
  goalAmount: number;
  category: { name: string };
  currentStep: number;
  createdAt: string;
}

const CagnotteDraftCard: React.FC<CagnotteDraftCardProps> = ({ onResume, onDelete }) => {
  const navigate = useNavigate();
  const [draftCagnotte, setDraftCagnotte] = useState<DraftCagnotte | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDraftCagnotte();
  }, []);

  const loadDraftCagnotte = async () => {
    try {
      setLoading(true);
      const response = await cagnottesService.getUserCagnottes();
      const cagnottes = (response as any)?.data?.cagnottes || [];
      
      // Trouver la première cagnotte en statut DRAFT
      const draft = cagnottes.find((c: any) => c.status === 'DRAFT');
      
      if (draft) {
        setDraftCagnotte(draft);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du brouillon:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="cagnotte-draft-card">
        <CardContent>
          <Typography>Chargement du brouillon...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!draftCagnotte) {
    return null; // Pas de brouillon à afficher
  }

  const getProgressPercentage = () => {
    return Math.round((draftCagnotte.currentStep / 5) * 100);
  };

  const getStepDescription = () => {
    switch (draftCagnotte.currentStep) {
      case 1: return 'Destination des fonds';
      case 2: return 'Bénéficiaire';
      case 3: return 'Média';
      case 4: return 'Histoire';
      case 5: return 'Révision';
      default: return 'Étape inconnue';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="cagnotte-draft-card">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" component="h3" gutterBottom>
              Brouillon de cagnotte
            </Typography>
            <Chip 
              label={`Étape ${draftCagnotte.currentStep}/5`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatDate(draftCagnotte.createdAt)}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Progression: {getProgressPercentage()}%
          </Typography>
          <Box 
            className="progress-bar"
            sx={{ 
              width: '100%', 
              height: 4, 
              backgroundColor: '#e0e0e0', 
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                width: `${getProgressPercentage()}%`, 
                height: '100%', 
                backgroundColor: '#00a651',
                transition: 'width 0.3s ease'
              }}
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          Dernière étape: {getStepDescription()}
        </Typography>

        {draftCagnotte.title && (
          <Typography variant="body2" mb={1}>
            <strong>Titre:</strong> {draftCagnotte.title}
          </Typography>
        )}

        {draftCagnotte.category?.name && (
          <Typography variant="body2" mb={1}>
            <strong>Catégorie:</strong> {draftCagnotte.category.name}
          </Typography>
        )}

        {draftCagnotte.goalAmount > 0 && (
          <Typography variant="body2" mb={2}>
            <strong>Objectif:</strong> {draftCagnotte.goalAmount} TND
          </Typography>
        )}

        <Box display="flex" gap={1} mt={2}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onResume(draftCagnotte.id)}
            fullWidth
          >
            Reprendre
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => onDelete(draftCagnotte.id)}
          >
            Supprimer
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CagnotteDraftCard;