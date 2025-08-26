import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, ListCategoriesRequest, CreateCategoryRequest, UpdateCategoryRequest } from '../services/categories';
import { Category } from '../types/api';

export const useCategories = (request: ListCategoriesRequest = {}) => {
  return useQuery({
    queryKey: ['categories', request],
    queryFn: () => categoryService.listCategories(request),
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Category, Error, CreateCategoryRequest>({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Category, Error, UpdateCategoryRequest>({
    mutationFn: categoryService.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { categoryId: string; version: number }>({
    mutationFn: ({ categoryId, version }) => categoryService.deleteCategory(categoryId, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};