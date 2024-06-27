import axios from 'services/http';
import { BundleTaskType, TaskPayLoadType, TaskType } from './type';

export const getTasksService = (queryText: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<TaskType>>>(`/tasks${queryText ? `?${queryText}` : ''}`, {
    requireAuthentication: true,
    signal
  });

export const getBundleHasTasksService = (queryText: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<BundleTaskType>>>(
    `/bundles/tasks${queryText ? `?${queryText}` : ''}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const getTaskDetailService = (code: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<TaskType>>>(`/tasks/${code}`, {
    requireAuthentication: true,
    signal
  });

export const updateTaskService = (id: string, formData: TaskPayLoadType) =>
  axios.put<BaseAPIResponse<Array<TaskType>>>(
    `/tasks/${id}`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

export const createTaskService = (formData: TaskType) =>
  axios.post<BaseAPIResponse<Array<TaskType>>>(
    `/tasks`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

export const deleteTaskService = (id: string) =>
  axios.delete<BaseAPIResponse<string>>(`/tasks/${id}`, {
    requireAuthentication: true
  });
