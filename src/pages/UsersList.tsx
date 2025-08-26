import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';
import { useUsers, useCreateUser, useUpdateUser, useSuspendUser, useActivateUser, useDeleteUser } from '../hooks/useUsers';
import { UserForm } from '../components/forms/UserForm';
import { User, UserRole } from '../types/api';

export const UsersList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: usersResponse, isLoading, error } = useUsers({
    searchQuery: searchQuery || undefined,
    pageInfo: { pageSize: 100 },
  });

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const suspendUser = useSuspendUser();
  const activateUser = useActivateUser();
  const deleteUser = useDeleteUser();

  const handleCreateUser = () => {
    setSelectedUser(null);
    setFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: { name: string; email: string; role: UserRole }) => {
    try {
      if (selectedUser) {
        await updateUser.mutateAsync({
          userId: selectedUser.id,
          userData: data,
        });
        setNotification({ open: true, message: 'User updated successfully', severity: 'success' });
      } else {
        await createUser.mutateAsync(data);
        setNotification({ open: true, message: 'User created successfully', severity: 'success' });
      }
      setFormOpen(false);
    } catch (error) {
      setNotification({ 
        open: true, 
        message: `Failed to ${selectedUser ? 'update' : 'create'} user`, 
        severity: 'error' 
      });
    }
  };

  const handleSuspendUser = async (user: User) => {
    try {
      await suspendUser.mutateAsync(user.id);
      setNotification({ open: true, message: 'User suspended successfully', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Failed to suspend user', severity: 'error' });
    }
  };

  const handleActivateUser = async (user: User) => {
    try {
      await activateUser.mutateAsync(user.id);
      setNotification({ open: true, message: 'User activated successfully', severity: 'success' });
    } catch (error) {
      setNotification({ open: true, message: 'Failed to activate user', severity: 'error' });
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete user "${user.name}"?`)) {
      try {
        await deleteUser.mutateAsync(user.id);
        setNotification({ open: true, message: 'User deleted successfully', severity: 'success' });
      } catch (error) {
        setNotification({ open: true, message: 'Failed to delete user', severity: 'error' });
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value === UserRole.ADMIN ? 'Admin' : 'User'}
          color={params.value === UserRole.ADMIN ? 'primary' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'isDeleted',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Inactive' : 'Active'}
          color={params.value ? 'error' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params: GridRowParams) => {
        const user = params.row as User;
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditUser(user)}
          />,
          user.isDeleted ? (
            <GridActionsCellItem
              icon={<CheckCircleIcon />}
              label="Activate"
              onClick={() => handleActivateUser(user)}
            />
          ) : (
            <GridActionsCellItem
              icon={<BlockIcon />}
              label="Suspend"
              onClick={() => handleSuspendUser(user)}
            />
          ),
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteUser(user)}
          />,
        ];
      },
    },
  ];

  if (error) {
    return (
      <Alert severity="error">
        Failed to load users: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateUser}
        >
          Create User
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={usersResponse?.users || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </Box>

      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        user={selectedUser || undefined}
        loading={createUser.isPending || updateUser.isPending}
        error={createUser.error?.message || updateUser.error?.message}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};