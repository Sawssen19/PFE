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
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
  Block as BlockIcon,
  CheckCircle as ApproveIcon,
  Warning as WarningIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import UserProfileDialog from './UserProfileDialog';
import UserEditDialog from './UserEditDialog';
import adminService, { User as ApiUser } from '../../features/admin/adminService';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profilePicture?: string;
  profileDescription?: string;
  profileUrl?: string;
  profileVisibility?: string;
  language?: string;
  // 🔐 Informations KYC (sans documents sensibles)
  kycVerification?: {
    verificationStatus: string;
    riskScore: number;
    verificationDate?: string;
    expiryDate?: string;
    rejectionReason?: string;
    createdAt: string;
  };
  amlCheck?: {
    riskLevel: string;
    ofacStatus: boolean;
    unStatus: boolean;
    suspiciousActivity: boolean;
    lastCheckDate: string;
  };
}

const AdminUsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionDialog, setActionDialog] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // 🔄 Fonction pour recharger les utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // 🔐 Récupérer le token d'authentification
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('❌ Utilisateur non connecté');
        return;
      }
      
      const userData = JSON.parse(userStr);
      const token = userData.token;
      
      // 📡 Appel API pour récupérer tous les utilisateurs
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        headers: {
          // 🔐 Temporairement sans authentification pour tester
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const apiUsers = await response.json();
        console.log('✅ Utilisateurs récupérés depuis l\'API:', apiUsers);
        
        // 🔄 Transformer les données de l'API au format attendu
        const transformedUsers: User[] = apiUsers.map((apiUser: any) => ({
          id: apiUser.id,
          email: apiUser.email,
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          role: apiUser.role,
          // 🔐 UTILISER LE VRAI STATUT DE LA BASE DE DONNÉES
          status: apiUser.status || 'PENDING',
          isVerified: apiUser.isVerified,
          createdAt: apiUser.createdAt || new Date().toISOString(),
          lastLogin: apiUser.lastLogin,
          profilePicture: apiUser.profilePicture,
          // 🔐 Inclure les informations KYC
          kycVerification: apiUser.kycVerification,
          amlCheck: apiUser.amlCheck,
        }));
        
        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
      } else {
        console.error('❌ Erreur lors de la récupération des utilisateurs:', response.status);
        // 🚨 Fallback vers les données mockées en cas d'erreur
        loadMockUsers();
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      // 🚨 Fallback vers les données mockées en cas d'erreur
      loadMockUsers();
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Charger les données mockées en fallback
  const loadMockUsers = () => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'sawssen.yazidi@sesame.com.tn',
        firstName: 'Sawssen',
        lastName: 'Yazidi',
        role: 'ADMIN',
        status: 'ACTIVE',
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        lastLogin: '2024-01-20T14:30:00Z',
      },
      {
        id: '2',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        status: 'ACTIVE',
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-16T11:00:00Z',
        updatedAt: '2024-01-19T09:15:00Z',
        lastLogin: '2024-01-19T09:15:00Z',
      },
      {
        id: '3',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        status: 'PENDING',
        isActive: false,
        isVerified: false,
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: '2024-01-17T12:00:00Z',
      },
      {
        id: '4',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'USER',
        status: 'SUSPENDED',
        isActive: false,
        isVerified: true,
        createdAt: '2024-01-18T13:00:00Z',
        updatedAt: '2024-01-18T16:45:00Z',
        lastLogin: '2024-01-18T16:45:00Z',
      },
      {
        id: '5',
        email: 'support@kollecta.com',
        firstName: 'Support',
        lastName: 'Kollecta',
        role: 'SUPPORT',
        status: 'ACTIVE',
        isActive: true,
        isVerified: true,
        createdAt: '2024-01-19T14:00:00Z',
        updatedAt: '2024-01-20T10:20:00Z',
        lastLogin: '2024-01-20T10:20:00Z',
      },
    ];

    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  };

  // 🎯 Récupération des vrais utilisateurs depuis la base de données
  useEffect(() => {
    // 🚀 Charger les vrais utilisateurs
    fetchUsers();
  }, []);

  // 🔍 Filtrage des utilisateurs
  useEffect(() => {
    let filtered = users;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Filtre par rôle
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
    setPage(0);
  }, [users, searchTerm, statusFilter, roleFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatusFilter(event.target.value);
  };

  const handleRoleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoleFilter(event.target.value);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    // Ne pas effacer selectedUser ici car les dialogs en ont besoin
  };

  const openActionDialog = (action: string) => {
    // Fermer seulement le menu, garder selectedUser
    setAnchorEl(null);
    
    if (action === 'VIEW') {
      setProfileDialogOpen(true);
    } else if (action === 'EDIT') {
      setEditDialogOpen(true);
    } else {
      setActionDialog(action);
    }
  };

  const closeActionDialog = () => {
    setActionDialog(null);
    setProfileDialogOpen(false);
    setEditDialogOpen(false);
    setSelectedUser(null); // Effacer selectedUser seulement quand on ferme les dialogs
  };

  const executeAction = async (action: string) => {
    if (!selectedUser) return;

    setLoading(true);
    
    try {
      let updatedUser: User | undefined;
      
      switch (action) {
        case 'APPROVE':
          // 🔐 Utiliser l'approbation KYC au lieu de l'approbation simple
          console.log('🔄 Tentative d\'approbation KYC pour l\'utilisateur:', selectedUser.id);
          updatedUser = await adminService.approveUserKYC(selectedUser.id);
          console.log('✅ Utilisateur approuvé avec succès:', updatedUser);
          setSnackbar({ open: true, message: 'Utilisateur approuvé avec succès (KYC vérifié)', severity: 'success' });
          break;
        case 'SUSPEND':
          console.log('🔄 Tentative de suspension de l\'utilisateur:', selectedUser.id);
          updatedUser = await adminService.suspendUser(selectedUser.id);
          console.log('✅ Utilisateur suspendu avec succès:', updatedUser);
          setSnackbar({ open: true, message: 'Utilisateur suspendu avec succès', severity: 'success' });
          break;
        case 'BLOCK':
          updatedUser = await adminService.blockUser(selectedUser.id);
          setSnackbar({ open: true, message: 'Utilisateur bloqué avec succès', severity: 'success' });
          break;
        case 'DELETE':
          await adminService.deleteUser(selectedUser.id);
          setSnackbar({ open: true, message: 'Utilisateur supprimé avec succès', severity: 'success' });
          // Recharger la liste des utilisateurs
          await fetchUsers();
          break;
        default:
          throw new Error(`Action non supportée: ${action}`);
      }
      
      // Mettre à jour l'état local si l'action a réussi
      if (action !== 'DELETE' && updatedUser) {
        // 🔄 Pour l'approbation KYC, recharger la liste complète pour avoir les données KYC
        if (action === 'APPROVE') {
          await fetchUsers();
        } else {
          setUsers(prevUsers => 
            prevUsers.map(user => 
              user.id === selectedUser.id ? updatedUser : user
            )
          );
          setFilteredUsers(prevUsers => 
            prevUsers.map(user => 
              user.id === selectedUser.id ? updatedUser : user
            )
          );
        }
      }
      
      closeActionDialog();
    } catch (error) {
      console.error('Erreur lors de l\'exécution de l\'action:', error);
      setSnackbar({ 
        open: true, 
        message: `Erreur: ${error instanceof Error ? error.message : 'Action échouée'}`, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  // 💾 Fonction pour sauvegarder les modifications d'un utilisateur
  const handleSaveUser = async (userId: string, data: any) => {
    try {
      setLoading(true);
      console.log('🔄 Sauvegarde des modifications pour l\'utilisateur:', userId, 'Données:', data);
      
      // 🔍 Trouver l'utilisateur actuel pour comparer
      const currentUser = users.find(user => user.id === userId);
      if (!currentUser) {
        throw new Error('Utilisateur non trouvé');
      }
      
      console.log('📊 Utilisateur actuel:', currentUser);
      console.log('📝 Données à sauvegarder:', data);
      
      let updatedUser: User = currentUser; // Initialiser avec l'utilisateur actuel
      
      // 🔄 Traiter seulement les champs qui ont changé
      const hasRoleChanged = data.role && data.role !== currentUser.role;
      const hasStatusChanged = data.status && data.status !== currentUser.status;
      const hasIsActiveChanged = data.isActive !== undefined && data.isActive !== currentUser.isActive;
      const hasIsVerifiedChanged = data.isVerified !== undefined && data.isVerified !== currentUser.isVerified;
      
      console.log('🔍 Changements détectés:', {
        role: hasRoleChanged ? `${currentUser.role} → ${data.role}` : 'inchangé',
        status: hasStatusChanged ? `${currentUser.status} → ${data.status}` : 'inchangé',
        isActive: hasIsActiveChanged ? `${currentUser.isActive} → ${data.isActive}` : 'inchangé',
        isVerified: hasIsVerifiedChanged ? `${currentUser.isVerified} → ${data.isVerified}` : 'inchangé'
      });
      
      // Mettre à jour le rôle seulement s'il a changé
      if (hasRoleChanged) {
        console.log('🔄 Mise à jour du rôle...');
        updatedUser = await adminService.updateUserRole(userId, data.role);
        console.log('✅ Rôle mis à jour:', updatedUser);
      }
      
      // Mettre à jour le statut seulement s'il a changé
      if (hasStatusChanged || hasIsActiveChanged || hasIsVerifiedChanged) {
        console.log('🔄 Mise à jour du statut...');
        const statusData: any = {};
        if (hasStatusChanged) statusData.status = data.status;
        if (hasIsActiveChanged) statusData.isActive = data.isActive;
        if (hasIsVerifiedChanged) statusData.isVerified = data.isVerified;
        
        console.log('📝 Données de statut à envoyer:', statusData);
        updatedUser = await adminService.updateUserStatus(userId, statusData);
        console.log('✅ Statut mis à jour:', updatedUser);
      }
      
      // Si aucun changement, updatedUser reste égal à currentUser
      if (!hasRoleChanged && !hasStatusChanged && !hasIsActiveChanged && !hasIsVerifiedChanged) {
        console.log('ℹ️ Aucun changement détecté, pas de mise à jour nécessaire');
      }
      
      console.log('✅ Utilisateur final après mise à jour:', updatedUser);
      
      // Mettre à jour l'état local
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? updatedUser : user
        )
      );
      setFilteredUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? updatedUser : user
        )
      );
      
      setSnackbar({ open: true, message: 'Utilisateur modifié avec succès', severity: 'success' });
      setEditDialogOpen(false);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      setSnackbar({ 
        open: true, 
        message: `Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`, 
        severity: 'error' 
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Fonction pour recharger les utilisateurs
  const handleRefreshUsers = async () => {
    try {
      setLoading(true);
      
      // 🔐 Récupérer le token d'authentification
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('❌ Utilisateur non connecté');
        return;
      }
      
      const userData = JSON.parse(userStr);
      const token = userData.token;
      
      // 📡 Appel API pour récupérer tous les utilisateurs
      const response = await fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        headers: {
          // 🔐 Temporairement sans authentification pour tester
          // 'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const apiUsers = await response.json();
        console.log('✅ Utilisateurs rafraîchis depuis l\'API:', apiUsers);
        
        // 🔄 Transformer les données de l'API au format attendu
        const transformedUsers: User[] = apiUsers.map((apiUser: any) => ({
          id: apiUser.id,
          email: apiUser.email,
          firstName: apiUser.firstName,
          lastName: apiUser.lastName,
          role: apiUser.role,
          status: apiUser.isActive ? 'ACTIVE' : 'SUSPENDED',
          isVerified: apiUser.isVerified,
          createdAt: apiUser.createdAt || new Date().toISOString(),
          lastLogin: apiUser.lastLogin,
          profilePicture: apiUser.profilePicture,
          // 🔐 Inclure les informations KYC
          kycVerification: apiUser.kycVerification,
          amlCheck: apiUser.amlCheck,
        }));
        
        setUsers(transformedUsers);
        setFilteredUsers(transformedUsers);
        
        // 🎉 Notification de succès
        console.log(`🔄 Liste des utilisateurs mise à jour : ${transformedUsers.length} utilisateurs trouvés`);
      } else {
        console.error('❌ Erreur lors du rafraîchissement des utilisateurs:', response.status);
      }
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'PENDING': return 'warning';
      case 'SUSPENDED': return 'error';
      default: return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'SUPPORT': return 'info';
      case 'USER': return 'primary';
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

  return (
    <Box>
      {/* 🎯 En-tête avec actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          👥 Gestion des Utilisateurs
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefreshUsers}
        >
          Actualiser
        </Button>
      </Box>

      {/* 🔍 Filtres et recherche */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            label="Rechercher un utilisateur"
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
            <MenuItem value="ACTIVE">Actif</MenuItem>
            <MenuItem value="PENDING">En attente</MenuItem>
            <MenuItem value="SUSPENDED">Suspendu</MenuItem>
          </TextField>

          <TextField
            select
            label="Rôle"
            value={roleFilter}
            onChange={handleRoleFilterChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="ALL">Tous</MenuItem>
            <MenuItem value="USER">Utilisateur</MenuItem>
            <MenuItem value="SUPPORT">Support</MenuItem>
            <MenuItem value="ADMIN">Administrateur</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* 📊 Statistiques des filtres */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {filteredUsers.length} utilisateur(s) trouvé(s) sur {users.length} total
        </Typography>
      </Box>

      {/* 📋 Tableau des utilisateurs */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 600 }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rôle</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                                 <TableCell sx={{ fontWeight: 600 }}>Vérifié</TableCell>
                 <TableCell sx={{ fontWeight: 600 }}>Statut KYC</TableCell>
                 <TableCell sx={{ fontWeight: 600 }}>Risque AML</TableCell>
                 <TableCell sx={{ fontWeight: 600 }}>Créé le</TableCell>
                 <TableCell sx={{ fontWeight: 600 }}>Dernière connexion</TableCell>
                 <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: user.profilePicture ? 'transparent' : '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          {user.profilePicture ? (
                            <img 
                              src={user.profilePicture} 
                              alt="Profile" 
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b' }}>
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </Typography>
                          )}
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status) as any}
                        size="small"
                      />
                    </TableCell>
                                         <TableCell>
                       <Chip
                         label={user.isVerified ? 'Oui' : 'Non'}
                         color={user.isVerified ? 'success' : 'warning'}
                         size="small"
                         variant="outlined"
                       />
                     </TableCell>
                     <TableCell>
                       {user.kycVerification ? (
                         <Chip
                           label={user.kycVerification.verificationStatus}
                           color={
                             user.kycVerification.verificationStatus === 'VERIFIED' ? 'success' :
                             user.kycVerification.verificationStatus === 'REJECTED' ? 'error' :
                             user.kycVerification.verificationStatus === 'BLOCKED' ? 'error' :
                             'warning'
                           }
                           size="small"
                           variant="outlined"
                         />
                       ) : (
                         <Chip label="Aucun KYC" color="default" size="small" variant="outlined" />
                       )}
                     </TableCell>
                     <TableCell>
                       {user.amlCheck ? (
                         <Chip
                           label={user.amlCheck.riskLevel}
                           color={
                             user.amlCheck.riskLevel === 'LOW' ? 'success' :
                             user.amlCheck.riskLevel === 'MEDIUM' ? 'warning' :
                             user.amlCheck.riskLevel === 'HIGH' ? 'error' :
                             user.amlCheck.riskLevel === 'BLOCKED' ? 'error' :
                             'default'
                           }
                           size="small"
                           variant="outlined"
                         />
                       ) : (
                         <Chip label="N/A" color="default" size="small" variant="outlined" />
                       )}
                     </TableCell>
                     <TableCell>
                       <Typography variant="body2">
                         {formatDate(user.createdAt)}
                       </Typography>
                     </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Jamais'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Actions">
                        <IconButton
                          size="small"
                          onClick={(e) => handleActionClick(e, user)}
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
          count={filteredUsers.length}
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
          <ListItemText>Voir le profil</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openActionDialog('EDIT')}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openActionDialog('APPROVE')}>
          <ListItemIcon>
            <ApproveIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Approuver</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openActionDialog('SUSPEND')}>
          <ListItemIcon>
            <WarningIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Suspendre</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => openActionDialog('BLOCK')}>
          <ListItemIcon>
            <BlockIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Bloquer</ListItemText>
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
          {actionDialog === 'SUSPEND' && 'Suspendre l\'utilisateur'}
          {actionDialog === 'BLOCK' && 'Bloquer l\'utilisateur'}
          {actionDialog === 'DELETE' && 'Supprimer l\'utilisateur'}
          {actionDialog === 'APPROVE' && 'Approuver l\'utilisateur'}
          {actionDialog === 'EDIT' && 'Modifier l\'utilisateur'}
          {actionDialog === 'VIEW' && 'Voir le profil'}
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Êtes-vous sûr de vouloir {actionDialog === 'SUSPEND' ? 'suspendre' : 
                  actionDialog === 'BLOCK' ? 'bloquer' : 
                  actionDialog === 'DELETE' ? 'supprimer' : 
                  actionDialog === 'APPROVE' ? 'approuver' : 
                  actionDialog === 'EDIT' ? 'modifier' : 'voir'} l'utilisateur :
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>{selectedUser.firstName} {selectedUser.lastName}</strong><br />
                {selectedUser.email}<br />
                Rôle: {selectedUser.role} | Statut: {selectedUser.status}
              </Alert>
              {actionDialog === 'DELETE' && (
                <Alert severity="warning">
                  ⚠️ Cette action est irréversible et supprimera définitivement l'utilisateur.
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
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🖼️ Dialog de profil utilisateur */}
      <UserProfileDialog
        open={profileDialogOpen}
        user={selectedUser}
        onClose={() => setProfileDialogOpen(false)}
      />

      {/* ✏️ Dialog d'édition utilisateur */}
      <UserEditDialog
        open={editDialogOpen}
        user={selectedUser}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveUser}
      />

      {/* 📢 Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminUsersManagement; 