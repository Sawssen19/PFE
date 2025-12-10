import React from 'react';
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

const MaintenancePage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            padding: 6,
            textAlign: 'center',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
          }}
        >
          <ConstructionIcon
            sx={{
              fontSize: 80,
              color: '#667eea',
              mb: 3,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
                '50%': {
                  opacity: 0.7,
                  transform: 'scale(1.1)',
                },
              },
            }}
          />
          
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#2c3e50',
              mb: 2,
            }}
          >
            Maintenance en cours
          </Typography>
          
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: '#7f8c8d',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            Le site est actuellement en maintenance pour améliorer votre expérience.
            <br />
            Nous serons de retour très bientôt !
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} sx={{ color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#95a5a6' }}>
              Merci de votre patience
            </Typography>
          </Box>
          
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #ecf0f1' }}>
            <Typography variant="body2" sx={{ color: '#95a5a6' }}>
              Si vous êtes administrateur, veuillez vous connecter pour accéder au panneau d'administration.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MaintenancePage;

