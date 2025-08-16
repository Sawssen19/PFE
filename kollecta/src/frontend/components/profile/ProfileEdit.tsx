import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  IconButton,
  Paper,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { ProfileData, ProfileUpdateData } from '../../types/profile.types';
import { profileService } from '../../services/profile/profileService';
import { setProfileData, setProfileLoading, setProfileError, updateProfileData } from '../../store/slices/profileSlice';
import { updateUser } from '../../store/slices/authSlice';
import { RootState } from '../../store';

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.profile.data);
  const loading = useSelector((state: RootState) => state.profile.loading);
  
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const [formData, setFormData] = useState<ProfileUpdateData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    visibility: 'public',
    description: '',
    profileUrl: `https://www.kollecta.com/u/${user?.id || 'user'}`,
    profilePicture: ''
  });

  // Initialiser les données du formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        visibility: profile?.profileVisibility || 'public',
        description: profile?.profileDescription || '',
        profileUrl: profile?.profileUrl || `https://www.kollecta.com/u/${user.id}`,
        profilePicture: profile?.profilePicture || ''
      });
    }
  }, [user, profile]);

  // Charger les données de profil depuis le backend
  useEffect(() => {
    const loadProfileData = async () => {
      if (user?.id && !profile) {
        try {
          const profileData = await profileService.getProfile(user.id);
          dispatch(setProfileData(profileData));
        } catch (error) {
          console.error('Erreur lors du chargement des données de profil:', error);
        }
      }
    };

    loadProfileData();
  }, [user?.id, profile, dispatch]);

  const handleBack = () => {
    navigate('/profile');
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result as string
        }));
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoDelete = () => {
    setConfirmDelete(true);
  };

  const confirmPhotoDelete = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: null
    }));
    setConfirmDelete(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    dispatch(setProfileLoading(true));
    
    try {
      if (!user?.id) {
        throw new Error('Utilisateur non connecté');
      }

      console.log('📝 Données à envoyer:', formData);

      // Si une nouvelle photo a été sélectionnée, l'uploader d'abord
      let profilePictureUrl = formData.profilePicture;
      
      // Si c'est une nouvelle image (base64), l'uploader
      if (formData.profilePicture && formData.profilePicture.startsWith('data:image')) {
        try {
          // Convertir base64 en fichier
          const response = await fetch(formData.profilePicture);
          const blob = await response.blob();
          const file = new File([blob], 'profile-picture.jpg', { type: 'image/jpeg' });
          
          console.log('📸 Upload de la photo de profil...');
          const uploadResult = await profileService.uploadProfilePicture(user.id, file);
          profilePictureUrl = uploadResult.url;
          console.log('✅ Photo uploadée:', profilePictureUrl);
        } catch (uploadError) {
          console.error('❌ Erreur lors de l\'upload de la photo:', uploadError);
          // Continuer sans la photo si l'upload échoue
        }
      }

      // Préparer les données pour la mise à jour (sans la photo)
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        visibility: formData.visibility,
        description: formData.description,
        profileUrl: formData.profileUrl,
      };

      // Mettre à jour le profil via l'API
      const updatedProfile = await profileService.updateProfile(user.id, updateData);
      
      console.log('✅ Réponse du serveur:', updatedProfile);
      
      // Mettre à jour le state Redux avec les nouvelles données
      dispatch(setProfileData({
        ...updatedProfile,
        profilePicture: profilePictureUrl || updatedProfile.profilePicture
      }));
      
      // Mettre à jour les données utilisateur dans le state auth
      dispatch(updateUser({
        firstName: updatedProfile.firstName || user.firstName,
        lastName: updatedProfile.lastName || user.lastName,
      }));

      setNotification({
        open: true,
        message: 'Profil mis à jour avec succès !',
        severity: 'success',
      });

      // Rediriger vers le profil après un court délai
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
      setNotification({
        open: true,
        message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil',
        severity: 'error',
      });
      dispatch(setProfileError(error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setIsLoading(false);
      dispatch(setProfileLoading(false));
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      pt: 12 // Augmenté de 8 à 12 pour créer plus d'espace sous le header
    }}>
      <Container maxWidth="md">
        {/* Header avec bouton retour */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 8, // Augmenté de 6 à 8 pour plus d'espace
          position: 'relative'
        }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ 
              color: '#666',
              '&:hover': { 
                backgroundColor: 'rgba(0, 178, 137, 0.1)',
                color: '#00b289'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Retour
          </Button>
          
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              flex: 1, 
              textAlign: 'center',
              fontWeight: 700,
              color: '#1a1a1a',
              fontSize: { xs: '1.75rem', md: '2.125rem' }
            }}
          >
            Modifier le profil
          </Typography>
        </Box>

        {/* Formulaire principal */}
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box component="form" onSubmit={handleSubmit}>
              
              {/* Section Photo de profil */}
              <Box sx={{ 
                mb: 5, 
                textAlign: 'center',
                p: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: '2px dashed #dee2e6'
              }}>
                {(formData.profilePicture || profile?.profilePicture) ? (
                  // Afficher la photo de profil si elle existe (soit dans formData soit dans profile)
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={formData.profilePicture || profile?.profilePicture}
                      alt="Photo de profil"
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid white',
                        boxShadow: '0 4px 20px rgba(0, 178, 137, 0.3)'
                      }}
                    />
                  </Box>
                ) : (
                  // Afficher l'icône SVG par défaut si pas de photo
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto 20px',
                      borderRadius: '50%',
                      backgroundColor: '#f8f9fa',
                      border: '4px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <svg 
                      className="hrt-icon hrt-icon--default"
                      width="60" 
                      height="60" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" 
                        fill="#9CA3AF"
                      />
                    </svg>
                  </Box>
                )}
                
                <Typography variant="h6" sx={{ mb: 2, color: '#495057', fontWeight: 600 }}>
                  Photo de profil
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 3, color: '#6c757d', maxWidth: 400, mx: 'auto' }}>
                  Ajoutez une photo pour personnaliser votre profil et vous démarquer
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoChange}
                  />
                  <Button
                    variant="contained"
                    onClick={() => fileInputRef.current?.click()}
                    startIcon={<PhotoCameraIcon />}
                    sx={{ 
                      bgcolor: '#00b289',
                      '&:hover': { bgcolor: '#008e6d' },
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    {(formData.profilePicture || profile?.profilePicture) ? 'Changer la photo' : 'Ajouter une photo'}
                  </Button>
                  {(formData.profilePicture || profile?.profilePicture) && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handlePhotoDelete}
                      startIcon={<DeleteIcon />}
                      sx={{ 
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Supprimer
                    </Button>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 4, opacity: 0.3 }} />

              {/* Section Informations personnelles */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PersonIcon sx={{ color: '#00b289', mr: 2, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    Informations personnelles
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                  <TextField
                    fullWidth
                    name="firstName"
                    label="Prénom"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#00b289',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#00b289',
                        }
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    name="lastName"
                    label="Nom"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#00b289',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#00b289',
                        }
                      }
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 4, opacity: 0.3 }} />

              {/* Section Description */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <DescriptionIcon sx={{ color: '#00b289', mr: 2, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    À propos de vous
                  </Typography>
                </Box>
                
                <TextField
                  fullWidth
                  name="description"
                  label="Décrivez-vous en quelques mots"
                  value={formData.description}
                  onChange={handleInputChange}
                  variant="outlined"
                  multiline
                  rows={4}
                  inputProps={{ maxLength: 160 }}
                  helperText={`${formData.description?.length || 0}/160 caractères`}
                  placeholder="Parlez-nous de vos passions, de ce qui vous motive, ou de vos projets..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00b289',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00b289',
                      }
                    }
                  }}
                />
              </Box>

              <Divider sx={{ my: 4, opacity: 0.3 }} />

              {/* Section URL du profil */}
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <LinkIcon sx={{ color: '#00b289', mr: 2, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    URL personnalisée
                  </Typography>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2, color: '#6c757d' }}>
                  Créez une URL unique pour votre profil que vous pourrez partager facilement
                </Typography>
                
                <TextField
                  fullWidth
                  name="profileUrl"
                  label="Votre URL personnalisée"
                  value={formData.profileUrl}
                  onChange={handleInputChange}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ color: '#00b289', fontWeight: 600 }}>
                          kollecta.com/
                        </Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00b289',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00b289',
                      }
                    }
                  }}
                />
              </Box>

              {/* Bouton Enregistrer */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading || loading}
                sx={{
                  bgcolor: '#00b289',
                  '&:hover': { 
                    bgcolor: '#008e6d',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 178, 137, 0.3)'
                  },
                  '&:disabled': { bgcolor: '#6c757d' },
                  height: 56,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0, 178, 137, 0.2)'
                }}
              >
                {isLoading || loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Enregistrer les modifications'
                )}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Dialog de confirmation pour la suppression de photo */}
      <Dialog 
        open={confirmDelete} 
        onClose={() => setConfirmDelete(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontWeight: 600,
          color: '#1a1a1a'
        }}>
          Supprimer la photo de profil ?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: 'center', color: '#6c757d' }}>
            Êtes-vous sûr de vouloir supprimer votre photo de profil ? Cette action ne peut pas être annulée.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
          <Button 
            onClick={() => setConfirmDelete(false)}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Annuler
          </Button>
          <Button 
            onClick={confirmPhotoDelete} 
            color="error"
            variant="contained"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            fontWeight: 500
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileEdit;