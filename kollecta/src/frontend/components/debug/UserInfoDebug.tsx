import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { Box, Typography, Paper, Divider } from '@mui/material';

const UserInfoDebug: React.FC = () => {
  const authUser = useSelector(selectUser);
  const profileData = useSelector((state: RootState) => state.profile.data);

  return (
    <Box sx={{ p: 2, maxWidth: 600 }}>
      <Typography variant="h6" gutterBottom>
        🔍 Débogage des États Utilisateur
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" color="primary">
          📱 État Auth (Header/Profile)
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          ID: {authUser?.id || 'null'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Email: {authUser?.email || 'null'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Prénom: {authUser?.firstName || 'null'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Nom: {authUser?.lastName || 'null'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Rôle: {authUser?.role || 'null'}
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" color="secondary">
          🎯 État Profile (Settings)
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          ID: {profileData?.id || 'null'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Prénom: {profileData?.firstName || 'null'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Nom: {profileData?.lastName || 'null'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Téléphone: {profileData?.phone || 'null'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          Description: {profileData?.profileDescription || 'null'}
        </Typography>
      </Paper>

      <Paper sx={{ p: 2, bgcolor: authUser?.firstName === profileData?.firstName ? 'success.light' : 'error.light' }}>
        <Typography variant="h6">
          🔄 Synchronisation
        </Typography>
        <Typography variant="body2">
          Prénom synchronisé: {authUser?.firstName === profileData?.firstName ? '✅ OUI' : '❌ NON'}
        </Typography>
        <Typography variant="body2">
          Nom synchronisé: {authUser?.lastName === profileData?.lastName ? '✅ OUI' : '❌ NON'}
        </Typography>
      </Paper>

      <Divider sx={{ my: 2 }} />
      
      <Typography variant="body2" color="text.secondary">
        💡 Ce composant affiche les informations utilisateur des deux états Redux pour déboguer la synchronisation.
      </Typography>
    </Box>
  );
};

export default UserInfoDebug; 