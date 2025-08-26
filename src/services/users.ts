import { apiClient } from './api';
import {
  ListUsersRequest,
  ListUsersResponse,
  GetUserRequest,
  GetUserResponse,
  User,
} from '../types/api';

export const userService = {
  async listUsers(request: ListUsersRequest = {}): Promise<ListUsersResponse> {
    const params = new URLSearchParams();
    
    if (request.pageInfo?.pageSize) {
      params.append('page_size', request.pageInfo.pageSize.toString());
    }
    
    if (request.pageInfo?.pageToken) {
      params.append('page_token', request.pageInfo.pageToken);
    }
    
    if (request.searchQuery) {
      params.append('search_query', request.searchQuery);
    }
    
    if (request.includeDeleted) {
      params.append('include_deleted', 'true');
    }

    return apiClient.get<ListUsersResponse>(`/api/v1/users?${params.toString()}`);
  },

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    return apiClient.get<GetUserResponse>(`/api/v1/users/${request.userId}`);
  },

  async createUser(userData: Partial<User>): Promise<User> {
    return apiClient.post<User>('/api/v1/users', userData);
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/api/v1/users/${userId}`, userData);
  },

  async deleteUser(userId: string): Promise<void> {
    return apiClient.delete(`/api/v1/users/${userId}`);
  },

  async suspendUser(userId: string): Promise<User> {
    return apiClient.patch<User>(`/api/v1/users/${userId}/suspend`);
  },

  async activateUser(userId: string): Promise<User> {
    return apiClient.patch<User>(`/api/v1/users/${userId}/activate`);
  },
};