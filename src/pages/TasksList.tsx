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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Toolbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useBulkUpdateTasks, useBulkDeleteTasks } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';
import { TaskForm } from '../components/forms/TaskForm';
import { Task, TaskStatus, TaskPriority, CreateTaskRequest, UpdateTaskRequest } from '../types/api';

export const TasksList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: tasksResponse, isLoading, error } = useTasks({
    status: statusFilter || undefined,
    pageInfo: { pageSize: 100 },
  });

  const { data: usersResponse } = useUsers({ pageInfo: { pageSize: 100 } });
  const users = usersResponse?.users || [];

  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const bulkUpdateTasks = useBulkUpdateTasks();
  const bulkDeleteTasks = useBulkDeleteTasks();

  const handleCreateTask = () => {
    setSelectedTask(null);
    setFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: { title: string; description?: string; assigneeId: string; status: TaskStatus; priority?: TaskPriority }) => {
    try {
      if (selectedTask) {
        const updateRequest: UpdateTaskRequest = {
          taskId: selectedTask.id,
          title: data.title,
          description: data.description || '',
          assigneeId: data.assigneeId,
          status: data.status,
        };
        await updateTask.mutateAsync(updateRequest);
        setNotification({ open: true, message: 'Task updated successfully', severity: 'success' });
      } else {
        const createRequest: CreateTaskRequest = {
          title: data.title,
          description: data.description || '',
          assigneeId: data.assigneeId,
        };
        await createTask.mutateAsync(createRequest);
        setNotification({ open: true, message: 'Task created successfully', severity: 'success' });
      }
      setFormOpen(false);
    } catch (error) {
      setNotification({ 
        open: true, 
        message: `Failed to ${selectedTask ? 'update' : 'create'} task`, 
        severity: 'error' 
      });
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      try {
        await deleteTask.mutateAsync(task.id);
        setNotification({ open: true, message: 'Task deleted successfully', severity: 'success' });
      } catch (error) {
        setNotification({ open: true, message: 'Failed to delete task', severity: 'error' });
      }
    }
  };

  const handleBulkComplete = async () => {
    if (selectedRows.length === 0) return;
    
    try {
      await bulkUpdateTasks.mutateAsync({
        taskIds: selectedRows as string[],
        updates: { status: TaskStatus.COMPLETED }
      });
      setNotification({ open: true, message: `${selectedRows.length} tasks marked as completed`, severity: 'success' });
      setSelectedRows([]);
    } catch (error) {
      setNotification({ open: true, message: 'Failed to update tasks', severity: 'error' });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} tasks?`)) {
      try {
        await bulkDeleteTasks.mutateAsync(selectedRows as string[]);
        setNotification({ open: true, message: `${selectedRows.length} tasks deleted`, severity: 'success' });
        setSelectedRows([]);
      } catch (error) {
        setNotification({ open: true, message: 'Failed to delete tasks', severity: 'error' });
      }
    }
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

  const getStatusColor = (status: TaskStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case TaskStatus.OPEN: return 'default';
      case TaskStatus.IN_PROGRESS: return 'primary';
      case TaskStatus.COMPLETED: return 'success';
      case TaskStatus.UNDOABLE: return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: TaskPriority): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (priority) {
      case TaskPriority.LOW: return 'info';
      case TaskPriority.MEDIUM: return 'default';
      case TaskPriority.HIGH: return 'warning';
      case TaskPriority.URGENT: return 'error';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Title', flex: 2 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'assigneeId',
      headerName: 'Assignee',
      flex: 1,
      valueGetter: (params) => {
        const user = users.find(u => u.id === params.value);
        return user ? user.name : 'Unknown';
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value?.replace('TASK_PRIORITY_', '') || 'MEDIUM'}
          color={getPriorityColor(params.value)}
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
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params: GridRowParams) => {
        const task = params.row as Task;
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditTask(task)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteTask(task)}
          />,
        ];
      },
    },
  ];

  if (error) {
    return (
      <Alert severity="error">
        Failed to load tasks: {error.message}
      </Alert>
    );
  }

  const filteredTasks = (tasksResponse?.tasks || []).filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTask}
        >
          Create Task
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus)}
            label="Status Filter"
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value={TaskStatus.OPEN}>Open</MenuItem>
            <MenuItem value={TaskStatus.IN_PROGRESS}>In Progress</MenuItem>
            <MenuItem value={TaskStatus.COMPLETED}>Completed</MenuItem>
            <MenuItem value={TaskStatus.UNDOABLE}>Cannot Be Done</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {selectedRows.length > 0 && (
        <Toolbar sx={{ bgcolor: 'primary.light', mb: 2, borderRadius: 1 }}>
          <Typography sx={{ flex: '1 1 100%' }} variant="h6">
            {selectedRows.length} selected
          </Typography>
          <Button
            startIcon={<CheckCircleIcon />}
            onClick={handleBulkComplete}
            sx={{ mr: 1 }}
          >
            Mark Complete
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleBulkDelete}
            color="error"
          >
            Delete
          </Button>
        </Toolbar>
      )}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredTasks}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={setSelectedRows}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </Box>

      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        task={selectedTask || undefined}
        loading={createTask.isPending || updateTask.isPending}
        error={createTask.error?.message || updateTask.error?.message}
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