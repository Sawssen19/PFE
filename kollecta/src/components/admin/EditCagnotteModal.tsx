import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Chip,
} from '@mui/material';

interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
  category: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  endDate?: string;
  imageUrl?: string;
  reports: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface EditCagnotteModalProps {
  open: boolean;
  onClose: () => void;
  cagnotte: Campaign | null;
  onSave: (updatedData: Partial<Campaign>) => Promise<void>;
}

const EditCagnotteModal: React.FC<EditCagnotteModalProps> = ({
  open,
  onClose,
  cagnotte,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: 0,
    category: '',
    priority: 'MEDIUM',
    endDate: ''
  });

  // Initialiser les données du formulaire quand la cagnotte change
  React.useEffect(() => {
    if (cagnotte) {
      setFormData({
        title: cagnotte.title,
        description: cagnotte.description,
        targetAmount: cagnotte.targetAmount,
        category: cagnotte.category,
        priority: cagnotte.priority,
        endDate: cagnotte.endDate ? new Date(cagnotte.endDate).toISOString().split('T')[0] : ''
      });
    }
  }, [cagnotte]);

  const handleSave = async () => {
    if (!cagnotte) return;
    
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  if (!cagnotte) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        ✏️ Modifier la cagnotte
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Modification de:</strong> {cagnotte.title}<br />
            <strong>Créateur:</strong> {cagnotte.creator.firstName} {cagnotte.creator.lastName}<br />
            <strong>Statut actuel:</strong> <Chip label={cagnotte.status} size="small" />
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de la cagnotte"
                value={formData.title}
                onChange={handleChange('title')}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleChange('description')}
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Objectif (€)"
                type="number"
                value={formData.targetAmount}
                onChange={handleChange('targetAmount')}
                variant="outlined"
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de fin"
                type="date"
                value={formData.endDate}
                onChange={handleChange('endDate')}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Catégorie"
                value={formData.category}
                onChange={handleChange('category')}
                variant="outlined"
                select
                SelectProps={{ native: true }}
              >
                <option value="Santé">Santé</option>
                <option value="Éducation">Éducation</option>
                <option value="Sport">Sport</option>
                <option value="Culture">Culture</option>
                <option value="Environnement">Environnement</option>
                <option value="Solidarité">Solidarité</option>
                <option value="Autre">Autre</option>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Priorité"
                value={formData.priority}
                onChange={handleChange('priority')}
                variant="outlined"
                select
                SelectProps={{ native: true }}
              >
                <option value="LOW">Basse</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="HIGH">Haute</option>
              </TextField>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 3 }}>
            ⚠️ <strong>Attention:</strong> Les modifications apportées à cette cagnotte seront visibles publiquement. 
            Assurez-vous que les informations sont correctes avant de sauvegarder.
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={loading || !formData.title.trim()}
        >
          {loading ? <CircularProgress size={20} /> : 'Sauvegarder'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCagnotteModal;