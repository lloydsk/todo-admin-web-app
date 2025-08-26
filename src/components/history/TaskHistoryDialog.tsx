import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import {
  History as HistoryIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Task, TaskHistoryEntry } from '../../types/api';

interface TaskHistoryDialogProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  users: { id: string; name: string; email: string }[];
}

export const TaskHistoryDialog: React.FC<TaskHistoryDialogProps> = ({
  open,
  onClose,
  task,
  users,
}) => {
  if (!task) {
    return null;
  }

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return <AddIcon color="success" />;
      case 'updated':
      case 'modified':
        return <EditIcon color="primary" />;
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'marked_undoable':
      case 'cancelled':
        return <CancelIcon color="error" />;
      case 'started':
      case 'in_progress':
        return <PlayArrowIcon color="info" />;
      default:
        return <HistoryIcon />;
    }
  };

  const getActionColor = (action: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'success';
      case 'completed':
        return 'success';
      case 'updated':
      case 'modified':
        return 'primary';
      case 'started':
      case 'in_progress':
        return 'info';
      case 'marked_undoable':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatActionText = (action: string): string => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Sort history by timestamp (newest first)
  const sortedHistory = [...task.history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HistoryIcon />
          <Typography variant="h6">Task History</Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
          {task.title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        {sortedHistory.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <HistoryIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No History Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This task doesn't have any recorded history yet.
            </Typography>
          </Box>
        ) : (
          <List>
            {sortedHistory.map((entry, index) => (
              <React.Fragment key={entry.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
                      {getActionIcon(entry.action)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip
                          label={formatActionText(entry.action)}
                          size="small"
                          color={getActionColor(entry.action)}
                        />
                        <Typography variant="body2" color="text.secondary">
                          by {getUserName(entry.actorId)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {format(new Date(entry.timestamp), 'MMM d, yyyy - h:mm a')}
                        </Typography>
                        {entry.details && (
                          <Typography variant="body2" color="text.primary">
                            {entry.details}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < sortedHistory.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};