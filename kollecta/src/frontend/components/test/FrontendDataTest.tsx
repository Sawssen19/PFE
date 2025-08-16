import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { Box, Typography, Paper, Divider, Alert } from '@mui/material';

const FrontendDataTest: React.FC = () => {
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [sessionStorageData, setSessionStorageData] = useState<any>(null);
  
  const user = useSelector((state: RootState) => state.auth.user);
  const profileData = useSelector((state: RootState) => state.profile.data);

  useEffect(() => {
    // 🔍 Vérifier localStorage
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    let parsedUser = null;
    if (userStr) {
      try {
        parsedUser = JSON.parse(userStr);
      } catch (error) {
        console.error('❌ Erreur parsing localStorage user:', error);
      }
    }

    setLocalStorageData({
      token,
      user: parsedUser
    });

    // 🔍 Vérifier sessionStorage
    const sessionToken = sessionStorage.getItem('token');
    const sessionUserStr = sessionStorage.getItem('user');
    
    let sessionUser = null;
    if (sessionUserStr) {
      try {
        sessionUser = JSON.parse(sessionUserStr);
      } catch (error) {
        console.error('❌ Erreur parsing sessionStorage user:', error);
      }
    }

    setSessionStorageData({
      token: sessionToken,
      user: sessionUser
    });

    // 🔍 Logs complets
    console.log('🔍 FRONTEND DATA TEST - État complet:');
    console.log('  - Redux User:', user);
    console.log('  - Redux Profile:', profileData);
    console.log('  - localStorage Token:', token);
    console.log('  - localStorage User:', parsedUser);
    console.log('  - sessionStorage Token:', sessionToken);
    console.log('  - sessionStorage User:', sessionUser);
  }, [user, profileData]);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🔍 Test des Données Frontend
      </Typography>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Ce composant vérifie d'où viennent les données affichées côté frontend
      </Alert>

      {/* Redux State */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 Redux State
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="subtitle2" color="text.secondary">
          User State:
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
        
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
          Profile State:
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(profileData, null, 2)}
        </pre>
      </Paper>

      {/* localStorage */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          💾 localStorage
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="subtitle2" color="text.secondary">
          Token:
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
          {localStorageData?.token || 'Aucun token'}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
          User:
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(localStorageData?.user, null, 2)}
        </pre>
      </Paper>

      {/* sessionStorage */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          🗂️ sessionStorage
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="subtitle2" color="text.secondary">
          Token:
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
          {sessionStorageData?.token || 'Aucun token'}
        </Typography>
        
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
          User:
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(sessionStorageData?.user, null, 2)}
        </pre>
      </Paper>

      {/* Actions de Test */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          🧪 Actions de Test
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              console.log('🧹 Nettoyage localStorage...');
              localStorage.clear();
              setLocalStorageData({ token: null, user: null });
              console.log('✅ localStorage nettoyé');
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧹 Vider localStorage
          </button>
          
          <button
            onClick={() => {
              console.log('🧹 Nettoyage sessionStorage...');
              sessionStorage.clear();
              setSessionStorageData({ token: null, user: null });
              console.log('✅ sessionStorage nettoyé');
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ff9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧹 Vider sessionStorage
          </button>
          
          <button
            onClick={() => {
              console.log('🔄 Rechargement de la page...');
              window.location.reload();
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Recharger la page
          </button>
        </Box>
      </Paper>
    </Box>
  );
};

export default FrontendDataTest; 