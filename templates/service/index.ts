import axios from 'services/http';
import { SampleType } from './type';

export const getSampleListService = (signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<SampleType>>>(`/sample`, {
    requireAuthentication: true,
    signal
  });

export const getSampleDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<SampleType>>(`/sample/${id}`, {
    requireAuthentication: true,
    signal
  });

export const updateSampleService = (id: string, params: SampleType) =>
  axios.put<BaseAPIResponse<SampleType>>(
    `/sample/${id}`,
    {
      ...params
    },
    { requireAuthentication: true }
  );

export const createSampleService = (params: SampleType) =>
  axios.post<BaseAPIResponse<SampleType>>(
    `/sample`,
    {
      ...params
    },
    { requireAuthentication: true }
  );

export const deleteSampleService = (id: string) =>
  axios.delete<BaseAPIResponse<SampleType>>(`/sample/${id}`, { requireAuthentication: true });
