import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tag } from '../../types/api';

const tagSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9\s_-]+$/, 'Name can only contain letters, numbers, spaces, hyphens, and underscores'),
  color: z.string().min(1, 'Color is required').regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format'),
});

type TagFormData = z.infer<typeof tagSchema>;

interface TagFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TagFormData) => void;
  tag?: Tag | null;
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
  '#795548', // brown
  '#607d8b', // blue grey
];

export const TagForm: React.FC<TagFormProps> = ({
  open,
  onClose,
  onSubmit,
  tag,
  loading,
  error,
}) => {
  const isEditing = !!tag;
  
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: '',
      color: predefinedColors[0],
    },
  });

  const selectedColor = watch('color');
  const tagName = watch('name');

  useEffect(() => {
    if (open) {
      if (tag) {
        reset({
          name: tag.name,
          color: tag.color,
        });
      } else {
        reset({
          name: '',
          color: predefinedColors[0],
        });
      }
    }
  }, [tag, open, reset]);

  const handleFormSubmit = (data: TagFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>
          {isEditing ? 'Edit Tag' : 'Create Tag'}
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
                  label="Tag Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={loading}
                  placeholder="e.g., urgent, bug-fix, feature"
                />
              )}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
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
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                    onClick={() => setValue('color', color)}
                  >
                    {selectedColor === color && (
                      <Typography sx={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                        ✓
                      </Typography>
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
                    placeholder="#ff0000"
                    error={!!errors.color}
                    helperText={errors.color?.message}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  />
                )}
              />
            </Box>

            {tagName && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Preview
                </Typography>
                <Chip
                  label={tagName}
                  size="medium"
                  style={{
                    backgroundColor: selectedColor,
                    color: '#fff',
                  }}
                />
              </Box>
            )}
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