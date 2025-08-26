import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, UserRole } from '../../types/api';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  user?: User;
  loading?: boolean;
  error?: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSubmit,
  user,
  loading = false,
  error,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      role: user.role,
    } : {
      name: '',
      email: '',
      role: UserRole.USER,
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      reset({
        name: '',
        email: '',
        role: UserRole.USER,
      });
    }
  }, [user, reset]);

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Edit User' : 'Create User'}</DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={loading}
                />
              )}
            />
            
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={loading}
                />
              )}
            />
            
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.role} disabled={loading}>
                  <InputLabel>Role</InputLabel>
                  <Select {...field} label="Role">
                    <MenuItem value={UserRole.USER}>User</MenuItem>
                    <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : user ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};