import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Paper, Typography, Alert } from '@mui/material';
import { selectUser, selectIsAuthenticated, selectToken } from '../../store/slices/authSlice';

const AuthDebug = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);

  return (
    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        🔍 Debug Authentification
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          <strong>État d'authentification:</strong> {isAuthenticated ? '✅ Connecté' : '❌ Non connecté'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          <strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'Aucun'}
        </Typography>
      </Paper>

      {user ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Utilisateur connecté:</strong>
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            ID: {user.id}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            Email: {user.email}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            Prénom: {user.firstName || 'Non défini'}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            Nom: {user.lastName || 'Non défini'}
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            Rôle: {user.role || 'Non défini'}
          </Typography>
        </Alert>
      ) : (
        <Alert severity="warning">
          Aucun utilisateur dans le store
        </Alert>
      )}

      <Paper sx={{ p: 2, bgcolor: '#fff3cd' }}>
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          <strong>LocalStorage:</strong>
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          Token: {localStorage.getItem('token') || 'Aucun'}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
          User: {localStorage.getItem('user') || 'Aucun'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default AuthDebug; 