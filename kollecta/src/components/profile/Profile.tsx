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
  Security as SecurityIcon,
  DocumentScanner as DocumentIcon,
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
                  firstName={profileData?.firstName || user.firstName} 
                  lastName={profileData?.lastName || user.lastName} 
                />
              ) : (
                // Avatar avec photo personnalisée
                <Avatar
                  src={profileData?.profilePicture ? `http://localhost:5000${profileData.profilePicture}` : undefined}
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
                color: '#1a202c',
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              {profileData?.firstName || user.firstName} {profileData?.lastName || user.lastName}
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
              {profileData?.email || user.email}
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
                        {profileData?.firstName || user.firstName} {profileData?.lastName || user.lastName}
                      </Typography>
                    </Box>
                  </Grid>



                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ minWidth: 120, fontWeight: 500 }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ minWidth: 120, fontWeight: 500 }}>
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

            {/* 🆕 NOUVELLE CARTE : Vérification KYC/AML */}
            <Card
              elevation={0}
              sx={{
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                mt: 4, // Ajout du padding manquant entre les cartes
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
                  borderColor: '#667eea',
                },
              }}
            >
              <Box
                sx={{
                  bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  p: 3,
                }}
              >
                <Typography variant="h6" component="h3" sx={{ color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon />
                  Vérification d'identité KYC
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                    Pour votre sécurité et conformité réglementaire, nous devons vérifier votre identité avant l'ouverture de cagnottes et les paiements.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ flex: 1, fontWeight: 500 }}>
                      Statut KYC
                    </Typography>
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

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" color="textSecondary" sx={{ flex: 1, fontWeight: 500 }}>
                      Documents acceptés
                    </Typography>
                    <Chip
                      label="Carte d'identité / Passeport"
                      color="default"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<DocumentIcon />}
                    onClick={() => navigate('/kyc/verify')}
                    sx={{
                      bgcolor: '#667eea',
                      '&:hover': { bgcolor: '#5a67d8' },
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
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
                      borderColor: '#667eea',
                      color: '#667eea',
                      '&:hover': {
                        bgcolor: '#667eea',
                        color: 'white',
                      },
                      py: 1.5,
                      borderRadius: '12px',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderWidth: 2,
                    }}
                  >
                    Vérifier le statut
                  </Button>
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                    💡 Pourquoi la vérification KYC ?
                  </Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 1.5 }}>
                    • Conformité réglementaire tunisienne<br/>
                    • Protection contre la fraude<br/>
                    • Sécurisation des transactions<br/>
                    • Obligatoire pour les cagnottes
                  </Typography>
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