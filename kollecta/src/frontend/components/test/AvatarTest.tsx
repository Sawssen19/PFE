import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import DefaultAvatar from '../common/DefaultAvatar';

const AvatarTest: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 12, py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Test des Avatars par Défaut
      </Typography>
      
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          Différentes tailles d'avatars par défaut :
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <DefaultAvatar size={60} firstName="Jean" lastName="Dupont" />
            <Typography variant="body2" sx={{ mt: 1 }}>60px - Jean Dupont</Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <DefaultAvatar size={80} firstName="Marie" lastName="Martin" />
            <Typography variant="body2" sx={{ mt: 1 }}>80px - Marie Martin</Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <DefaultAvatar size={120} firstName="Pierre" lastName="Durand" />
            <Typography variant="body2" sx={{ mt: 1 }}>120px - Pierre Durand</Typography>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <DefaultAvatar size={150} firstName="Sophie" lastName="Leroy" />
            <Typography variant="body2" sx={{ mt: 1 }}>150px - Sophie Leroy</Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Avatar avec initiales par défaut :
          </Typography>
          <DefaultAvatar size={100} />
          <Typography variant="body2" sx={{ mt: 1 }}>100px - Initiales par défaut (US)</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AvatarTest; 