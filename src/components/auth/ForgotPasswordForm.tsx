import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Link,
  Paper,
  Alert,
} from '@mui/material';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!email) {
      setError('L\'email est requis');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email invalide');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await onSubmit(email);
        setSuccess(true);
      } catch (err) {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
          borderRadius: 2,
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Réinitialisation du mot de passe
        </Typography>
        
        {success ? (
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Un email de réinitialisation a été envoyé à {email}
            </Alert>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Veuillez vérifier votre boîte de réception et suivre les instructions.
            </Typography>
            <Link href="/login" variant="body2">
              Retour à la connexion
            </Link>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: '#02a95c',
                '&:hover': {
                  backgroundColor: '#018c4d',
                },
              }}
            >
              Envoyer le lien de réinitialisation
            </Button>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link href="/login" variant="body2">
                Retour à la connexion
              </Link>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ForgotPasswordForm;