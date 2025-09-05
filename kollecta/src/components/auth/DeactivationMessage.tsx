import React from 'react';
import { Alert, Box } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';

interface DeactivationMessageProps {
  message: string;
}

const DeactivationMessage: React.FC<DeactivationMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity="info" 
        icon={<CheckCircle2 />}
        sx={{ 
          borderRadius: 2,
          '& .MuiAlert-message': {
            fontSize: '1rem',
            lineHeight: 1.5
          }
        }}
      >
        {message}
      </Alert>
    </Box>
  );
};

export default DeactivationMessage; 