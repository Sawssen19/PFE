import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Button, 
  TextField, 
  Grid,
  Alert,
  Divider
} from '@mui/material';
import DefaultAvatar from '../common/DefaultAvatar';

const ProfileLogicTest: React.FC = () => {
  const [testUser, setTestUser] = useState({
    firstName: 'Test',
    lastName: 'User',
    profilePicture: null as string | null
  });
  
  const [testCases, setTestCases] = useState([
    { name: 'Nouvel utilisateur', profilePicture: null, expected: 'Avatar par défaut' },
    { name: 'Utilisateur avec photo', profilePicture: '/uploads/profile-123.jpg', expected: 'Photo personnalisée' },
    { name: 'Photo par défaut système', profilePicture: '/uploads/default-avatar.png', expected: 'Avatar par défaut' },
    { name: 'Photo placeholder', profilePicture: '/uploads/placeholder.jpg', expected: 'Avatar par défaut' },
  ]);

  const shouldShowDefaultAvatar = (profilePicture: string | null) => {
    if (!profilePicture) {
      return true;
    }
    
    if (profilePicture.includes('default-avatar') || 
        profilePicture.includes('placeholder')) {
      return true;
    }
    
    return false;
  };

  const updateTestUser = (field: string, value: string) => {
    setTestUser(prev => ({
      ...prev,
      [field]: value === '' ? null : value
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 12, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Test de la Logique des Photos de Profil
      </Typography>
      
      <Grid container spacing={4}>
        {/* Test utilisateur dynamique */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Test Utilisateur Dynamique
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Prénom"
                value={testUser.firstName}
                onChange={(e) => updateTestUser('firstName', e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Nom"
                value={testUser.lastName}
                onChange={(e) => updateTestUser('lastName', e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="URL Photo de profil (laissez vide pour null)"
                value={testUser.profilePicture || ''}
                onChange={(e) => updateTestUser('profilePicture', e.target.value)}
                placeholder="Ex: /uploads/profile-123.jpg"
              />
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Résultat de la logique :
              </Typography>
              <Typography 
                variant="h6" 
                color={shouldShowDefaultAvatar(testUser.profilePicture) ? 'success.main' : 'info.main'}
                sx={{ fontWeight: 600 }}
              >
                {shouldShowDefaultAvatar(testUser.profilePicture) ? 'Avatar par défaut' : 'Photo personnalisée'}
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              {shouldShowDefaultAvatar(testUser.profilePicture) ? (
                <DefaultAvatar 
                  size={120} 
                  firstName={testUser.firstName} 
                  lastName={testUser.lastName} 
                />
              ) : (
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: 'grey.300',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    border: '4px solid #00b289'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Photo: {testUser.profilePicture}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Cas de test prédéfinis */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Cas de Test Prédéfinis
            </Typography>
            
            {testCases.map((testCase, index) => (
              <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  {testCase.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Photo: {testCase.profilePicture || 'null'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Attendu: {testCase.expected}
                </Typography>
                
                <Box sx={{ textAlign: 'center' }}>
                  {shouldShowDefaultAvatar(testCase.profilePicture) ? (
                    <DefaultAvatar size={80} firstName="Test" lastName="User" />
                  ) : (
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: 'grey.300',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        fontSize: '0.75rem'
                      }}
                    >
                      Photo
                    </Box>
                  )}
                </Box>
                
                <Alert 
                  severity={shouldShowDefaultAvatar(testCase.profilePicture) ? 'success' : 'info'}
                  sx={{ mt: 2 }}
                >
                  {shouldShowDefaultAvatar(testCase.profilePicture) ? '✅ Avatar par défaut affiché' : '📸 Photo personnalisée affichée'}
                </Alert>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Explication de la logique */}
      <Paper elevation={2} sx={{ p: 4, mt: 4, borderRadius: 3, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          Explication de la Logique
        </Typography>
        <Typography variant="body2" paragraph>
          La fonction <code>shouldShowDefaultAvatar()</code> détermine quand afficher l'avatar par défaut :
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li>Si <code>profilePicture</code> est <code>null</code> ou <code>undefined</code></li>
          <li>Si <code>profilePicture</code> contient "default-avatar" ou "placeholder"</li>
          <li>Dans tous les autres cas, la photo personnalisée est affichée</li>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Cette logique garantit qu'un nouvel utilisateur n'affiche jamais une ancienne photo de profil.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ProfileLogicTest; 