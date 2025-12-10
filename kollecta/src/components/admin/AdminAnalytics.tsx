import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import adminService from '../../features/admin/adminService';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Campaign as CampaignIcon,
  Euro as EuroIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

interface AnalyticsData {
  users: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
    growth: number;
  };
  campaigns: {
    total: number;
    active: number;
    pending: number;
    completed: number;
    rejected: number;
    totalAmount: number;
    averageAmount: number;
  };
  reports: {
    total: number;
    pending: number;
    resolved: number;
    urgent: number;
    high: number;
  };
  performance: {
    responseTime: number;
    resolutionRate: number;
    userSatisfaction: number;
    platformUptime: number;
  };
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
    status: string;
  }>;
}

const AdminAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // 📊 Charger les statistiques analytiques depuis l'API
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await adminService.getAnalyticsStats();
        if (response.success) {
          setAnalyticsData(response.data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques analytiques:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !analyticsData) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Chargement des analytics...</Typography>
      </Box>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' DT';
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircleIcon color="success" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'error': return <ErrorIcon color="error" />;
      default: return <ScheduleIcon color="info" />;
    }
  };

  return (
    <Box>
      {/* 🎯 En-tête */}
      <Typography variant="h4" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
        📊 Tableau de Bord - Analytics
      </Typography>

      {/* 📈 Métriques Principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* 👥 Utilisateurs */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#3b82f6', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {formatNumber(analyticsData.users.total)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Utilisateurs totaux
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {analyticsData.users.growth > 0 ? (
                  <TrendingUpIcon sx={{ mr: 0.5, fontSize: 16 }} />
                ) : (
                  <TrendingDownIcon sx={{ mr: 0.5, fontSize: 16 }} />
                )}
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  {analyticsData.users.growth > 0 ? '+' : ''}{analyticsData.users.growth}% ce mois
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 🎯 Cagnottes */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#10b981', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {formatNumber(analyticsData.campaigns.total)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Cagnottes totales
                  </Typography>
                </Box>
                <CampaignIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
                {formatCurrency(analyticsData.campaigns.totalAmount)} collectés
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 💰 Montant Moyen */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f59e0b', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {formatCurrency(analyticsData.campaigns.averageAmount)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Montant moyen collecté
                  </Typography>
                </Box>
                <EuroIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
                Par cagnotte active/terminée
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 🚨 Signalements */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ef4444', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {analyticsData.reports.total}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Signalements
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
              <Typography variant="body2" sx={{ mt: 1, fontSize: '0.875rem' }}>
                {analyticsData.reports.pending} en attente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 📊 Détails des Métriques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* 👥 Détails Utilisateurs */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              👥 Détails des Utilisateurs
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Actifs</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatNumber(analyticsData.users.active)} ({((analyticsData.users.active / analyticsData.users.total) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(analyticsData.users.active / analyticsData.users.total) * 100}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#e2e8f0' }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">En attente</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatNumber(analyticsData.users.pending)} ({((analyticsData.users.pending / analyticsData.users.total) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(analyticsData.users.pending / analyticsData.users.total) * 100}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#f59e0b' }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Suspendus</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatNumber(analyticsData.users.suspended)} ({((analyticsData.users.suspended / analyticsData.users.total) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(analyticsData.users.suspended / analyticsData.users.total) * 100}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#ef4444' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* 🎯 Détails Cagnottes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              🎯 Détails des Cagnottes
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Actives</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatNumber(analyticsData.campaigns.active)} ({((analyticsData.campaigns.active / analyticsData.campaigns.total) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(analyticsData.campaigns.active / analyticsData.campaigns.total) * 100}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#10b981' }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Terminées</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatNumber(analyticsData.campaigns.completed)} ({((analyticsData.campaigns.completed / analyticsData.campaigns.total) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(analyticsData.campaigns.completed / analyticsData.campaigns.total) * 100}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#3b82f6' }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Rejetées</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatNumber(analyticsData.campaigns.rejected)} ({((analyticsData.campaigns.rejected / analyticsData.campaigns.total) * 100).toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(analyticsData.campaigns.rejected / analyticsData.campaigns.total) * 100}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#ef4444' }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 📊 Performance et Catégories */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* 🚀 Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              🚀 Indicateurs de Performance
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Temps de réponse</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {analyticsData.performance.responseTime}h
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((analyticsData.performance.responseTime / 24) * 100, 100)}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#10b981' }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Taux de résolution</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {analyticsData.performance.resolutionRate}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analyticsData.performance.resolutionRate}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#3b82f6' }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Satisfaction utilisateur</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {analyticsData.performance.userSatisfaction}/5
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(analyticsData.performance.userSatisfaction / 5) * 100}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#f59e0b' }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Disponibilité plateforme</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {analyticsData.performance.platformUptime}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={analyticsData.performance.platformUptime}
                sx={{ height: 8, borderRadius: 4, bgcolor: '#10b981' }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* 📂 Top Catégories */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              📂 Top Catégories
            </Typography>
            {analyticsData.topCategories.map((category, index) => (
              <Box key={category.name} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CategoryIcon sx={{ mr: 1, fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="body2">{category.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatNumber(category.count)} ({category.percentage}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={category.percentage}
                  sx={{ height: 6, borderRadius: 3 }}
                />
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* 📝 Activité Récente */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          📝 Activité Récente
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Heure</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analyticsData.recentActivity.map((activity) => (
                <TableRow key={activity.id} hover>
                  <TableCell>
                    <Chip 
                      label={activity.type.replace('_', ' ')} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {activity.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {activity.user}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusIcon(activity.status)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(activity.timestamp)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminAnalytics; 