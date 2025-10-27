import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Button,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  Report as ReportIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { selectUser } from '../../store/slices/authSlice';
import AdminUsersManagement from './AdminUsersManagement';
import AdminCampaignsManagement from './AdminCampaignsManagement';
import AdminReportsManagement from './AdminReportsManagement';
import AdminAnalytics from './AdminAnalytics';
import AdminLogs from './AdminLogs';
import AdminSettings from './AdminSettings';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={300}>
          <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
        </Fade>
      )}
    </div>
  );
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 🔐 VÉRIFICATION DES PERMISSIONS ADMIN
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'ADMIN') {
      navigate('/profile');
      return;
    }
  }, [user, navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // 🚫 Accès refusé si pas admin
  if (!user || user.role !== 'ADMIN') {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Accès refusé. Seuls les administrateurs peuvent accéder à cette page.
        </Alert>
      </Container>
    );
  }

  const tabs = [
    { label: 'Tableau de bord', icon: <DashboardIcon />, component: <AdminAnalytics /> },
    { label: 'Utilisateurs', icon: <PeopleIcon />, component: <AdminUsersManagement /> },
    { label: 'Cagnottes', icon: <CampaignIcon />, component: <AdminCampaignsManagement /> },
    { label: 'Signalements', icon: <ReportIcon />, component: <AdminReportsManagement /> },
    { label: 'Logs', icon: <SecurityIcon />, component: <AdminLogs /> },
    { label: 'Paramètres', icon: <SettingsIcon />, component: <AdminSettings /> },
  ];

  const statsCards = [
    {
      title: 'Utilisateurs actifs',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: <PeopleIcon />,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    {
      title: 'Cagnottes en cours',
      value: '567',
      change: '+8%',
      changeType: 'positive',
      icon: <CampaignIcon />,
      color: '#00b289',
      gradient: 'linear-gradient(135deg, #00b289 0%, #008f73 100%)',
    },
    {
      title: 'Signalements en attente',
      value: '89',
      change: '-5%',
      changeType: 'negative',
      icon: <ReportIcon />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    {
      title: 'Actions requises',
      value: '23',
      change: '+2',
      changeType: 'neutral',
      icon: <WarningIcon />,
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    },
  ];

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      pt: { xs: 1, md: 2 },
      pb: 4,
      // 🎯 Espacement global pour éviter que le contenu soit collé au header
      mt: { xs: '70px', sm: '80px', md: '90px' },
    }}>
      {/* 📱 AppBar mobile pour la navigation */}
      {isMobile && (
        <AppBar 
          position="fixed" // 🎯 Changé en fixed pour un meilleur espacement
          sx={{ 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
              🛡️ Admin Dashboard
            </Typography>
            <Chip
              label="ADMIN"
              size="small"
              sx={{
                background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                color: 'white',
                fontWeight: 700,
              }}
            />
          </Toolbar>
        </AppBar>
      )}

      {/* 📱 Menu mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
            🛡️ Navigation Admin
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {user?.firstName} {user?.lastName}
          </Typography>
        </Box>
        <List sx={{ pt: 1 }}>
          {tabs.map((tab, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={activeTab === index}
                onClick={() => handleTabChange({} as React.SyntheticEvent, index)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    background: 'rgba(59, 130, 246, 0.2)',
                    '&:hover': {
                      background: 'rgba(59, 130, 246, 0.3)',
                    },
                  },
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {tab.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={tab.label} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: activeTab === index ? 700 : 500,
                      color: activeTab === index ? '#60a5fa' : 'white',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* 🎯 Espacement principal pour séparer du header */}
      <Box sx={{ 
        height: { xs: '20px', sm: '30px', md: '40px' },
        background: 'transparent',
      }} />

      {/* 🎨 Séparateur visuel élégant */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        mb: { xs: 2, sm: 3, md: 4 },
        px: 2,
      }}>
        <Box sx={{
          width: { xs: '60px', sm: '80px', md: '100px' },
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
          borderRadius: '2px',
          opacity: 0.6,
        }} />
      </Box>

      <Container maxWidth="xl">
        {/* 🎯 En-tête du Dashboard Admin */}
        <Grow in={true} timeout={500}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              mb: 3,
              mt: { xs: 2, sm: 3, md: 4 }, // 🎯 Espacement supplémentaire en haut
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
                zIndex: 1,
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                gap: 2
              }}>
                <Box>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      background: 'linear-gradient(45deg, #60a5fa, #34d399)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    🛡️ Dashboard Administrateur
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                    Bienvenue, {user.firstName} {user.lastName} | Gestion complète de la plateforme
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label="ADMIN"
                    color="error"
                    variant="filled"
                    icon={<SecurityIcon />}
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                    }}
                  />
                  <Chip
                    label="En ligne"
                    color="success"
                    variant="outlined"
                    icon={<CheckCircleIcon />}
                    sx={{
                      fontWeight: 600,
                      borderColor: '#10b981',
                      color: '#10b981',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grow>

        {/* 📊 Statistiques Rapides */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in={true} timeout={600 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    background: stat.gradient,
                    color: 'white',
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8],
                    },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{
                        p: 1.5,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {React.cloneElement(stat.icon, { sx: { fontSize: 24, color: 'white' } })}
                      </Box>
                      <Chip
                        label={stat.change}
                        size="small"
                        sx={{
                          background: stat.changeType === 'positive' ? 'rgba(16, 185, 129, 0.2)' :
                                   stat.changeType === 'negative' ? 'rgba(239, 68, 68, 0.2)' :
                                   'rgba(59, 130, 246, 0.2)',
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                        }}
                      />
                    </Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 800, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                      {stat.title}
                    </Typography>
                  </CardContent>
                  <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 1,
                  }} />
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* 🎛️ Navigation par Onglets */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: theme.shadows[2],
          }}
        >
          <Box sx={{
            borderBottom: 1,
            borderColor: 'divider',
            background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
          }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  minHeight: { xs: 56, md: 64 },
                  fontSize: { xs: '0.8rem', md: '0.9rem' },
                  fontWeight: 600,
                  textTransform: 'none',
                  color: '#64748b',
                  '&.Mui-selected': {
                    color: '#1e293b',
                    fontWeight: 700,
                  },
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)',
                }
              }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  sx={{
                    minWidth: { xs: 'auto', md: 120 },
                    px: { xs: 1, md: 2 },
                  }}
                />
              ))}
            </Tabs>
          </Box>

          {/* 📱 Contenu des Onglets */}
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={activeTab} index={index}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : (
                tab.component
              )}
            </TabPanel>
          ))}
        </Paper>

        {/* 📝 Informations de Session */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mt: 4,
            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
            borderRadius: 3,
            border: '1px solid #e2e8f0',
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: 500 }}>
            🚀 Session administrateur active | Dernière connexion : {new Date().toLocaleString('fr-FR')} |
            IP : 192.168.1.1 | Navigateur : Chrome 120.0
          </Typography>
        </Paper>

        {/* 🔗 Navigation de retour */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              mb: { xs: 2, md: 0 },
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            ← Retour à l'accueil
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/profile')}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1d4ed8, #000000)',
              }
            }}
          >
            Voir mon profil
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 