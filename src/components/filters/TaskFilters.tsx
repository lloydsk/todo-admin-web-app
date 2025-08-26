import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Paper,
  Typography,
  Chip,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { TaskStatus, TaskPriority, User } from '../../types/api';

export interface TaskFilterState {
  searchQuery: string;
  status: TaskStatus | '';
  priority: TaskPriority | '';
  assigneeId: string;
  dueDateFrom?: Date | null;
  dueDateTo?: Date | null;
  createdDateFrom?: Date | null;
  createdDateTo?: Date | null;
}

interface TaskFiltersProps {
  filters: TaskFilterState;
  onFiltersChange: (filters: TaskFilterState) => void;
  users: User[];
  onClearFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onFiltersChange,
  users,
  onClearFilters,
}) => {
  const handleFilterChange = <K extends keyof TaskFilterState>(key: K, value: TaskFilterState[K]) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
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
      default: return 'Unknown';
    }
  };

  const hasActiveFilters = () => {
    return !!(
      filters.searchQuery ||
      filters.status ||
      filters.priority ||
      filters.assigneeId ||
      filters.dueDateFrom ||
      filters.dueDateTo ||
      filters.createdDateFrom ||
      filters.createdDateTo
    );
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.status) count++;
    if (filters.priority) count++;
    if (filters.assigneeId) count++;
    if (filters.dueDateFrom || filters.dueDateTo) count++;
    if (filters.createdDateFrom || filters.createdDateTo) count++;
    return count;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterListIcon color="primary" />
          <Typography variant="h6" sx={{ flex: 1 }}>
            Filters
            {hasActiveFilters() && (
              <Chip
                label={`${activeFiltersCount()} active`}
                size="small"
                color="primary"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          {hasActiveFilters() && (
            <IconButton onClick={onClearFilters} size="small" color="secondary">
              <ClearIcon />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Search */}
          <TextField
            placeholder="Search tasks..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200, flex: 1 }}
            size="small"
          />

          {/* Status Filter */}
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value as TaskStatus | '')}
              label="Status"
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value={TaskStatus.OPEN}>{getStatusLabel(TaskStatus.OPEN)}</MenuItem>
              <MenuItem value={TaskStatus.IN_PROGRESS}>{getStatusLabel(TaskStatus.IN_PROGRESS)}</MenuItem>
              <MenuItem value={TaskStatus.COMPLETED}>{getStatusLabel(TaskStatus.COMPLETED)}</MenuItem>
              <MenuItem value={TaskStatus.UNDOABLE}>{getStatusLabel(TaskStatus.UNDOABLE)}</MenuItem>
            </Select>
          </FormControl>

          {/* Priority Filter */}
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value as TaskPriority | '')}
              label="Priority"
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value={TaskPriority.LOW}>{getPriorityLabel(TaskPriority.LOW)}</MenuItem>
              <MenuItem value={TaskPriority.MEDIUM}>{getPriorityLabel(TaskPriority.MEDIUM)}</MenuItem>
              <MenuItem value={TaskPriority.HIGH}>{getPriorityLabel(TaskPriority.HIGH)}</MenuItem>
              <MenuItem value={TaskPriority.URGENT}>{getPriorityLabel(TaskPriority.URGENT)}</MenuItem>
            </Select>
          </FormControl>

          {/* Assignee Filter */}
          <Autocomplete
            options={users}
            getOptionLabel={(option) => `${option.name} (${option.email})`}
            value={users.find(user => user.id === filters.assigneeId) || null}
            onChange={(_, newValue) => handleFilterChange('assigneeId', newValue?.id || '')}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Assignee"
                size="small"
              />
            )}
            sx={{ minWidth: 200 }}
          />
        </Box>

        {/* Date Range Filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
          <Typography variant="subtitle2" sx={{ width: '100%', mb: 1 }}>
            Date Ranges
          </Typography>

          {/* Due Date Range */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 60 }}>
              Due Date:
            </Typography>
            <DatePicker
              label="From"
              value={filters.dueDateFrom}
              onChange={(date) => handleFilterChange('dueDateFrom', date)}
              slotProps={{
                textField: { size: 'small', sx: { width: 140 } }
              }}
            />
            <DatePicker
              label="To"
              value={filters.dueDateTo}
              onChange={(date) => handleFilterChange('dueDateTo', date)}
              slotProps={{
                textField: { size: 'small', sx: { width: 140 } }
              }}
            />
          </Box>

          {/* Created Date Range */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 60 }}>
              Created:
            </Typography>
            <DatePicker
              label="From"
              value={filters.createdDateFrom}
              onChange={(date) => handleFilterChange('createdDateFrom', date)}
              slotProps={{
                textField: { size: 'small', sx: { width: 140 } }
              }}
            />
            <DatePicker
              label="To"
              value={filters.createdDateTo}
              onChange={(date) => handleFilterChange('createdDateTo', date)}
              slotProps={{
                textField: { size: 'small', sx: { width: 140 } }
              }}
            />
          </Box>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};