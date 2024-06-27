import axios from 'services/http';
import { ActivitiesPayload, ActivityType } from './type';

export const getActivitiesService = (query = '', signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<ActivityType>>>(
    `/inventory/activities${query ? `?${query}` : ''}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const getActivityDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<ActivityType>>(`/inventory/activities/${id}`, {
    requireAuthentication: true,
    signal
  });

export const createActivitiesService = (payload: ActivitiesPayload) =>
  axios.post<BaseAPIResponse<ActivityType>>(
    `/inventory/activities`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );

export const updateActivitiesService = (id: string, payload: ActivitiesPayload) =>
  axios.put<BaseAPIResponse<ActivityType>>(
    `/inventory/activities/${id}`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );

export const deleteActivitiesSrevice = (id: string) =>
  axios.delete<BaseAPIResponse<ActivityType>>(`/inventory/activities/${id}`, {
    requireAuthentication: true
  });
