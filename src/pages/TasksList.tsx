import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Alert,
  Snackbar,
  Toolbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useBulkUpdateTasks, useBulkDeleteTasks } from '../hooks/useTasks';
import { useUsers } from '../hooks/useUsers';
import { TaskForm } from '../components/forms/TaskForm';
import { TaskFilters, TaskFilterState } from '../components/filters/TaskFilters';
import { TaskHistoryDialog } from '../components/history/TaskHistoryDialog';
import { Task, TaskStatus, TaskPriority, CreateTaskRequest, UpdateTaskRequest } from '../types/api';

export const TasksList: React.FC = () => {
  const [filters, setFilters] = useState<TaskFilterState>({
    searchQuery: '',
    status: '',
    priority: '',
    assigneeId: '',
    dueDateFrom: null,
    dueDateTo: null,
    createdDateFrom: null,
    createdDateTo: null,
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [historyTask, setHistoryTask] = useState<Task | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const { data: tasksResponse, isLoading, error } = useTasks({
    status: filters.status || undefined,
    assigneeId: filters.assigneeId || undefined,
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

  const handleViewHistory = (task: Task) => {
    setHistoryTask(task);
    setHistoryOpen(true);
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
      width: 160,
      getActions: (params: GridRowParams) => {
        const task = params.row as Task;
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={() => handleEditTask(task)}
          />,
          <GridActionsCellItem
            icon={<HistoryIcon />}
            label="History"
            onClick={() => handleViewHistory(task)}
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

  // Client-side filtering for advanced filters
  const filteredTasks = (tasksResponse?.tasks || []).filter(task => {
    // Search query filter
    if (filters.searchQuery) {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Due date range filter
    if (filters.dueDateFrom && task.dueDate) {
      const taskDueDate = new Date(task.dueDate);
      const filterFromDate = new Date(filters.dueDateFrom);
      if (taskDueDate < filterFromDate) return false;
    }
    
    if (filters.dueDateTo && task.dueDate) {
      const taskDueDate = new Date(task.dueDate);
      const filterToDate = new Date(filters.dueDateTo);
      filterToDate.setHours(23, 59, 59, 999); // End of day
      if (taskDueDate > filterToDate) return false;
    }

    // Created date range filter
    if (filters.createdDateFrom) {
      const taskCreatedDate = new Date(task.createdAt);
      const filterFromDate = new Date(filters.createdDateFrom);
      if (taskCreatedDate < filterFromDate) return false;
    }
    
    if (filters.createdDateTo) {
      const taskCreatedDate = new Date(task.createdAt);
      const filterToDate = new Date(filters.createdDateTo);
      filterToDate.setHours(23, 59, 59, 999); // End of day
      if (taskCreatedDate > filterToDate) return false;
    }

    return true;
  });

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      status: '',
      priority: '',
      assigneeId: '',
      dueDateFrom: null,
      dueDateTo: null,
      createdDateFrom: null,
      createdDateTo: null,
    });
  };

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

      <TaskFilters
        filters={filters}
        onFiltersChange={setFilters}
        users={users}
        onClearFilters={handleClearFilters}
      />

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

      <TaskHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        task={historyTask}
        users={users}
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