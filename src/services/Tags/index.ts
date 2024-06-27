/// TODO
import axios from 'services/http';
import { TagDetailAppType, TagType, TagsAppType } from './type';

export const getTagsListService = (queryText: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<TagsAppType>>>(
    `/inventory/tags${queryText ? `?${queryText}` : ''}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const getTagDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<TagType>>(`/inventory/tags/${id}`, {
    requireAuthentication: true,
    signal
  });

export const updateTagsService = (id: string, formData: TagDetailAppType) =>
  axios.put<BaseAPIResponse<TagDetailAppType>>(
    `/inventory/tags/${id}`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

export const createTagsService = (formData: TagDetailAppType) =>
  axios.post<BaseAPIResponse<TagDetailAppType>>(
    `/inventory/tags`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

export const deleteTagsService = (id: string) =>
  axios.delete<BaseAPIResponse<TagDetailAppType>>(`/inventory/tags/${id}`, {
    requireAuthentication: true
  });
