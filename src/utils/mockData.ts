import { Task, TaskHistoryEntry, TaskStatus, TaskPriority } from '../types/api';

export const createMockTaskHistory = (taskId: string): TaskHistoryEntry[] => {
  return [
    {
      id: `history_1_${taskId}`,
      taskId,
      action: 'created',
      actorId: '1',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      details: 'Task created with initial requirements',
    },
    {
      id: `history_2_${taskId}`,
      taskId,
      action: 'updated',
      actorId: '2',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      details: 'Updated task description and priority',
    },
    {
      id: `history_3_${taskId}`,
      taskId,
      action: 'in_progress',
      actorId: '1',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      details: 'Started working on this task',
    },
    {
      id: `history_4_${taskId}`,
      taskId,
      action: 'completed',
      actorId: '1',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      details: 'Task completed successfully',
    },
  ];
};

export const enhanceTasksWithHistory = (tasks: Task[]): Task[] => {
  return tasks.map(task => ({
    ...task,
    history: createMockTaskHistory(task.id),
  }));
};