import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  Chip,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { selectUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { setProfileData, clearProfileData } from '../../store/slices/profileSlice';
import { profileService } from '../../services/profile/profileService';
import DefaultAvatar from '../common/DefaultAvatar';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profileData = useSelector((state: RootState) => state.profile.data);

  // 🧪 LOGS DE DÉBOGAGE COMPLETS : Vérifier TOUTES les données
  console.log('🧪 Profile - User depuis Redux:', user);
  console.log('🧪 Profile - Profile depuis Redux:', profileData);
  console.log('🧪 Profile - User ID:', user?.id);
  console.log('🧪 Profile - User profilePicture:', user?.profilePicture);
  console.log('🧪 Profile - User profileUrl:', user?.profileUrl);
  console.log('🧪 Profile - User profileDescription:', user?.profileDescription);
  console.log('🧪 Profile - User profileVisibility:', user?.profileVisibility);

  // Charger les données de profil au chargement du composant
  useEffect(() => {
    const loadProfileData = async () => {
      if (user?.id) {
        // 🧹 NETTOYAGE : Vider le profile state pour éviter l'héritage
        if (profileData && profileData.id !== user.id) {
          console.log('🧹 Nettoyage du profile state - ID différent:', profileData.id, 'vs', user.id);
          dispatch(clearProfileData());
        }
        
        if (!profileData || profileData.id !== user.id) {
          try {
            console.log('🔄 Chargement des données de profil pour:', user.id);
            const data = await profileService.getProfile(user.id);
            dispatch(setProfileData(data));
            console.log('✅ Données de profil chargées:', data);
          } catch (error) {
            console.error('Erreur lors du chargement des données de profil:', error);
          }
        }
      }
    };

    loadProfileData();
  }, [user?.id, profileData, dispatch]);

  // Fonction pour déterminer si on doit afficher l'avatar par défaut
  const shouldShowDefaultAvatar = () => {
    // Si pas de données de profil ou pas de photo de profil, afficher l'avatar par défaut
    if (!profileData || !profileData.profilePicture) {
      return true;
    }
    
    // Si l'utilisateur vient de s'inscrire (pas de photo uploadée), afficher l'avatar par défaut
    // On peut vérifier si la photo est une photo par défaut du système
    if (profileData.profilePicture.includes('default-avatar') || 
        profileData.profilePicture.includes('placeholder')) {
      return true;
    }
    
    return false;
  };

  const handleShareProfile = () => {
    // Logique pour partager le profil
    if (navigator.share) {
      navigator.share({
        title: `${user?.firstName || 'Utilisateur'} ${user?.lastName || ''} sur Kollecta`,
        text: `Découvrez le profil de ${user?.firstName || 'Utilisateur'} ${user?.lastName || ''} sur Kollecta`,
        url: window.location.href,
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
      navigator.clipboard.writeText(window.location.href);
      // Ici vous pourriez afficher une notification de succès
    }
  };

  // Si pas d'utilisateur, afficher un message d'erreur
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error" icon={<InfoIcon />}>
          Aucun utilisateur connecté. Veuillez vous connecter pour voir votre profil.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Section d'en-tête avec couleur claire et padding sous le header */}
      <Box
        sx={{
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          py: 10, // Augmenté de 8 à 10 pour plus d'espace
          mt: 12, // Augmenté de 8 à 12 pour créer plus d'espace sous le header
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 178, 137, 0.03) 0%, rgba(0, 142, 109, 0.01) 100%)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {/* Avatar avec effet moderne */}
            <Box
              sx={{
                display: 'inline-block',
                position: 'relative',
                mb: 4,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -12,
                  left: -12,
                  right: -12,
                  bottom: -12,
                  background: 'linear-gradient(135deg, #00b289, #008e6d)',
                  borderRadius: '50%',
                  opacity: 0.1,
                  zIndex: -1,
                },
              }}
            >
              {shouldShowDefaultAvatar() ? (
                // Avatar par défaut SVG
                <DefaultAvatar 
                  size={120} 
                  firstName={user.firstName} 
                  lastName={user.lastName} 
                />
              ) : (
                // Avatar avec photo personnalisée
                <Avatar
                  src={profileData?.profilePicture}
                  sx={{
                    width: 120,
                    height: 120,
                    border: '4px solid #ffffff',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.06)',
                    fontSize: '3rem',
                    bgcolor: '#00b289',
                    color: 'white',
                    fontWeight: 600,
                  }}
                >
                  {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'S'}
                </Avatar>
              )}
            </Box>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: '#1a202c',
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              {user.firstName} {user.lastName}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                mb: 4,
                fontWeight: 400,
                fontSize: '1.1rem',
              }}
            >
              {user.email}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate('/profile/edit')}
                sx={{
                  bgcolor: '#00b289',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 8px 25px rgba(0, 178, 137, 0.25)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: '#008e6d',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 16px 40px rgba(0, 178, 137, 0.35)',
                  },
                }}
              >
                Modifier le profil
              </Button>

              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={handleShareProfile}
                sx={{
                  borderColor: '#00b289',
                  color: '#00b289',
                  px: 4,
                  py: 1.5,
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderWidth: 2,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: '#008e6d',
                    color: '#008e6d',
                    bgcolor: 'rgba(0, 178, 137, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Partager le profil
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Contenu principal avec plus de padding */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {/* Colonne gauche - Informations principales */}
          <Grid item xs={12} md={8}>
            {/* Carte des informations personnelles */}
            <Card
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  borderColor: '#00b289',
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: 'linear-gradient(135deg, #00b289 0%, #008e6d 100%)',
                  background: 'linear-gradient(135deg, #00b289 0%, #008e6d 100%)',
                  p: 3,
                }}
              >
                <Typography variant="h5" component="h2" sx={{ color: 'white', fontWeight: 600 }}>
                  Informations personnelles
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ minWidth: 120, fontWeight: 500 }}>
                        Nom complet:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a202c' }}>
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ minWidth: 120, fontWeight: 500 }}>
                        Email:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a202c' }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ minWidth: 120, fontWeight: 500 }}>
                        Rôle:
                      </Typography>
                      <Chip
                        label={user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                        color={user.role === 'ADMIN' ? 'error' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ minWidth: 120, fontWeight: 500 }}>
                        Statut:
                      </Typography>
                      <Chip
                        icon={user.isVerified ? <VerifiedIcon /> : <InfoIcon />}
                        label={user.isVerified ? 'Vérifié' : 'En attente'}
                        color={user.isVerified ? 'success' : 'warning'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Carte des statistiques */}
            <Card
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  borderColor: '#00b289',
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  p: 3,
                }}
              >
                <Typography variant="h5" component="h2" sx={{ color: 'white', fontWeight: 600 }}>
                  Statistiques
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" component="div" sx={{ color: '#00b289', fontWeight: 700, mb: 1 }}>
                        0
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                        Cagnottes créées
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" component="div" sx={{ color: '#00b289', fontWeight: 700, mb: 1 }}>
                        0
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                        Cagnottes soutenues
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" component="div" sx={{ color: '#00b289', fontWeight: 700, mb: 1 }}>
                        0€
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500 }}>
                        Total donné
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Colonne droite - Actions et informations supplémentaires */}
          <Grid item xs={12} md={4}>
            {/* Carte des actions rapides */}
            <Card
              elevation={0}
              sx={{
                mb: 4,
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  borderColor: '#00b289',
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  p: 3,
                }}
              >
                <Typography variant="h6" component="h3" sx={{ color: 'white', fontWeight: 600 }}>
                  Actions rapides
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<EditIcon />}
                    onClick={() => navigate('/profile/edit')}
                    sx={{
                      bgcolor: '#00b289',
                      '&:hover': { bgcolor: '#008e6d' },
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                  >
                    Modifier le profil
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<ShareIcon />}
                    onClick={handleShareProfile}
                    sx={{
                      borderColor: '#00b289',
                      color: '#00b289',
                      '&:hover': {
                        bgcolor: '#00b289',
                        color: 'white',
                      },
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderWidth: 2,
                    }}
                  >
                    Partager le profil
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Carte des informations de sécurité */}
            <Card
              elevation={0}
              sx={{
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  borderColor: '#00b289',
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  p: 3,
                }}
              >
                <Typography variant="h6" component="h3" sx={{ color: 'white', fontWeight: 600 }}>
                  Sécurité
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ flex: 1, fontWeight: 500 }}>
                    Mot de passe
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/change-password')}
                    sx={{ color: '#00b289', fontWeight: 600 }}
                  >
                    Modifier
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="textSecondary" sx={{ flex: 1, fontWeight: 500 }}>
                    Authentification à deux facteurs
                  </Typography>
                  <Chip
                    label="Non activée"
                    color="default"
                    size="small"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile;