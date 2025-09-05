import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Euro as EuroIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import EditCagnotteModal from './EditCagnotteModal';

interface Campaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
  category: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  imageUrl?: string;
  reports: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

const AdminCampaignsManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [actionDialog, setActionDialog] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [suspensionReason, setSuspensionReason] = useState('');

  // Charger les cagnottes en attente depuis l'API
  useEffect(() => {
    loadPendingCampaigns();
  }, []);

  const loadPendingCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/cagnottes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des cagnottes');
      }

      const result = await response.json();
      const campaignsData = result.data || [];
      
      // Convertir le format des cagnottes vers le format attendu
      const formattedCampaigns: Campaign[] = campaignsData.map((cagnotte: any) => ({
        id: cagnotte.id,
        title: cagnotte.title,
        description: cagnotte.description,
        targetAmount: cagnotte.goalAmount,
        currentAmount: cagnotte.currentAmount,
        status: cagnotte.status,
        category: cagnotte.category?.name || 'Non définie',
        creator: {
          id: cagnotte.creator.id,
          firstName: cagnotte.creator.firstName,
          lastName: cagnotte.creator.lastName,
          email: cagnotte.creator.email,
          profilePicture: cagnotte.creator.profilePicture
        },
        createdAt: cagnotte.createdAt,
        updatedAt: cagnotte.updatedAt,
        deadline: cagnotte.endDate,
        imageUrl: cagnotte.coverImage,
        reports: 0, // Pas encore implémenté
        priority: 'MEDIUM' // Par défaut
      }));

      setCampaigns(formattedCampaigns);
      setFilteredCampaigns(formattedCampaigns);
    } catch (error) {
      console.error('Erreur lors du chargement des cagnottes:', error);
    } finally {
      setLoading(false);
    }
  };



  // 🔍 Filtrage des cagnottes
  useEffect(() => {
    let filtered = campaigns;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.creator.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.creator.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    // Filtre par catégorie
    if (categoryFilter !== 'ALL') {
      filtered = filtered.filter(campaign => campaign.category === categoryFilter);
    }

    // Filtre par priorité
    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(campaign => campaign.priority === priorityFilter);
    }

    setFilteredCampaigns(filtered);
    setPage(0);
  }, [campaigns, searchTerm, statusFilter, categoryFilter, priorityFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleCategoryFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryFilter(event.target.value);
  };

  const handlePriorityFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriorityFilter(event.target.value);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, campaign: Campaign) => {
    setAnchorEl(event.currentTarget);
    setSelectedCampaign(campaign);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
  };

  const openActionDialog = (action: string) => {
    setActionDialog(action);
    handleActionClose();
  };

  const closeActionDialog = () => {
    setActionDialog(null);
    setSelectedCampaign(null);
    setRejectionReason('');
    setSuspensionReason('');
  };

  const executeAction = async (action: string) => {
    if (!selectedCampaign) return;

    // Validation supplémentaire
    if (action === 'REJECT' && !rejectionReason.trim()) {
      alert('Veuillez saisir une raison de rejet');
      return;
    }
    
    if (action === 'SUSPEND' && !suspensionReason.trim()) {
      alert('Veuillez saisir une raison de suspension');
      return;
    }

    setLoading(true);
    
    try {
      let response;
      
      if (action === 'APPROVE') {
        response = await fetch(`/api/admin/cagnottes/${selectedCampaign.id}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else if (action === 'REJECT') {
        console.log('Rejet cagnotte:', {
          id: selectedCampaign.id,
          reason: rejectionReason,
          token: localStorage.getItem('token') ? 'Présent' : 'Absent'
        });
        
        response = await fetch(`/api/admin/cagnottes/${selectedCampaign.id}/reject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            reason: rejectionReason
          })
        });
      } else if (action === 'SUSPEND') {
        response = await fetch(`/api/admin/cagnottes/${selectedCampaign.id}/suspend`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reason: suspensionReason })
        });
      } else if (action === 'DELETE') {
        response = await fetch(`/api/admin/cagnottes/${selectedCampaign.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }

      if (response && !response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
        throw new Error(`Erreur ${response.status}: ${errorData.message || `Erreur lors de l'action ${action}`}`);
      }

      // Recharger les cagnottes après l'action
      await loadPendingCampaigns();
      
      closeActionDialog();
      
      // Afficher un message de succès
      const actionMessages = {
        'APPROVE': 'approuvée',
        'REJECT': 'rejetée',
        'SUSPEND': 'suspendue',
        'DELETE': 'supprimée'
      };
      
      if (actionMessages[action as keyof typeof actionMessages]) {
        alert(`Cagnotte ${actionMessages[action as keyof typeof actionMessages]} avec succès !`);
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'action:', error);
      alert(`Erreur lors de l'action ${action}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'error';
      case 'ACTIVE': return 'info';
      case 'COMPLETED': return 'success';
      case 'SUSPENDED': return 'warning';
      default: return 'default';
    }
  };

  // Déterminer les actions disponibles selon le statut
  const getAvailableActions = (status: string) => {
    switch (status) {
      case 'PENDING':
        return ['APPROVE', 'REJECT', 'SUSPEND', 'DELETE'];
      case 'SUSPENDED':
        return ['APPROVE', 'REJECT', 'SUSPEND', 'DELETE'];
      case 'ACTIVE':
        return ['SUSPEND', 'DELETE'];
      case 'REJECTED':
        return ['DELETE'];
      case 'COMPLETED':
        return ['DELETE'];
      default:
        return ['DELETE'];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Box>
      {/* 🎯 En-tête avec actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          🎯 Gestion des Cagnottes
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
        >
          Actualiser
        </Button>
      </Box>

      {/* 📊 Statistiques rapides */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f59e0b', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {campaigns.filter(c => c.status === 'PENDING').length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                En attente de validation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#10b981', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {campaigns.filter(c => c.status === 'ACTIVE').length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Cagnottes actives
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ef4444', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {campaigns.filter(c => c.reports > 0).length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Signalements en cours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#3b82f6', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {campaigns.filter(c => c.status === 'COMPLETED').length}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Cagnottes terminées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🔍 Filtres et recherche */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Rechercher une cagnotte"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 250 }}
          />
          
          <TextField
            select
            label="Statut"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="ALL">Tous</MenuItem>
            <MenuItem value="PENDING">En attente</MenuItem>
            <MenuItem value="APPROVED">Approuvées</MenuItem>
            <MenuItem value="REJECTED">Rejetées</MenuItem>
            <MenuItem value="ACTIVE">Actives</MenuItem>
            <MenuItem value="COMPLETED">Terminées</MenuItem>
            <MenuItem value="SUSPENDED">Suspendues</MenuItem>
          </TextField>

          <TextField
            select
            label="Catégorie"
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="ALL">Toutes</MenuItem>
            <MenuItem value="Santé">Santé</MenuItem>
            <MenuItem value="Éducation">Éducation</MenuItem>
            <MenuItem value="Environnement">Environnement</MenuItem>
            <MenuItem value="Solidarité">Solidarité</MenuItem>
            <MenuItem value="Culture">Culture</MenuItem>
          </TextField>

          <TextField
            select
            label="Priorité"
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="ALL">Toutes</MenuItem>
            <MenuItem value="HIGH">Haute</MenuItem>
            <MenuItem value="MEDIUM">Moyenne</MenuItem>
            <MenuItem value="LOW">Basse</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* 📊 Statistiques des filtres */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredCampaigns.length} cagnotte(s) trouvée(s) sur {campaigns.length} total
        </Typography>
      </Box>

      {/* 📋 Tableau des cagnottes */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Cagnotte</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Créateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Objectif</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Progression</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Priorité</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Signalements</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCampaigns
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((campaign) => (
                  <TableRow key={campaign.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: 2,
                            bgcolor: campaign.imageUrl ? 'transparent' : '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          {campaign.imageUrl ? (
                            <img 
                              src={campaign.imageUrl} 
                              alt="Campaign" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                              🎯
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {campaign.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                            {campaign.description.length > 60 
                              ? `${campaign.description.substring(0, 60)}...` 
                              : campaign.description}
                          </Typography>
                          <Chip 
                            label={campaign.category} 
                            size="small" 
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {campaign.creator.profilePicture ? (
                            <img 
                              src={campaign.creator.profilePicture} 
                              alt="Profile" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            `${campaign.creator.firstName.charAt(0)}${campaign.creator.lastName.charAt(0)}`
                          )}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {campaign.creator.firstName} {campaign.creator.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {campaign.creator.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatCurrency(campaign.targetAmount)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Échéance: {campaign.deadline ? formatDate(campaign.deadline) : 'Non définie'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 60, bgcolor: '#e2e8f0', borderRadius: 1, overflow: 'hidden' }}>
                          <Box
                            sx={{
                              width: `${getProgressPercentage(campaign.currentAmount, campaign.targetAmount)}%`,
                              height: 8,
                              bgcolor: '#10b981',
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', minWidth: 45 }}>
                          {getProgressPercentage(campaign.currentAmount, campaign.targetAmount).toFixed(0)}%
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {formatCurrency(campaign.currentAmount)} / {formatCurrency(campaign.targetAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={campaign.status}
                        color={getStatusColor(campaign.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={campaign.priority}
                        color={getPriorityColor(campaign.priority) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ textAlign: 'center' }}>
                        {campaign.reports > 0 ? (
                          <Chip
                            label={campaign.reports}
                            color="error"
                            size="small"
                            icon={<WarningIcon />}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionClick(e, campaign)}
                        >
                          <MoreIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 📄 Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredCampaigns.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      </Paper>

      {/* 🎛️ Menu des actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => {
          if (selectedCampaign) {
            window.open(`/cagnottes/${selectedCampaign.id}`, '_blank');
            handleActionClose();
          }
        }}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voir la cagnotte</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openActionDialog('EDIT')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier</ListItemText>
        </MenuItem>
        {getAvailableActions(selectedCampaign?.status || '').includes('APPROVE') && (
          <MenuItem onClick={() => openActionDialog('APPROVE')}>
            <ListItemIcon>
              <ApproveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Approuver</ListItemText>
          </MenuItem>
        )}
        {getAvailableActions(selectedCampaign?.status || '').includes('REJECT') && (
          <MenuItem onClick={() => openActionDialog('REJECT')}>
            <ListItemIcon>
              <RejectIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rejeter</ListItemText>
          </MenuItem>
        )}
        {getAvailableActions(selectedCampaign?.status || '').includes('SUSPEND') && (
          <MenuItem onClick={() => openActionDialog('SUSPEND')}>
            <ListItemIcon>
              <WarningIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Suspendre</ListItemText>
          </MenuItem>
        )}
        {getAvailableActions(selectedCampaign?.status || '').includes('DELETE') && (
          <MenuItem onClick={() => openActionDialog('DELETE')} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Supprimer</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* 🚨 Dialog de confirmation des actions */}
      <Dialog open={Boolean(actionDialog)} onClose={closeActionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionDialog === 'APPROVE' && (selectedCampaign?.status === 'SUSPENDED' ? 'Réactiver la cagnotte' : 'Approuver la cagnotte')}
          {actionDialog === 'REJECT' && 'Rejeter la cagnotte'}
          {actionDialog === 'SUSPEND' && (selectedCampaign?.status === 'SUSPENDED' ? 'Modifier la suspension' : 'Suspendre la cagnotte')}
          {actionDialog === 'DELETE' && 'Supprimer la cagnotte'}
          {actionDialog === 'EDIT' && 'Modifier la cagnotte'}
        </DialogTitle>
        <DialogContent>
          {selectedCampaign && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Êtes-vous sûr de vouloir {actionDialog === 'APPROVE' ? (selectedCampaign?.status === 'SUSPENDED' ? 'réactiver' : 'approuver') : 
                  actionDialog === 'REJECT' ? 'rejeter' : 
                  actionDialog === 'SUSPEND' ? (selectedCampaign?.status === 'SUSPENDED' ? 'modifier la suspension de' : 'suspendre') : 
                  actionDialog === 'DELETE' ? 'supprimer' : 
                  actionDialog === 'EDIT' ? 'modifier' : ''} la cagnotte :
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>{selectedCampaign.title}</strong><br />
                Créateur: {selectedCampaign.creator.firstName} {selectedCampaign.creator.lastName}<br />
                Objectif: {formatCurrency(selectedCampaign.targetAmount)}<br />
                Statut actuel: {selectedCampaign.status}
              </Alert>
              
              {actionDialog === 'REJECT' && (
                <TextField
                  fullWidth
                  label="Raison du rejet"
                  multiline
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Expliquez pourquoi cette cagnotte est rejetée..."
                  sx={{ mt: 2 }}
                />
              )}
              
              {actionDialog === 'SUSPEND' && (
                <TextField
                  fullWidth
                  label="Raison de la suspension"
                  multiline
                  rows={3}
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="Expliquez pourquoi cette cagnotte est suspendue (signalements, contenu inapproprié, etc.)..."
                  sx={{ mt: 2 }}
                />
              )}
              
              {actionDialog === 'DELETE' && (
                <Alert severity="warning">
                  ⚠️ Cette action est irréversible et supprimera définitivement la cagnotte.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeActionDialog}>Annuler</Button>
          <Button
            onClick={() => executeAction(actionDialog!)}
            variant="contained"
            color={actionDialog === 'DELETE' ? 'error' : 
                   actionDialog === 'REJECT' ? 'error' : 'primary'}
            disabled={loading || (actionDialog === 'REJECT' && !rejectionReason.trim()) || (actionDialog === 'SUSPEND' && !suspensionReason.trim())}
          >
            {loading ? <CircularProgress size={20} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal d'édition */}
      {actionDialog === 'EDIT' && selectedCampaign && (
        <EditCagnotteModal
          cagnotte={selectedCampaign}
          open={actionDialog === 'EDIT'}
          onClose={closeActionDialog}
          onSave={async (updatedCagnotte) => {
            if (!selectedCampaign) return;
            
            try {
              setLoading(true);
              const response = await fetch(`/api/admin/cagnottes/${selectedCampaign.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                  title: updatedCagnotte.title,
                  story: updatedCagnotte.description,
                  goalAmount: updatedCagnotte.targetAmount,
                  category: updatedCagnotte.category
                })
              });

              if (!response.ok) {
                throw new Error('Erreur lors de la modification');
              }

              // Recharger les cagnottes après la modification
              await loadPendingCampaigns();
              closeActionDialog();
              alert('Cagnotte modifiée avec succès !');
            } catch (error) {
              console.error('Erreur lors de la modification:', error);
              alert('Erreur lors de la modification de la cagnotte');
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
    </Box>
  );
};

export default AdminCampaignsManagement; 