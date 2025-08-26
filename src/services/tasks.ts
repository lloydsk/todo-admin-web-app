import { apiClient } from './api';
import {
  CreateTaskRequest,
  CreateTaskResponse,
  ListTasksRequest,
  ListTasksResponse,
  GetTaskRequest,
  GetTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  GetTaskHistoryRequest,
  GetTaskHistoryResponse,
  Task,
} from '../types/api';

export const taskService = {
  async createTask(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    return apiClient.post<CreateTaskResponse>('/api/v1/tasks', request);
  },

  async listTasks(request: ListTasksRequest = {}): Promise<ListTasksResponse> {
    const params = new URLSearchParams();
    
    if (request.assigneeId) {
      params.append('assignee_id', request.assigneeId);
    }
    
    if (request.status) {
      params.append('status', request.status);
    }

    if (request.pageInfo?.pageSize) {
      params.append('page_size', request.pageInfo.pageSize.toString());
    }
    
    if (request.pageInfo?.pageToken) {
      params.append('page_token', request.pageInfo.pageToken);
    }

    return apiClient.get<ListTasksResponse>(`/api/v1/tasks?${params.toString()}`);
  },

  async getTask(request: GetTaskRequest): Promise<GetTaskResponse> {
    return apiClient.get<GetTaskResponse>(`/api/v1/tasks/${request.taskId}`);
  },

  async updateTask(request: UpdateTaskRequest): Promise<UpdateTaskResponse> {
    return apiClient.put<UpdateTaskResponse>(`/api/v1/tasks/${request.taskId}`, {
      title: request.title,
      description: request.description,
      assignee_id: request.assigneeId,
      status: request.status,
    });
  },

  async deleteTask(taskId: string): Promise<void> {
    return apiClient.delete(`/api/v1/tasks/${taskId}`);
  },

  async getTaskHistory(request: GetTaskHistoryRequest): Promise<GetTaskHistoryResponse> {
    return apiClient.get<GetTaskHistoryResponse>(`/api/v1/tasks/${request.taskId}/history`);
  },

  async bulkUpdateTasks(taskIds: string[], updates: Partial<Task>): Promise<Task[]> {
    return apiClient.patch<Task[]>('/api/v1/tasks/bulk', {
      task_ids: taskIds,
      updates,
    });
  },

  async bulkDeleteTasks(taskIds: string[]): Promise<void> {
    return apiClient.delete('/api/v1/tasks/bulk', { 
      data: { task_ids: taskIds } 
    });
  },
};