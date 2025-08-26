import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService, ListTagsRequest, CreateTagRequest, UpdateTagRequest } from '../services/tags';
import { Tag } from '../types/api';

export const useTags = (request: ListTagsRequest = {}) => {
  return useQuery({
    queryKey: ['tags', request],
    queryFn: () => tagService.listTags(request),
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Tag, Error, CreateTagRequest>({
    mutationFn: tagService.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Tag, Error, UpdateTagRequest>({
    mutationFn: tagService.updateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation<void, Error, { tagId: string; version: number }>({
    mutationFn: ({ tagId, version }) => tagService.deleteTag(tagId, version),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
};