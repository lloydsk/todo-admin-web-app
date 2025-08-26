import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/users';
import {
  ListUsersRequest,
  ListUsersResponse,
  GetUserResponse,
  User,
} from '../types/api';

export const useUsers = (request: ListUsersRequest = {}) => {
  return useQuery<ListUsersResponse>({
    queryKey: ['users', request],
    queryFn: () => userService.listUsers(request),
  });
};

export const useUser = (userId: string) => {
  return useQuery<GetUserResponse>({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser({ userId }),
    enabled: !!userId,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, Partial<User>>({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, { userId: string; userData: Partial<User> }>({
    mutationFn: ({ userId, userData }) => userService.updateUser(userId, userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, string>({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, string>({
    mutationFn: userService.suspendUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<User, Error, string>({
    mutationFn: userService.activateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
    },
  });
};