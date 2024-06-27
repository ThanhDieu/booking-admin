import axios from 'services/http';
import { RoomCategoryType, RoomCategoryPayload } from './type';

export const getRoomCategoryService = (query = '', signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<RoomCategoryType>>>(`/inventory/special-bundles?${query}`, {
    requireAuthentication: true,
    signal
  });

export const getRoomCategoryDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<RoomCategoryType>>(`/inventory/special-bundles/${id}`, {
    requireAuthentication: true,
    signal
  });

export const createRoomCategoryService = (payload: RoomCategoryPayload) =>
  axios.post<BaseAPIResponse<RoomCategoryType>>(
    `/inventory/special-bundles`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );

export const updateRoomCategoryService = (id: string, payload: RoomCategoryPayload) =>
  axios.put<BaseAPIResponse<RoomCategoryType>>(
    `/inventory/special-bundles/${id}`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );

export const deleteRoomCategoryService = (id: string) =>
  axios.delete<BaseAPIResponse<RoomCategoryType>>(`/inventory/special-bundles/${id}`, {
    requireAuthentication: true
  });
