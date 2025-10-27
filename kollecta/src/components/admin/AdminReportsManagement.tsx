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
import { reportsService, Report, ReportsResponse, ReportAnalysis } from '../../features/reports/reportsService';
import { reportActionsService, ReportActionData } from '../../features/reports/reportActionsService';
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

// Interface Report est maintenant importée du service

const AdminReportsManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionDialog, setActionDialog] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [resolutionText, setResolutionText] = useState('');
  const [cagnotteAction, setCagnotteAction] = useState<'NONE' | 'SUSPEND' | 'DELETE'>('NONE');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    resolved: 0,
    dismissed: 0
  });
  const [totalReports, setTotalReports] = useState(0);

  // Charger les signalements depuis l'API
  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await reportsService.getReports({
        page: page + 1,
        limit: rowsPerPage,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchTerm || undefined,
      });

      if (response.success) {
        setReports(response.data.reports);
        setFilteredReports(response.data.reports);
        setStats(response.data.stats);
        setTotalReports(response.data.pagination.total);
      } else {
        console.error('Erreur lors du chargement des signalements');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des signalements:', error);
    } finally {
    setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [page, rowsPerPage, statusFilter, typeFilter, searchTerm]);

  // Les filtres sont maintenant gérés côté serveur

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleTypeFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeFilter(event.target.value);
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
    // Ne pas remettre selectedReport à null ici car on en a besoin pour le dialog
  };

  const openActionDialog = (action: string) => {
    setActionDialog(action);
    handleActionClose();
  };

  const closeActionDialog = () => {
    setActionDialog(null);
    setSelectedReport(null);
    setResolutionText('');
    setCagnotteAction('NONE');
  };

  const executeAction = async (action: string) => {
    if (!selectedReport) return;

    // Pour l'action VIEW, on affiche juste les détails sans appel API
    if (action === 'VIEW') {
      closeActionDialog();
      return;
    }

    setLoading(true);
    
    try {
      let response;
      const adminNotes = resolutionText || undefined;

      switch (action) {
        case 'INVESTIGATE':
          response = await reportActionsService.investigateReport(selectedReport.id, adminNotes);
          break;
        case 'RESOLVE':
          response = await reportActionsService.resolveReport(selectedReport.id, adminNotes, cagnotteAction);
          break;
        case 'DISMISS':
          response = await reportActionsService.rejectReport(selectedReport.id, adminNotes);
          break;
        case 'BLOCK':
          response = await reportActionsService.blockCagnotte(selectedReport.id, adminNotes);
          break;
        case 'DELETE':
          response = await reportActionsService.deleteReport(selectedReport.id, adminNotes);
          break;
        default:
          throw new Error('Action non reconnue');
      }

      if (response.success) {
        // Recharger les signalements
        await loadReports();
        closeActionDialog();
        alert(`✅ ${response.message}`);
      } else {
        throw new Error(response.message || 'Erreur lors de l\'exécution de l\'action');
      }
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'action:', error);
      console.error('Détails de l\'erreur:', {
        action,
        reportId: selectedReport?.id,
        error: error instanceof Error ? error.message : error
      });
      
      // Améliorer l'affichage des erreurs
      let errorMessage = 'Erreur inconnue';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Messages d'erreur plus spécifiques
        if (errorMessage.includes('401')) {
          errorMessage = 'Non autorisé - Vérifiez vos droits administrateur';
        } else if (errorMessage.includes('403')) {
          errorMessage = 'Accès refusé - Droits insuffisants';
        } else if (errorMessage.includes('404')) {
          errorMessage = 'Signalement non trouvé';
        } else if (errorMessage.includes('500')) {
          errorMessage = 'Erreur serveur - Contactez le support';
        }
      }
      
      alert(`❌ Erreur: ${errorMessage}`);
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
    switch (status) {
      case 'PENDING': return stats.pending;
      case 'INVESTIGATING': return stats.underReview;
      case 'RESOLVED': return stats.resolved;
      case 'DISMISSED': return stats.dismissed;
      default: return 0;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FRAUD': return 'error';
      case 'INAPPROPRIATE': return 'warning';
      case 'SPAM': return 'info';
      case 'DUPLICATE': return 'secondary';
      case 'COMMENT': return 'default';
      case 'OTHER': return 'primary';
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
          onClick={loadReports}
          disabled={loading}
        >
          Actualiser
        </Button>
      </Box>

      {/* 📋 Guide des actions */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          📋 Guide des Actions sur les Signalements
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                🕒 ENQUÊTER
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Statut signalement:</strong> PENDING → UNDER_REVIEW
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Impact cagnotte:</strong> <span style={{color: 'green'}}>AUCUN - Reste ACTIVE</span>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Commence une investigation approfondie
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="success.main" sx={{ mb: 1, fontWeight: 600 }}>
                ✔️ RÉSOUDRE
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Statut signalement:</strong> → RESOLVED
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Impact cagnotte:</strong> <span style={{color: 'orange'}}>CONFIGURABLE</span>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Clôture avec action sur la cagnotte
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="warning.main" sx={{ mb: 1, fontWeight: 600 }}>
                ⚠️ REJETER
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Statut signalement:</strong> → DISMISSED
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Impact cagnotte:</strong> <span style={{color: 'green'}}>AUCUN - Reste ACTIVE</span>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Signalement non fondé
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="error.main" sx={{ mb: 1, fontWeight: 600 }}>
                🚫 BLOQUER
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Statut signalement:</strong> → RESOLVED
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Impact cagnotte:</strong> <span style={{color: 'red'}}>BLOQUÉE/SUSPENDUE</span>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Action immédiate de protection
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

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
                {stats.pending + stats.underReview}
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
            <MenuItem value="COMMENT">Commentaire</MenuItem>
            <MenuItem value="OTHER">Autre</MenuItem>
          </TextField>


        </Box>
      </Paper>

      {/* 📊 Statistiques des filtres */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredReports.length} signalement(s) trouvé(s) sur {totalReports} total
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
                <TableCell sx={{ fontWeight: 600 }}>Cagnotte signalée</TableCell>
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
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.analysis?.type || 'N/A'}
                        color={getTypeColor(report.analysis?.type || 'OTHER') as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                        <Chip
                          label={report.analysis?.priority || 'N/A'}
                          color={getPriorityColor(report.analysis?.priority || 'MEDIUM') as any}
                          size="small"
                          variant="outlined"
                        />
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
                          {report.reporterName.split(' ').map(n => n.charAt(0)).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {report.reporterName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {report.reporterEmail}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {report.cagnotte.title}
                        </Typography>
                        <Chip 
                          label="CAGNOTTE" 
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
          count={totalReports}
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
              {actionDialog === 'VIEW' ? (
                // Affichage détaillé pour l'action VIEW
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    📋 Détails du Signalement #{selectedReport.id}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                          📊 Informations Générales
                        </Typography>
                        <Typography variant="body2"><strong>Type:</strong> {selectedReport.analysis?.type || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>Priorité:</strong> {selectedReport.analysis?.priority || 'N/A'}</Typography>
                        <Typography variant="body2"><strong>Statut:</strong> {selectedReport.status}</Typography>
                        <Typography variant="body2"><strong>Date:</strong> {formatDate(selectedReport.createdAt)}</Typography>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                          👤 Signaleur
                        </Typography>
                        <Typography variant="body2"><strong>Nom:</strong> {selectedReport.reporterName}</Typography>
                        <Typography variant="body2"><strong>Email:</strong> {selectedReport.reporterEmail}</Typography>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                          🎯 Cagnotte Signalée
                        </Typography>
                        <Typography variant="body2"><strong>Titre:</strong> {selectedReport.cagnotte.title}</Typography>
                        <Typography variant="body2"><strong>Description:</strong> {selectedReport.cagnotte.description}</Typography>
                        <Typography variant="body2"><strong>Créateur:</strong> {selectedReport.cagnotte.creator.firstName} {selectedReport.cagnotte.creator.lastName}</Typography>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Card variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                          📝 Raison du Signalement
                        </Typography>
                        <Typography variant="body2">{selectedReport.reason}</Typography>
                        {selectedReport.description && (
                          <>
                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Description détaillée:</Typography>
                            <Typography variant="body2">{selectedReport.description}</Typography>
                          </>
                        )}
                      </Card>
                    </Grid>
                    
                    {selectedReport.adminNotes && (
                      <Grid item xs={12}>
                        <Card variant="outlined" sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                          <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                            📋 Notes Administrateur
                          </Typography>
                          <Typography variant="body2">{selectedReport.adminNotes}</Typography>
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              ) : (
                // Affichage pour les autres actions
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
                    Type: {selectedReport.analysis?.type || 'N/A'} | Statut: {selectedReport.status}<br />
                    Raison: {selectedReport.reason}<br />
                    Cagnotte: {selectedReport.cagnotte.title}
                  </Alert>

                  {/* Impact sur la cagnotte selon l'action */}
                  {actionDialog === 'INVESTIGATE' && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <strong>🕒 Impact de l'enquête :</strong><br />
                      • Le signalement passera en statut "En cours d'enquête"<br />
                      • <strong>La cagnotte reste ACTIVE</strong> pendant l'investigation<br />
                      • Aucune action n'est prise sur la cagnotte pour le moment
                    </Alert>
                  )}

                  {actionDialog === 'RESOLVE' && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      <strong>✔️ Impact de la résolution :</strong><br />
                      • Le signalement sera marqué comme "Résolu"<br />
                      • <strong>Action sur la cagnotte :</strong> Vous pouvez choisir de ne rien faire, suspendre ou supprimer la cagnotte<br />
                      • Cette action clôture définitivement le signalement
                    </Alert>
                  )}

                  {actionDialog === 'DISMISS' && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      <strong>⚠️ Impact du rejet :</strong><br />
                      • Le signalement sera marqué comme "Rejeté"<br />
                      • <strong>La cagnotte reste ACTIVE</strong> - le signalement était non fondé<br />
                      • Le créateur de la cagnotte sera notifié de l'approbation
                    </Alert>
                  )}

                  {actionDialog === 'BLOCK' && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <strong>🚫 Impact du blocage :</strong><br />
                      • Le signalement sera marqué comme "Résolu"<br />
                      • <strong>La cagnotte sera BLOQUÉE/SUSPENDUE</strong> immédiatement<br />
                      • Action de protection pour les utilisateurs
                    </Alert>
                  )}

                  {actionDialog === 'DELETE' && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <strong>🗑️ Impact de la suppression :</strong><br />
                      • Le signalement sera définitivement supprimé<br />
                      • <strong>Aucun impact sur la cagnotte</strong><br />
                      • Cette action est irréversible
                    </Alert>
                  )}
                  
                  {(actionDialog === 'RESOLVE' || actionDialog === 'DISMISS' || actionDialog === 'INVESTIGATE' || actionDialog === 'BLOCK') && (
                    <TextField
                      fullWidth
                      label={
                        actionDialog === 'RESOLVE' ? 'Résolution' :
                        actionDialog === 'DISMISS' ? 'Raison du rejet' :
                        actionDialog === 'INVESTIGATE' ? 'Notes d\'enquête' :
                        actionDialog === 'BLOCK' ? 'Raison du blocage' : 'Notes'
                      }
                      multiline
                      rows={3}
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder={
                        actionDialog === 'RESOLVE' ? 'Décrivez comment le signalement a été résolu...' :
                        actionDialog === 'DISMISS' ? 'Expliquez pourquoi le signalement est rejeté...' :
                        actionDialog === 'INVESTIGATE' ? 'Ajoutez des notes pour l\'enquête...' :
                        actionDialog === 'BLOCK' ? 'Expliquez pourquoi la cagnotte est bloquée...' : 'Ajoutez des notes...'
                      }
                      sx={{ mt: 2 }}
                    />
                  )}

                  {/* Sélecteur d'action pour la cagnotte (uniquement pour RESOLVE) */}
                  {actionDialog === 'RESOLVE' && (
                    <TextField
                      select
                      fullWidth
                      label="Action sur la cagnotte"
                      value={cagnotteAction}
                      onChange={(e) => setCagnotteAction(e.target.value as 'NONE' | 'SUSPEND' | 'DELETE')}
                      sx={{ mt: 2 }}
                    >
                      <MenuItem value="NONE">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>✅ Aucune action</Typography>
                          <Typography variant="caption" color="text.secondary">
                            La cagnotte reste active
                          </Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="SUSPEND">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>⏸️ Suspendre</Typography>
                          <Typography variant="caption" color="text.secondary">
                            La cagnotte sera temporairement suspendue
                          </Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="DELETE">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>🗑️ Supprimer</Typography>
                          <Typography variant="caption" color="text.secondary">
                            La cagnotte sera définitivement supprimée
                          </Typography>
                        </Box>
                      </MenuItem>
                    </TextField>
                  )}
                  
                  {actionDialog === 'DELETE' && (
                    <Alert severity="warning">
                      ⚠️ Cette action est irréversible et supprimera définitivement le signalement.
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeActionDialog}>
            {actionDialog === 'VIEW' ? 'Fermer' : 'Annuler'}
          </Button>
          {actionDialog !== 'VIEW' && (
            <Button
              onClick={() => executeAction(actionDialog!)}
              variant="contained"
              color={actionDialog === 'DELETE' ? 'error' : 'primary'}
              disabled={loading || (actionDialog === 'RESOLVE' && !resolutionText.trim())}
            >
              {loading ? <CircularProgress size={20} /> : 'Confirmer'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminReportsManagement; 