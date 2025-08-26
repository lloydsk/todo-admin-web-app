import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category } from '../../types/api';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters'),
  color: z.string().min(1, 'Color is required').regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
  parentId: z.string().optional(),
  isPublic: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  category?: Category | null;
  categories: Category[];
  loading: boolean;
  error?: string;
}

const predefinedColors = [
  '#f44336', // red
  '#e91e63', // pink
  '#9c27b0', // purple
  '#673ab7', // deep purple
  '#3f51b5', // indigo
  '#2196f3', // blue
  '#03a9f4', // light blue
  '#00bcd4', // cyan
  '#009688', // teal
  '#4caf50', // green
  '#8bc34a', // light green
  '#cddc39', // lime
  '#ffeb3b', // yellow
  '#ffc107', // amber
  '#ff9800', // orange
  '#ff5722', // deep orange
];

export const CategoryForm: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  onSubmit,
  category,
  categories,
  loading,
  error,
}) => {
  const isEditing = !!category;
  
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      color: predefinedColors[0],
      parentId: '',
      isPublic: true,
    },
  });

  const selectedColor = watch('color');

  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name,
          description: category.description,
          color: category.color,
          parentId: category.parentId || '',
          isPublic: category.isPublic,
        });
      } else {
        reset({
          name: '',
          description: '',
          color: predefinedColors[0],
          parentId: '',
          isPublic: true,
        });
      }
    }
  }, [category, open, reset]);

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit({
      ...data,
      parentId: data.parentId || undefined,
    });
  };

  const availableParentCategories = categories.filter(c => 
    !category || c.id !== category.id
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>
          {isEditing ? 'Edit Category' : 'Create Category'}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
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
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={loading}
                />
              )}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {predefinedColors.map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: color,
                      borderRadius: 1,
                      cursor: 'pointer',
                      border: selectedColor === color ? '3px solid #000' : '2px solid #ddd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => setValue('color', color)}
                  >
                    {selectedColor === color && (
                      <Typography sx={{ color: '#fff', fontSize: '12px' }}>✓</Typography>
                    )}
                  </Box>
                ))}
              </Box>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Custom Color (Hex)"
                    sx={{ mt: 2 }}
                    placeholder="#ff0000"
                    error={!!errors.color}
                    helperText={errors.color?.message}
                    disabled={loading}
                  />
                )}
              />
            </Box>

            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Parent Category (Optional)</InputLabel>
                  <Select
                    {...field}
                    label="Parent Category (Optional)"
                    disabled={loading}
                  >
                    <MenuItem value="">None</MenuItem>
                    {availableParentCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              backgroundColor: cat.color,
                              borderRadius: 0.5,
                            }}
                          />
                          {cat.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              name="isPublic"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={loading}
                    />
                  }
                  label="Public Category (visible to all users)"
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={16} />}
          >
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};