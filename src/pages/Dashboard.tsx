import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from '@mui/material';
import {
  Task as TaskIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: `${color}.light`,
            color: `${color}.contrastText`,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {title}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const Dashboard: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Tasks"
            value="1,234"
            icon={<TaskIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Users"
            value="89"
            icon={<PeopleIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Completed Tasks"
            value="456"
            icon={<CheckCircleIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Overdue Tasks"
            value="23"
            icon={<WarningIcon />}
            color="warning"
          />
        </Grid>
        
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography color="text.secondary">
              Activity feed will be implemented here with real-time updates.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};