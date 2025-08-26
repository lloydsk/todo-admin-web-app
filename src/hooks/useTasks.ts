import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/tasks';
import { enhanceTasksWithHistory } from '../utils/mockData';
import {
  CreateTaskRequest,
  CreateTaskResponse,
  ListTasksRequest,
  ListTasksResponse,
  GetTaskResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  GetTaskHistoryResponse,
  Task,
} from '../types/api';

export const useTasks = (request: ListTasksRequest = {}) => {
  return useQuery<ListTasksResponse>({
    queryKey: ['tasks', request],
    queryFn: async () => {
      const response = await taskService.listTasks(request);
      return {
        ...response,
        tasks: enhanceTasksWithHistory(response.tasks),
      };
    },
  });
};

export const useTask = (taskId: string) => {
  return useQuery<GetTaskResponse>({
    queryKey: ['task', taskId],
    queryFn: () => taskService.getTask({ taskId }),
    enabled: !!taskId,
  });
};

export const useTaskHistory = (taskId: string) => {
  return useQuery<GetTaskHistoryResponse>({
    queryKey: ['taskHistory', taskId],
    queryFn: () => taskService.getTaskHistory({ taskId }),
    enabled: !!taskId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CreateTaskResponse, Error, CreateTaskRequest>({
    mutationFn: taskService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UpdateTaskResponse, Error, UpdateTaskRequest>({
    mutationFn: taskService.updateTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', data.task.id] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: taskService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Task[], Error, { taskIds: string[]; updates: Partial<Task> }>({
    mutationFn: ({ taskIds, updates }) => taskService.bulkUpdateTasks(taskIds, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useBulkDeleteTasks = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string[]>({
    mutationFn: taskService.bulkDeleteTasks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};