import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { profileService } from '../../services/profile/profileService';

const PhotoDebug = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const user = useSelector((state: RootState) => state.auth.user);
  const profileData = useSelector((state: RootState) => state.profile.data);

  const testPhotoChange = async () => {
    if (!user?.id) {
      setMessage('❌ Aucun utilisateur connecté');
      return;
    }

    try {
      setLoading(true);
      setMessage('🔄 Test en cours...');
      
      // Créer un fichier de test
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      console.log('🧪 Test upload photo:', testFile);
      
      const result = await profileService.uploadProfilePicture(user.id, testFile);
      console.log('✅ Upload réussi:', result);
      
      setMessage(`✅ Upload réussi: ${result.url}`);
      
      // Recharger le profil
      const updatedProfile = await profileService.getProfile(user.id);
      console.log('🔄 Profil rechargé:', updatedProfile);
      
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      setMessage(`❌ Erreur: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testPhotoDelete = async () => {
    if (!user?.id) {
      setMessage('❌ Aucun utilisateur connecté');
      return;
    }

    try {
      setLoading(true);
      setMessage('🔄 Suppression en cours...');
      
      await profileService.deleteProfilePicture(user.id);
      console.log('✅ Suppression réussie');
      
      setMessage('✅ Photo supprimée avec succès');
      
      // Recharger le profil
      const updatedProfile = await profileService.getProfile(user.id);
      console.log('🔄 Profil rechargé après suppression:', updatedProfile);
      
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      setMessage(`❌ Erreur: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetProfile = async () => {
    if (!user?.id) {
      setMessage('❌ Aucun utilisateur connecté');
      return;
    }

    try {
      setLoading(true);
      setMessage('🔄 Récupération du profil...');
      
      const profile = await profileService.getProfile(user.id);
      console.log('📋 Profil récupéré:', profile);
      
      setMessage(`✅ Profil récupéré - Photo: ${profile.profilePicture || 'Aucune'}`);
      
    } catch (error) {
      console.error('❌ Erreur récupération:', error);
      setMessage(`❌ Erreur: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #ccc', borderRadius: '8px', margin: '20px' }}>
      <h3>🧪 Debug des Photos de Profil</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>État actuel :</h4>
        <p><strong>User ID:</strong> {user?.id || 'Non connecté'}</p>
        <p><strong>Photo actuelle:</strong> {profileData?.profilePicture || 'Aucune'}</p>
        <p><strong>Token:</strong> {localStorage.getItem('token') ? '✅ Présent' : '❌ Absent'}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={testPhotoChange}
          disabled={loading || !user?.id}
          style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? '🔄' : '📸'} Test Upload
        </button>
        
        <button 
          onClick={testPhotoDelete}
          disabled={loading || !user?.id}
          style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? '🔄' : '🗑️'} Test Suppression
        </button>
        
        <button 
          onClick={testGetProfile}
          disabled={loading || !user?.id}
          style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {loading ? '🔄' : '📋'} Test Récupération
        </button>
      </div>

      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: message.includes('❌') ? '#f8d7da' : '#d4edda',
          border: `1px solid ${message.includes('❌') ? '#f5c6cb' : '#c3e6cb'}`,
          borderRadius: '4px',
          color: message.includes('❌') ? '#721c24' : '#155724'
        }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h4>Instructions :</h4>
        <ol>
          <li>Ouvrez la console du navigateur (F12)</li>
          <li>Cliquez sur "Test Upload" pour tester l'upload</li>
          <li>Cliquez sur "Test Suppression" pour tester la suppression</li>
          <li>Cliquez sur "Test Récupération" pour vérifier l'état</li>
          <li>Vérifiez les logs dans la console</li>
        </ol>
      </div>
    </div>
  );
};

export default PhotoDebug; 