import http from 'services/http';
import { FunctionType } from './type';

export const getAllFunctionService = (signal?: AbortSignal) =>
  http.get<BaseAPIResponse<Array<FunctionType>>>(`/functions`, {
    requireAuthentication: true,
    signal
  });

export const createFunctionService = (formData: FunctionType, signal?: AbortSignal) =>
  http.post<BaseAPIResponse<FunctionType>>(
    `/functions`,
    { ...formData },
    {
      requireAuthentication: true,
      signal
    }
  );

export const getFunctionDetailService = (id: string, signal?: AbortSignal) =>
  http.get<BaseAPIResponse<Array<FunctionType>>>(`/functions/${id}`, {
    requireAuthentication: true,
    signal
  });

export const updateFunctionService = (id: string, formData: FunctionType, signal?: AbortSignal) =>
  http.put<BaseAPIResponse<FunctionType>>(
    `/functions/${id}`,
    { ...formData },
    {
      requireAuthentication: true,
      signal
    }
  );

export const deleteFunctionService = (id: string, signal?: AbortSignal) =>
  http.delete<BaseAPIResponse<FunctionType>>(`/functions/${id}`, {
    requireAuthentication: true,
    signal
  });
