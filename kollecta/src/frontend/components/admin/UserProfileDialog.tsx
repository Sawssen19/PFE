import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Paper,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { User } from '../../services/admin/adminService';

interface UserProfileDialogProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  open,
  user,
  onClose,
}) => {
  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'MODERATOR':
        return 'warning';
      case 'SUPPORT':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'SUSPENDED':
        return 'error';
      case 'BLOCKED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Profil de l'utilisateur</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* En-tête avec photo de profil */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                src={user.profilePicture}
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
              >
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                <Chip
                  label={user.role}
                  color={getRoleColor(user.role) as any}
                  variant="outlined"
                />
                <Chip
                  label={user.status}
                  color={getStatusColor(user.status) as any}
                />
                <Chip
                  label={user.isVerified ? 'Vérifié' : 'Non vérifié'}
                  color={user.isVerified ? 'success' : 'warning'}
                  variant="outlined"
                />
              </Box>
            </Paper>
          </Grid>

          {/* Informations détaillées */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon />
                Informations personnelles
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Prénom
                </Typography>
                <Typography variant="body1">
                  {user.firstName}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Nom
                </Typography>
                <Typography variant="body1">
                  {user.lastName}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon fontSize="small" />
                  {user.email}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Langue
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LanguageIcon fontSize="small" />
                  {user.language || 'Non spécifiée'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon />
                Informations système
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ID utilisateur
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {user.id}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Date de création
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon fontSize="small" />
                  {formatDate(user.createdAt)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Dernière modification
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarIcon fontSize="small" />
                  {formatDate(user.updatedAt)}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Statut du compte
                </Typography>
                <Typography variant="body1">
                  {user.isActive ? 'Actif' : 'Inactif'}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Profil public */}
          {user.profileDescription || user.profileUrl || user.profileVisibility ? (
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PublicIcon />
                  Profil public
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {user.profileDescription && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon fontSize="small" />
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {user.profileDescription}
                    </Typography>
                  </Box>
                )}
                
                {user.profileUrl && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      URL du profil
                    </Typography>
                    <Typography variant="body1" component="a" href={user.profileUrl} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                      {user.profileUrl}
                    </Typography>
                  </Box>
                )}
                
                {user.profileVisibility && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Visibilité
                    </Typography>
                    <Chip
                      label={user.profileVisibility}
                      color={user.profileVisibility === 'public' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                )}
              </Paper>
            </Grid>
          ) : null}
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserProfileDialog; 