import React, { useEffect, useState } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Share as ShareIcon,
  Verified as VerifiedIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  DocumentScanner as DocumentIcon,
  Campaign as CampaignIcon,
  Favorite as FavoriteIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { selectUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { setProfileData, clearProfileData } from '../../store/slices/profileSlice';
import { profileService } from '../../features/profile/profileService';
import DefaultAvatar from '../common/DefaultAvatar';

const Profile = () => {
  console.log('🔧 Profile.tsx - Composant rendu !');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const profileData = useSelector((state: RootState) => state.profile.data);
  const [stats, setStats] = useState<{
    cagnottesCreated: number;
    cagnottesSupported: number;
    totalGiven: number;
  } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // 🧪 LOGS DE DÉBOGAGE COMPLETS : Vérifier TOUTES les données
  console.log('🧪 Profile - User depuis Redux:', user);
  console.log('🧪 Profile - Profile depuis Redux:', profileData);
  console.log('🧪 Profile - User ID:', user?.id);
  console.log('🧪 Profile - User profilePicture:', user?.profilePicture);
  console.log('🧪 Profile - User profileUrl:', user?.profileUrl);
  console.log('🧪 Profile - User profileDescription:', user?.profileDescription);
  console.log('🧪 Profile - User profileVisibility:', user?.profileVisibility);
  console.log('🔧 Profile - Bouton suppression visible:', !!profileData?.profilePicture);
  console.log('🔧 Profile - profilePicture value:', profileData?.profilePicture);
  console.log('🔧 Profile - profilePicture type:', typeof profileData?.profilePicture);
  console.log('🔧 Profile - profilePicture length:', profileData?.profilePicture?.length);
  


  // Charger les données de profil au chargement du composant
  useEffect(() => {
    // 🔐 REDIRECTION ADMIN : Si l'utilisateur est admin, le rediriger vers le dashboard admin
    if (user?.role === 'ADMIN') {
      console.log('🔐 Utilisateur admin détecté, redirection vers le dashboard admin');
      navigate('/admin');
      return;
    }

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
  }, [user?.id, profileData, dispatch, navigate]);

  // 🔄 RAFRAÎCHISSEMENT AUTOMATIQUE : Mettre à jour le profil toutes les 30 secondes
  useEffect(() => {
    if (!user?.id || user?.role === 'ADMIN') return;

    const interval = setInterval(async () => {
      try {
        console.log('🔄 Rafraîchissement automatique du profil...');
        const data = await profileService.getProfile(user.id);
        dispatch(setProfileData(data));
        console.log('✅ Profil rafraîchi:', data);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement automatique:', error);
      }
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [user?.id, user?.role, dispatch]);

  // 📊 Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      if (user?.id) {
        try {
          setLoadingStats(true);
          console.log('📊 Chargement des statistiques pour l\'utilisateur:', user.id);
          const statsData = await profileService.getProfileStats(user.id);
          console.log('✅ Statistiques reçues:', statsData);
          setStats(statsData);
        } catch (error: any) {
          console.error('❌ Erreur lors du chargement des statistiques:', error);
          console.error('❌ Détails de l\'erreur:', error?.response?.data || error?.message);
          setStats({ cagnottesCreated: 0, cagnottesSupported: 0, totalGiven: 0 });
        } finally {
          setLoadingStats(false);
        }
      } else {
        console.warn('⚠️ Pas d\'ID utilisateur disponible pour charger les statistiques');
        setStats({ cagnottesCreated: 0, cagnottesSupported: 0, totalGiven: 0 });
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [user?.id]);

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

  // 🔧 LOGS DE DÉBOGAGE pour la logique d'avatar
  console.log('🔧 Profile - shouldShowDefaultAvatar():', shouldShowDefaultAvatar());
  console.log('🔧 Profile - profileData.profilePicture:', profileData?.profilePicture);
  console.log('🔧 Profile - Bouton suppression rendu:', !!profileData?.profilePicture);



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

  // 🔧 NOUVEAU : Fonction de suppression de photo de profil (copiée de Settings.tsx)
  const handlePhotoDelete = async () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      try {
        if (user?.id) {
          await profileService.deleteProfilePicture(user.id);
          const updatedProfile = await profileService.getProfile(user.id);
          dispatch(setProfileData(updatedProfile));
          // Optionnel : afficher un message de succès
          console.log('✅ Photo de profil supprimée avec succès');
        }
      } catch (error) {
        console.error('❌ Erreur lors de la suppression de la photo:', error);
      }
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
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      paddingTop: { xs: '80px', md: '100px' }
    }}>
      {/* Section d'en-tête moderne avec gradient */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #00b289 0%, #008e6d 100%)',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            zIndex: 0,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            transform: 'translate(30%, -30%)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {/* Avatar avec effet moderne et brillant */}
            <Box
              sx={{
                display: 'inline-block',
                position: 'relative',
                mb: 4,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  right: -8,
                  bottom: -8,
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  zIndex: -1,
                  animation: 'pulse 2s ease-in-out infinite',
                },
                '@keyframes pulse': {
                  '0%, 100%': {
                    transform: 'scale(1)',
                    opacity: 0.2,
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                    opacity: 0.3,
                  },
                },
              }}
            >
              {shouldShowDefaultAvatar() ? (
                // Avatar par défaut SVG
                <DefaultAvatar 
                  size={120} 
                  firstName={profileData?.firstName || user.firstName} 
                  lastName={profileData?.lastName || user.lastName} 
                />
              ) : (
                // Avatar avec photo personnalisée
                <Avatar
                  src={profileData?.profilePicture ? `http://localhost:5000${profileData.profilePicture}` : undefined}
                  sx={{
                    width: { xs: 100, sm: 120 },
                    height: { xs: 100, sm: 120 },
                    border: '5px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 20px rgba(0, 0, 0, 0.2)',
                    fontSize: { xs: '2.5rem', sm: '3rem' },
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 700,
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {(profileData?.firstName || user.firstName)?.[0] || 'U'}{(profileData?.lastName || user.lastName)?.[0] || 'S'}
                </Avatar>
              )}

              {/* 🔧 NOUVEAU : Bouton de suppression visible seulement s'il y a une photo */}
              {profileData?.profilePicture && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={handlePhotoDelete}
                    sx={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#dc2626',
                      },
                    }}
                  >
                    Supprimer
                  </Button>
                </Box>
              )}


            </Box>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                wordBreak: 'break-word',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              {profileData?.firstName || user.firstName} {profileData?.lastName || user.lastName}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: { xs: 3, md: 4 },
                fontWeight: 400,
                fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.2rem' },
                wordBreak: 'break-word',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <EmailIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
              {profileData?.email || user.email}
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1.5, sm: 2 }, 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => navigate('/profile/edit')}
                sx={{
                  bgcolor: 'white',
                  color: '#00b289',
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  textTransform: 'none',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)',
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
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                  color: 'white',
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.25, sm: 1.5 },
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  textTransform: 'none',
                  borderWidth: 2,
                  backdropFilter: 'blur(10px)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
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
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 4, md: 8 },
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Colonne gauche - Informations principales */}
          <Grid item xs={12} md={8}>
            {/* Carte des informations personnelles */}
            <Card
              elevation={0}
              sx={{
                mb: { xs: 3, md: 4 },
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                  borderColor: '#00b289',
                },
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00b289 0%, #008e6d 100%)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <PersonIcon sx={{ color: 'white', fontSize: '2rem' }} />
                <Typography variant="h5" component="h2" sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
                  Informations personnelles
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 2,
                      borderRadius: '8px',
                      bgcolor: 'rgba(0, 178, 137, 0.03)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0, 178, 137, 0.08)',
                      }
                    }}>
                      <Typography variant="body2" color="textSecondary" sx={{ minWidth: { xs: 100, sm: 120 }, fontWeight: 600, mr: 2 }}>
                        Nom complet:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1a202c' }}>
                        {profileData?.firstName || user.firstName} {profileData?.lastName || user.lastName}
                      </Typography>
                    </Box>
                  </Grid>



                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 2,
                      borderRadius: '8px',
                      bgcolor: 'rgba(0, 178, 137, 0.03)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0, 178, 137, 0.08)',
                      }
                    }}>
                      <Typography variant="body2" color="textSecondary" sx={{ minWidth: { xs: 100, sm: 120 }, fontWeight: 600, mr: 2 }}>
                        Rôle:
                      </Typography>
                      <Chip
                        label={profileData?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
                        color={profileData?.role === 'ADMIN' ? 'error' : 'default'}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 2,
                      borderRadius: '8px',
                      bgcolor: 'rgba(0, 178, 137, 0.03)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(0, 178, 137, 0.08)',
                      }
                    }}>
                      <Typography variant="body2" color="textSecondary" sx={{ minWidth: { xs: 100, sm: 120 }, fontWeight: 600, mr: 2 }}>
                        Statut:
                      </Typography>
                      <Chip
                        icon={profileData?.status === 'ACTIVE' ? <VerifiedIcon /> : <InfoIcon />}
                        label={profileData?.status === 'ACTIVE' ? 'Validé' : profileData?.status === 'PENDING' ? 'En attente' : 'Suspendu'}
                        color={profileData?.status === 'ACTIVE' ? 'success' : profileData?.status === 'PENDING' ? 'warning' : 'error'}
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
                mb: { xs: 3, md: 4 },
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                  borderColor: '#00b289',
                },
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00b289 0%, #008e6d 100%)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <CampaignIcon sx={{ color: 'white', fontSize: '2rem' }} />
                <Typography variant="h5" component="h2" sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
                  Statistiques
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                {loadingStats ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={40} sx={{ color: '#00b289' }} />
                  </Box>
                ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        textAlign: 'center',
                        p: 3,
                        borderRadius: '12px',
                        bgcolor: 'rgba(0, 178, 137, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0, 178, 137, 0.1)',
                          transform: 'translateY(-4px)',
                        }
                      }}>
                        <Typography 
                          variant="h3" 
                          component="div" 
                          sx={{ 
                            color: '#00b289', 
                            fontWeight: 700, 
                            mb: 1,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                          }}
                        >
                          {stats?.cagnottesCreated ?? 0}
                      </Typography>
                        <Typography 
                          variant="body2" 
                          color="textSecondary" 
                          sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                        Cagnottes créées
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        textAlign: 'center',
                        p: 3,
                        borderRadius: '12px',
                        bgcolor: 'rgba(0, 178, 137, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0, 178, 137, 0.1)',
                          transform: 'translateY(-4px)',
                        }
                      }}>
                        <Typography 
                          variant="h3" 
                          component="div" 
                          sx={{ 
                            color: '#00b289', 
                            fontWeight: 700, 
                            mb: 1,
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                          }}
                        >
                          {stats?.cagnottesSupported ?? 0}
                      </Typography>
                        <Typography 
                          variant="body2" 
                          color="textSecondary" 
                          sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                        Cagnottes soutenues
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                      <Box sx={{ 
                        textAlign: 'center',
                        p: 3,
                        borderRadius: '12px',
                        bgcolor: 'rgba(0, 178, 137, 0.05)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: 'rgba(0, 178, 137, 0.1)',
                          transform: 'translateY(-4px)',
                        }
                      }}>
                        <Typography 
                          variant="h3" 
                          component="div" 
                          sx={{ 
                            color: '#00b289', 
                            fontWeight: 700, 
                            mb: 1,
                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' }
                          }}
                        >
                          {stats?.totalGiven ? `${stats.totalGiven.toLocaleString('fr-FR')} DT` : '0 DT'}
                      </Typography>
                        <Typography 
                          variant="body2" 
                          color="textSecondary" 
                          sx={{ fontWeight: 600, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                        >
                        Total donné
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                )}
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
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                  borderColor: '#00b289',
                },
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00b289 0%, #008e6d 100%)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <EditIcon sx={{ color: 'white', fontSize: '1.75rem' }} />
                <Typography variant="h6" component="h3" sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
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
                mb: { xs: 3, md: 4 },
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                  borderColor: '#00b289',
                },
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00b289 0%, #008e6d 100%)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <SecurityIcon sx={{ color: 'white', fontSize: '1.75rem' }} />
                <Typography variant="h6" component="h3" sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
                  Sécurité
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  p: 2,
                  borderRadius: '8px',
                  bgcolor: 'rgba(239, 68, 68, 0.03)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(239, 68, 68, 0.08)',
                  }
                }}>
                  <LockIcon sx={{ color: '#ef4444', mr: 1.5, fontSize: '1.5rem' }} />
                  <Typography variant="body2" color="textSecondary" sx={{ flex: 1, fontWeight: 600 }}>
                    Mot de passe
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/parametres', { state: { activeTab: 'securite' } })}
                    sx={{ 
                      color: '#00b289', 
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(0, 178, 137, 0.1)',
                      }
                    }}
                  >
                    Modifier
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 🆕 Section KYC en pleine largeur (horizontale) */}
            <Card
              elevation={0}
              sx={{
            mt: { xs: 3, md: 4 },
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
            transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
              borderColor: '#00b289',
                },
              }}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #00b289 0%, #008e6d 100%)',
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                }}
              >
                <DocumentIcon sx={{ color: 'white', fontSize: '1.75rem' }} />
                <Typography variant="h6" component="h3" sx={{ color: 'white', fontWeight: 600, textAlign: 'center' }}>
                  Vérification d'identité KYC
                </Typography>
              </Box>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Grid container spacing={{ xs: 3, md: 4 }}>
                  {/* Colonne gauche - Informations et statut */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3, lineHeight: 1.7, fontSize: '0.95rem' }}>
                    Pour votre sécurité et conformité réglementaire, nous devons vérifier votre identité avant l'ouverture de cagnottes et les paiements.
                  </Typography>
                  
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: '8px',
                      bgcolor: 'rgba(0, 178, 137, 0.05)',
                      mb: 2,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <SecurityIcon sx={{ color: '#00b289', fontSize: '1.5rem' }} />
                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                      Statut KYC
                    </Typography>
                      </Box>
                    <Chip
                      icon={profileData?.kycVerification?.verificationStatus === 'VERIFIED' ? <VerifiedIcon /> : <InfoIcon />}
                      label={
                        profileData?.kycVerification?.verificationStatus === 'VERIFIED' ? 'Vérifié' :
                        profileData?.kycVerification?.verificationStatus === 'PENDING' ? 'En cours' :
                        profileData?.kycVerification?.verificationStatus === 'REJECTED' ? 'Rejeté' :
                        'Non vérifié'
                      }
                      color={
                        profileData?.kycVerification?.verificationStatus === 'VERIFIED' ? 'success' :
                        profileData?.kycVerification?.verificationStatus === 'PENDING' ? 'warning' :
                        profileData?.kycVerification?.verificationStatus === 'REJECTED' ? 'error' :
                        'default'
                      }
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: '8px',
                      bgcolor: 'rgba(0, 178, 137, 0.05)',
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <DocumentIcon sx={{ color: '#00b289', fontSize: '1.5rem' }} />
                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
                      Documents acceptés
                    </Typography>
                      </Box>
                    <Chip
                      label="Carte d'identité / Passeport"
                      color="default"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                  </Grid>

                  {/* Colonne droite - Actions et informations */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<DocumentIcon />}
                    onClick={() => navigate('/kyc/verify')}
                    sx={{
                          bgcolor: '#00b289',
                          '&:hover': { bgcolor: '#008e6d' },
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                          fontSize: '0.95rem',
                    }}
                  >
                    Commencer la vérification KYC
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<InfoIcon />}
                    onClick={() => navigate('/kyc/status')}
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
                          fontSize: '0.95rem',
                    }}
                  >
                    Vérifier le statut
                  </Button>
                </Box>

                    <Box sx={{ 
                      p: 2.5, 
                      bgcolor: '#fffbf0', 
                      borderRadius: '12px', 
                      border: '1px solid #fef3c7',
                      borderLeft: '4px solid #fbbf24'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <InfoIcon sx={{ color: '#f59e0b', fontSize: '1.25rem' }} />
                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 700, color: '#92400e' }}>
                          Pourquoi la vérification KYC ?
                  </Typography>
                      </Box>
                      <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: 'none' }}>
                        <Typography component="li" variant="body2" color="textSecondary" sx={{ mb: 0.75, lineHeight: 1.6, '&::before': { content: '"• "', color: '#f59e0b', fontWeight: 'bold', mr: 1 } }}>
                          Conformité réglementaire tunisienne
                        </Typography>
                        <Typography component="li" variant="body2" color="textSecondary" sx={{ mb: 0.75, lineHeight: 1.6, '&::before': { content: '"• "', color: '#f59e0b', fontWeight: 'bold', mr: 1 } }}>
                          Protection contre la fraude
                        </Typography>
                        <Typography component="li" variant="body2" color="textSecondary" sx={{ mb: 0.75, lineHeight: 1.6, '&::before': { content: '"• "', color: '#f59e0b', fontWeight: 'bold', mr: 1 } }}>
                          Sécurisation des transactions
                        </Typography>
                        <Typography component="li" variant="body2" color="textSecondary" sx={{ lineHeight: 1.6, '&::before': { content: '"• "', color: '#f59e0b', fontWeight: 'bold', mr: 1 } }}>
                          Obligatoire pour les cagnottes
                  </Typography>
                </Box>
                    </Box>
          </Grid>
        </Grid>
              </CardContent>
            </Card>
      </Container>
    </Box>
  );
};

export default Profile;