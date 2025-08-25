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
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  CheckCircle as ResolveIcon,
  Warning as WarningIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Report as ReportIcon,
  PriorityHigh as PriorityHighIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

interface Report {
  id: string;
  type: 'SPAM' | 'INAPPROPRIATE' | 'FRAUD' | 'DUPLICATE' | 'OTHER';
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reporter: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reportedItem: {
    type: 'CAMPAIGN' | 'USER' | 'COMMENT' | 'DONATION';
    id: string;
    title: string;
    description: string;
  };
  reason: string;
  evidence?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
  resolutionDate?: string;
}

const AdminReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionDialog, setActionDialog] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [resolutionText, setResolutionText] = useState('');

  // 🎯 Données de démonstration (à remplacer par l'API)
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: '1',
        type: 'FRAUD',
        status: 'PENDING',
        priority: 'URGENT',
        reporter: {
          id: '1',
          firstName: 'Alice',
          lastName: 'Martin',
          email: 'alice.martin@email.com',
        },
        reportedItem: {
          type: 'CAMPAIGN',
          id: '1',
          title: 'Aide médicale pour Sarah',
          description: 'Collecte de fonds pour les frais médicaux',
        },
        reason: 'Suspicion de fraude - informations médicales non vérifiées',
        evidence: 'Photos et documents suspects',
        createdAt: '2024-01-20T09:00:00Z',
        updatedAt: '2024-01-20T09:00:00Z',
      },
      {
        id: '2',
        type: 'INAPPROPRIATE',
        status: 'INVESTIGATING',
        priority: 'HIGH',
        reporter: {
          id: '2',
          firstName: 'Bob',
          lastName: 'Dubois',
          email: 'bob.dubois@email.com',
        },
        reportedItem: {
          type: 'USER',
          id: '3',
          title: 'Jean Bernard',
          description: 'Utilisateur signalé',
        },
        reason: 'Contenu inapproprié dans les commentaires',
        evidence: 'Screenshots des commentaires',
        createdAt: '2024-01-19T14:30:00Z',
        updatedAt: '2024-01-20T10:15:00Z',
        assignedTo: 'admin-1',
      },
      {
        id: '3',
        type: 'SPAM',
        status: 'RESOLVED',
        priority: 'LOW',
        reporter: {
          id: '3',
          firstName: 'Claire',
          lastName: 'Leroy',
          email: 'claire.leroy@email.com',
        },
        reportedItem: {
          type: 'CAMPAIGN',
          id: '5',
          title: 'Festival culturel',
          description: 'Organisation d\'un festival',
        },
        reason: 'Campagne de spam répétitive',
        evidence: 'Historique des campagnes',
        createdAt: '2024-01-18T16:45:00Z',
        updatedAt: '2024-01-19T11:20:00Z',
        assignedTo: 'admin-1',
        resolution: 'Campagne suspendue pour spam',
        resolutionDate: '2024-01-19T11:20:00Z',
      },
      {
        id: '4',
        type: 'DUPLICATE',
        status: 'DISMISSED',
        priority: 'MEDIUM',
        reporter: {
          id: '4',
          firstName: 'David',
          lastName: 'Moreau',
          email: 'david.moreau@email.com',
        },
        reportedItem: {
          type: 'CAMPAIGN',
          id: '2',
          title: 'Rénovation école rurale',
          description: 'Projet de rénovation',
        },
        reason: 'Campagne dupliquée existante',
        evidence: 'Lien vers la campagne originale',
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: '2024-01-18T09:30:00Z',
        assignedTo: 'admin-2',
        resolution: 'Signalement rejeté - pas de duplication',
        resolutionDate: '2024-01-18T09:30:00Z',
      },
      {
        id: '5',
        type: 'OTHER',
        status: 'PENDING',
        priority: 'MEDIUM',
        reporter: {
          id: '5',
          firstName: 'Emma',
          lastName: 'Bernard',
          email: 'emma.bernard@email.com',
        },
        reportedItem: {
          type: 'COMMENT',
          id: '10',
          title: 'Commentaire sur campagne',
          description: 'Commentaire inapproprié',
        },
        reason: 'Commentaire offensant envers d\'autres utilisateurs',
        evidence: 'Texte du commentaire',
        createdAt: '2024-01-20T11:00:00Z',
        updatedAt: '2024-01-20T11:00:00Z',
      },
    ];

    setReports(mockReports);
    setFilteredReports(mockReports);
    setLoading(false);
  }, []);

  // 🔍 Filtrage des signalements
  useEffect(() => {
    let filtered = reports;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reporter.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Filtre par type
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(report => report.type === typeFilter);
    }

    // Filtre par priorité
    if (priorityFilter !== 'ALL') {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    setFilteredReports(filtered);
    setPage(0);
  }, [reports, searchTerm, statusFilter, typeFilter, priorityFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleTypeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeFilter(event.target.value);
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

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, report: Report) => {
    setAnchorEl(event.currentTarget);
    setSelectedReport(report);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedReport(null);
  };

  const openActionDialog = (action: string) => {
    setActionDialog(action);
    handleActionClose();
  };

  const closeActionDialog = () => {
    setActionDialog(null);
    setSelectedReport(null);
    setResolutionText('');
  };

  const executeAction = async (action: string) => {
    if (!selectedReport) return;

    setLoading(true);
    
    try {
      // 🎯 Ici, vous appellerez l'API pour exécuter l'action
      console.log(`Exécution de l'action: ${action} sur le signalement:`, selectedReport.id);
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'état local
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === selectedReport.id 
            ? { 
                ...report, 
                status: action === 'RESOLVE' ? 'RESOLVED' : 
                        action === 'DISMISS' ? 'DISMISSED' : 
                        action === 'INVESTIGATE' ? 'INVESTIGATING' : report.status,
                resolution: action === 'RESOLVE' ? resolutionText : report.resolution,
                resolutionDate: action === 'RESOLVE' ? new Date().toISOString() : report.resolutionDate,
                updatedAt: new Date().toISOString()
              }
            : report
        )
      );
      
      closeActionDialog();
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'action:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'success';
      case 'PENDING': return 'warning';
      case 'INVESTIGATING': return 'info';
      case 'DISMISSED': return 'default';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FRAUD': return 'error';
      case 'INAPPROPRIATE': return 'warning';
      case 'SPAM': return 'info';
      case 'DUPLICATE': return 'secondary';
      case 'OTHER': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'URGENT': return <PriorityHighIcon />;
      case 'HIGH': return <PriorityHighIcon />;
      default: return null;
    }
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

  const getStatusCount = (status: string) => {
    return reports.filter(report => report.status === status).length;
  };

  const getPriorityCount = (priority: string) => {
    return reports.filter(report => report.priority === priority).length;
  };

  return (
    <Box>
      {/* 🎯 En-tête avec actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          🚨 Gestion des Signalements
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
                {getStatusCount('PENDING')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                En attente
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#3b82f6', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {getStatusCount('INVESTIGATING')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                En cours d'enquête
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#ef4444', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {getPriorityCount('URGENT') + getPriorityCount('HIGH')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Priorité élevée
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#10b981', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                {getStatusCount('RESOLVED')}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Résolus
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🔍 Filtres et recherche */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Rechercher un signalement"
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
            <MenuItem value="INVESTIGATING">En enquête</MenuItem>
            <MenuItem value="RESOLVED">Résolus</MenuItem>
            <MenuItem value="DISMISSED">Rejetés</MenuItem>
          </TextField>

          <TextField
            select
            label="Type"
            value={typeFilter}
            onChange={handleTypeFilterChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="ALL">Tous</MenuItem>
            <MenuItem value="FRAUD">Fraude</MenuItem>
            <MenuItem value="INAPPROPRIATE">Inapproprié</MenuItem>
            <MenuItem value="SPAM">Spam</MenuItem>
            <MenuItem value="DUPLICATE">Duplication</MenuItem>
            <MenuItem value="OTHER">Autre</MenuItem>
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
            <MenuItem value="URGENT">Urgente</MenuItem>
            <MenuItem value="HIGH">Haute</MenuItem>
            <MenuItem value="MEDIUM">Moyenne</MenuItem>
            <MenuItem value="LOW">Basse</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* 📊 Statistiques des filtres */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredReports.length} signalement(s) trouvé(s) sur {reports.length} total
        </Typography>
      </Box>

      {/* 📋 Tableau des signalements */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Signalement</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Priorité</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Signaleur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Élément signalé</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report) => (
                  <TableRow key={report.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          #{report.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                          {report.reason.length > 60 
                            ? `${report.reason.substring(0, 60)}...` 
                            : report.reason}
                        </Typography>
                        {report.evidence && (
                          <Chip 
                            label="Preuves" 
                            size="small" 
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.type}
                        color={getTypeColor(report.type) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getPriorityIcon(report.priority)}
                        <Chip
                          label={report.priority}
                          color={getPriorityColor(report.priority) as any}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        color={getStatusColor(report.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          {report.reporter.firstName.charAt(0)}{report.reporter.lastName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {report.reporter.firstName} {report.reporter.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {report.reporter.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {report.reportedItem.title}
                        </Typography>
                        <Chip 
                          label={report.reportedItem.type} 
                          size="small" 
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(report.createdAt)}
                      </Typography>
                      {report.updatedAt !== report.createdAt && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          Modifié: {formatDate(report.updatedAt)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionClick(e, report)}
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
          count={filteredReports.length}
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
        <MenuItem onClick={() => openActionDialog('VIEW')}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Voir le signalement</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openActionDialog('INVESTIGATE')}>
          <ListItemIcon>
            <ScheduleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Enquêter</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openActionDialog('RESOLVE')}>
          <ListItemIcon>
            <ResolveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Résoudre</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openActionDialog('DISMISS')}>
          <ListItemIcon>
            <WarningIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rejeter</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openActionDialog('BLOCK')}>
          <ListItemIcon>
            <BlockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Bloquer l'élément</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openActionDialog('DELETE')} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>

      {/* 🚨 Dialog de confirmation des actions */}
      <Dialog open={Boolean(actionDialog)} onClose={closeActionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionDialog === 'RESOLVE' && 'Résoudre le signalement'}
          {actionDialog === 'DISMISS' && 'Rejeter le signalement'}
          {actionDialog === 'INVESTIGATE' && 'Commencer l\'enquête'}
          {actionDialog === 'BLOCK' && 'Bloquer l\'élément signalé'}
          {actionDialog === 'DELETE' && 'Supprimer le signalement'}
          {actionDialog === 'VIEW' && 'Voir le signalement'}
        </DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Êtes-vous sûr de vouloir {actionDialog === 'RESOLVE' ? 'résoudre' : 
                  actionDialog === 'DISMISS' ? 'rejeter' : 
                  actionDialog === 'INVESTIGATE' ? 'enquêter sur' : 
                  actionDialog === 'BLOCK' ? 'bloquer' : 
                  actionDialog === 'DELETE' ? 'supprimer' : 'voir'} le signalement :
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Signalement #{selectedReport.id}</strong><br />
                Type: {selectedReport.type} | Priorité: {selectedReport.priority}<br />
                Raison: {selectedReport.reason}<br />
                Élément: {selectedReport.reportedItem.title}
              </Alert>
              
              {actionDialog === 'RESOLVE' && (
                <TextField
                  fullWidth
                  label="Résolution"
                  multiline
                  rows={3}
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  placeholder="Décrivez comment le signalement a été résolu..."
                  sx={{ mt: 2 }}
                />
              )}
              
              {actionDialog === 'DELETE' && (
                <Alert severity="warning">
                  ⚠️ Cette action est irréversible et supprimera définitivement le signalement.
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
            color={actionDialog === 'DELETE' ? 'error' : 'primary'}
            disabled={loading || (actionDialog === 'RESOLVE' && !resolutionText.trim())}
          >
            {loading ? <CircularProgress size={20} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminReportsManagement; 