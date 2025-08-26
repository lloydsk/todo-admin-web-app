import { apiClient } from './api';
import { Category } from '../types/api';
import { mockCategories } from '../utils/mockData';

export interface CreateCategoryRequest {
  name: string;
  description: string;
  color: string;
  parentId?: string;
  isPublic: boolean;
}

export interface UpdateCategoryRequest {
  categoryId: string;
  name: string;
  description: string;
  color: string;
  parentId?: string;
  isPublic: boolean;
  version: number;
}

export interface ListCategoriesRequest {
  includeDeleted?: boolean;
  publicOnly?: boolean;
  pageSize?: number;
  pageToken?: string;
}

export interface ListCategoriesResponse {
  categories: Category[];
  nextPageToken?: string;
  totalCount: number;
}

export const categoryService = {
  async listCategories(request: ListCategoriesRequest = {}): Promise<ListCategoriesResponse> {
    // Mock implementation - replace with actual API call later
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    let filteredCategories = [...mockCategories];
    
    if (request.publicOnly) {
      filteredCategories = filteredCategories.filter(cat => cat.isPublic);
    }
    
    return {
      categories: filteredCategories,
      totalCount: filteredCategories.length,
    };
  },

  async createCategory(request: CreateCategoryRequest): Promise<Category> {
    // Mock implementation - replace with actual API call later
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name: request.name,
      description: request.description,
      color: request.color,
      parentId: request.parentId,
      isPublic: request.isPublic,
      creatorId: '1',
      version: 1,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockCategories.push(newCategory);
    return newCategory;
  },

  async updateCategory(request: UpdateCategoryRequest): Promise<Category> {
    // Mock implementation - replace with actual API call later
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const categoryIndex = mockCategories.findIndex(cat => cat.id === request.categoryId);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    const updatedCategory: Category = {
      ...mockCategories[categoryIndex],
      name: request.name,
      description: request.description,
      color: request.color,
      parentId: request.parentId,
      isPublic: request.isPublic,
      version: request.version + 1,
      updatedAt: new Date().toISOString(),
    };
    
    mockCategories[categoryIndex] = updatedCategory;
    return updatedCategory;
  },

  async deleteCategory(categoryId: string, version: number): Promise<void> {
    // Mock implementation - replace with actual API call later
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const categoryIndex = mockCategories.findIndex(cat => cat.id === categoryId);
    if (categoryIndex === -1) {
      throw new Error('Category not found');
    }
    
    mockCategories.splice(categoryIndex, 1);
  },
};