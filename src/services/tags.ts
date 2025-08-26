import { apiClient } from './api';
import { Tag } from '../types/api';
import { mockTags } from '../utils/mockData';

export interface CreateTagRequest {
  name: string;
  color: string;
}

export interface UpdateTagRequest {
  tagId: string;
  name: string;
  color: string;
  version: number;
}

export interface ListTagsRequest {
  includeDeleted?: boolean;
  searchQuery?: string;
  pageSize?: number;
  pageToken?: string;
}

export interface ListTagsResponse {
  tags: Tag[];
  nextPageToken?: string;
  totalCount: number;
}

export const tagService = {
  async listTags(request: ListTagsRequest = {}): Promise<ListTagsResponse> {
    // Mock implementation - replace with actual API call later
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredTags = [...mockTags];
    
    if (request.searchQuery) {
      const searchLower = request.searchQuery.toLowerCase();
      filteredTags = filteredTags.filter(tag => 
        tag.name.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      tags: filteredTags,
      totalCount: filteredTags.length,
    };
  },

  async createTag(request: CreateTagRequest): Promise<Tag> {
    // Mock implementation - replace with actual API call later
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newTag: Tag = {
      id: `tag_${Date.now()}`,
      name: request.name,
      color: request.color,
      creatorId: '1',
      version: 1,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockTags.push(newTag);
    return newTag;
  },

  async updateTag(request: UpdateTagRequest): Promise<Tag> {
    // Mock implementation - replace with actual API call later
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const tagIndex = mockTags.findIndex(tag => tag.id === request.tagId);
    if (tagIndex === -1) {
      throw new Error('Tag not found');
    }
    
    const updatedTag: Tag = {
      ...mockTags[tagIndex],
      name: request.name,
      color: request.color,
      version: request.version + 1,
      updatedAt: new Date().toISOString(),
    };
    
    mockTags[tagIndex] = updatedTag;
    return updatedTag;
  },

  async deleteTag(tagId: string, version: number): Promise<void> {
    // Mock implementation - replace with actual API call later
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const tagIndex = mockTags.findIndex(tag => tag.id === tagId);
    if (tagIndex === -1) {
      throw new Error('Tag not found');
    }
    
    mockTags.splice(tagIndex, 1);
  },
};