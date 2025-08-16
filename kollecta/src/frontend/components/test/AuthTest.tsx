import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Divider,
  Grid,
} from '@mui/material';
import { login, logout } from '../../store/slices/authSlice';
import { selectUser, selectIsAuthenticated, selectToken } from '../../store/slices/authSlice';
import AuthDebug from '../debug/AuthDebug';

const AuthTest = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);

  const [loginData, setLoginData] = useState({
    email: 'test@example.com',
    password: 'password123',
  });

  const handleLogin = async () => {
    try {
      await dispatch(login(loginData) as any);
      console.log('Connexion réussie');
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    console.log('Déconnexion effectuée');
  };

  const handleClearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        🧪 Test d'Authentification
      </Typography>

      {/* Composant de débogage */}
      <AuthDebug />

      <Grid container spacing={3}>
        {/* Test de connexion */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🔐 Test de Connexion
            </Typography>
            
            <TextField
              fullWidth
              label="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              margin="normal"
            />

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleLogin}>
                Se connecter
              </Button>
              <Button variant="outlined" onClick={handleLogout}>
                Se déconnecter
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Actions de test */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🛠️ Actions de Test
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleClearStorage}
                color="warning"
              >
                Vider le localStorage
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={() => window.location.reload()}
              >
                Recharger la page
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" color="text.secondary">
              <strong>Instructions:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              1. Entrez vos identifiants de connexion
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              2. Cliquez sur "Se connecter"
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              3. Vérifiez l'état dans le composant de débogage
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* État actuel */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          📊 État Actuel
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Alert severity={isAuthenticated ? "success" : "error"}>
              Authentification: {isAuthenticated ? "Connecté" : "Non connecté"}
            </Alert>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Alert severity={user ? "success" : "warning"}>
              Utilisateur: {user ? "Présent" : "Absent"}
            </Alert>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Alert severity={token ? "success" : "warning"}>
              Token: {token ? "Présent" : "Absent"}
            </Alert>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AuthTest; 