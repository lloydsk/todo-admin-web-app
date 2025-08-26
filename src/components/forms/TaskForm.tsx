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
  Autocomplete,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task, TaskStatus, TaskPriority } from '../../types/api';
import { useUsers } from '../../hooks/useUsers';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  assigneeId: z.string().min(1, 'Assignee is required'),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task?: Task;
  loading?: boolean;
  error?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  task,
  loading = false,
  error,
}) => {
  const { data: usersResponse } = useUsers({ pageInfo: { pageSize: 100 } });
  const users = usersResponse?.users || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      assigneeId: task.assigneeId,
      status: task.status,
      priority: task.priority,
    } : {
      title: '',
      description: '',
      assigneeId: '',
      status: TaskStatus.OPEN,
      priority: TaskPriority.MEDIUM,
    },
  });

  React.useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        assigneeId: task.assigneeId,
        status: task.status,
        priority: task.priority,
      });
    } else {
      reset({
        title: '',
        description: '',
        assigneeId: '',
        status: TaskStatus.OPEN,
        priority: TaskPriority.MEDIUM,
      });
    }
  }, [task, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.OPEN: return 'Open';
      case TaskStatus.IN_PROGRESS: return 'In Progress';
      case TaskStatus.COMPLETED: return 'Completed';
      case TaskStatus.UNDOABLE: return 'Cannot Be Done';
      default: return 'Unknown';
    }
  };

  const getPriorityLabel = (priority: TaskPriority): string => {
    switch (priority) {
      case TaskPriority.LOW: return 'Low';
      case TaskPriority.MEDIUM: return 'Medium';
      case TaskPriority.HIGH: return 'High';
      case TaskPriority.URGENT: return 'Urgent';
      default: return 'Medium';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
      
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
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
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  disabled={loading}
                />
              )}
            />
            
            <Controller
              name="assigneeId"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={users}
                  getOptionLabel={(option) => `${option.name} (${option.email})`}
                  value={users.find(user => user.id === value) || null}
                  onChange={(_, newValue) => onChange(newValue?.id || '')}
                  disabled={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assignee"
                      error={!!errors.assigneeId}
                      helperText={errors.assigneeId?.message}
                    />
                  )}
                />
              )}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status} disabled={loading}>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value={TaskStatus.OPEN}>{getStatusLabel(TaskStatus.OPEN)}</MenuItem>
                      <MenuItem value={TaskStatus.IN_PROGRESS}>{getStatusLabel(TaskStatus.IN_PROGRESS)}</MenuItem>
                      <MenuItem value={TaskStatus.COMPLETED}>{getStatusLabel(TaskStatus.COMPLETED)}</MenuItem>
                      <MenuItem value={TaskStatus.UNDOABLE}>{getStatusLabel(TaskStatus.UNDOABLE)}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.priority} disabled={loading}>
                    <InputLabel>Priority</InputLabel>
                    <Select {...field} label="Priority">
                      <MenuItem value={TaskPriority.LOW}>{getPriorityLabel(TaskPriority.LOW)}</MenuItem>
                      <MenuItem value={TaskPriority.MEDIUM}>{getPriorityLabel(TaskPriority.MEDIUM)}</MenuItem>
                      <MenuItem value={TaskPriority.HIGH}>{getPriorityLabel(TaskPriority.HIGH)}</MenuItem>
                      <MenuItem value={TaskPriority.URGENT}>{getPriorityLabel(TaskPriority.URGENT)}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : task ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};