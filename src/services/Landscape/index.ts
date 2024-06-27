import axios from 'services/http';
import { LandscapePayload, LandscapeType } from './type';

export const getLandscapesService = (query = '', signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<LandscapeType>>>(`/inventory/landscapes?${query}`, {
    requireAuthentication: true,
    signal
  });

export const getLandscapeDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<LandscapeType>>(`/inventory/landscapes/${id}`, {
    requireAuthentication: true,
    signal
  });

export const createLandscapeService = (payload: LandscapePayload) =>
  axios.post<BaseAPIResponse<LandscapeType>>(
    `/inventory/landscapes`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );

export const updateLandscapeService = (id: string, payload: LandscapePayload) =>
  axios.put<BaseAPIResponse<LandscapeType>>(
    `/inventory/landscapes/${id}`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );

export const deleteLandscapeSrevice = (id: string) =>
  axios.delete<BaseAPIResponse<LandscapeType>>(`/inventory/landscapes/${id}`, {
    requireAuthentication: true
  });
