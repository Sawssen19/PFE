import React from 'react';
import { Box, Typography } from '@mui/material';

interface LogoProps {
  height?: number;
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ height = 40, withText = true }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        component="img"
        src="/logo.png"
        alt="Kollecta"
        sx={{
          height: `${height}px`,
          width: 'auto',
        }}
      />
      {withText && (
        <Typography
          variant="h6"
          sx={{
            color: 'black',
            fontWeight: 'bold',
            display: { xs: 'none', md: 'block' }
          }}
        >
          KOLLECTA
        </Typography>
      )}
    </Box>
  );
};

export default Logo;