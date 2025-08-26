export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  version: number;
  isDeleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
  priority: TaskPriority;
  categoryIds: string[];
  tagIds: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  isDeleted: boolean;
  history: TaskHistoryEntry[];
  reminders: TaskReminder[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  parentId?: string;
  isPublic: boolean;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  isDeleted: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  isDeleted: boolean;
}

export interface TaskReminder {
  id: string;
  taskId: string;
  remindAt: string;
  type: ReminderType;
  isSent: boolean;
  createdAt: string;
  version: number;
  isDeleted: boolean;
}

export interface TaskHistoryEntry {
  id: string;
  taskId: string;
  action: string;
  actorId: string;
  timestamp: string;
  details?: string;
}

export enum UserRole {
  UNSPECIFIED = 'USER_ROLE_UNSPECIFIED',
  USER = 'USER_ROLE_USER',
  ADMIN = 'USER_ROLE_ADMIN',
}

export enum TaskStatus {
  UNSPECIFIED = 'TASK_STATUS_UNSPECIFIED',
  OPEN = 'TASK_STATUS_OPEN',
  IN_PROGRESS = 'TASK_STATUS_IN_PROGRESS',
  COMPLETED = 'TASK_STATUS_COMPLETED',
  UNDOABLE = 'TASK_STATUS_UNDOABLE',
}

export enum TaskPriority {
  UNSPECIFIED = 'TASK_PRIORITY_UNSPECIFIED',
  LOW = 'TASK_PRIORITY_LOW',
  MEDIUM = 'TASK_PRIORITY_MEDIUM',
  HIGH = 'TASK_PRIORITY_HIGH',
  URGENT = 'TASK_PRIORITY_URGENT',
}

export enum ReminderType {
  UNSPECIFIED = 'REMINDER_TYPE_UNSPECIFIED',
  ONCE = 'REMINDER_TYPE_ONCE',
  DAILY = 'REMINDER_TYPE_DAILY',
  WEEKLY = 'REMINDER_TYPE_WEEKLY',
  MONTHLY = 'REMINDER_TYPE_MONTHLY',
}

export interface PageInfo {
  pageSize: number;
  pageToken?: string;
}

export interface PageResponse {
  nextPageToken?: string;
  totalCount: number;
}

export interface ListUsersRequest {
  pageInfo?: PageInfo;
  searchQuery?: string;
  includeDeleted?: boolean;
}

export interface ListUsersResponse {
  users: User[];
  pageResponse: PageResponse;
}

export interface GetUserRequest {
  userId: string;
}

export interface GetUserResponse {
  user: User;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  assigneeId: string;
}

export interface CreateTaskResponse {
  task: Task;
}

export interface ListTasksRequest {
  assigneeId?: string;
  status?: TaskStatus;
  pageInfo?: PageInfo;
}

export interface ListTasksResponse {
  tasks: Task[];
  pageResponse?: PageResponse;
}

export interface GetTaskRequest {
  taskId: string;
}

export interface GetTaskResponse {
  task: Task;
}

export interface UpdateTaskRequest {
  taskId: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
}

export interface UpdateTaskResponse {
  task: Task;
}

export interface GetTaskHistoryRequest {
  taskId: string;
}

export interface GetTaskHistoryResponse {
  history: TaskHistoryEntry[];
}

export interface ApiError {
  message: string;
  code?: string;
  details?: string;
}