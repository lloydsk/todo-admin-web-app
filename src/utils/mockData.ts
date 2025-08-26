import { Task, TaskHistoryEntry, Category, Tag } from '../types/api';

export const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Development',
    description: 'Software development related tasks',
    color: '#2196f3',
    isPublic: true,
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat2',
    name: 'Design',
    description: 'UI/UX design and visual tasks',
    color: '#e91e63',
    isPublic: true,
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat3',
    name: 'Research',
    description: 'Investigation and research tasks',
    color: '#9c27b0',
    isPublic: false,
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat4',
    name: 'Testing',
    description: 'Quality assurance and testing activities',
    color: '#4caf50',
    isPublic: true,
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat5',
    name: 'Documentation',
    description: 'Writing and maintaining documentation',
    color: '#ff9800',
    isPublic: true,
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

export const mockTags: Tag[] = [
  {
    id: 'tag1',
    name: 'urgent',
    color: '#f44336',
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag2',
    name: 'bug-fix',
    color: '#ff5722',
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag3',
    name: 'feature',
    color: '#2196f3',
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag4',
    name: 'enhancement',
    color: '#4caf50',
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag5',
    name: 'security',
    color: '#795548',
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag6',
    name: 'performance',
    color: '#607d8b',
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag7',
    name: 'ui-polish',
    color: '#e91e63',
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tag8',
    name: 'refactor',
    color: '#9c27b0',
    creatorId: '1',
    version: 1,
    isDeleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

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