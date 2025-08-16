import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  Divider,
} from '@mui/material';

const SimpleAuthTest = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      setResult({ success: true, data, status: response.status });
      
      // Si la connexion réussit, stocker les données
      if (data.success && data.data.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        console.log('Données stockées dans localStorage:', {
          token: data.data.token,
          user: data.data.user
        });
      }
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    setResult(null);
    console.log('localStorage vidé');
  };

  const checkStorage = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('État du localStorage:', { token, user });
    setResult({ success: true, storage: { token, user } });
  };

  return (
    <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
      <Typography variant="h6" gutterBottom>
        🧪 Test d'Authentification Simple
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
        
        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={testLogin}
          disabled={loading}
        >
          {loading ? 'Test en cours...' : 'Tester Connexion'}
        </Button>
        
        <Button
          variant="outlined"
          onClick={checkStorage}
        >
          Vérifier Storage
        </Button>
        
        <Button
          variant="outlined"
          color="warning"
          onClick={clearStorage}
        >
          Vider Storage
        </Button>
      </Box>

      {result && (
        <>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" gutterBottom>
            Résultat du test:
          </Typography>
          
          <Alert 
            severity={result.success ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            <pre style={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Alert>
        </>
      )}
    </Paper>
  );
};

export default SimpleAuthTest; 