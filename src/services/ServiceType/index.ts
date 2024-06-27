import axios from 'axios';
// import '@mock';
import { ServiceTypeType } from './type';

export const getServiceTypesService = (signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<ServiceTypeType>>>(`/properties/service-types`, {
    requireAuthentication: true,
    signal
  });

export const getServiceTypesByCodeService = (code: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<ServiceTypeType>>>(`/properties/service-types/${code}`, {
    requireAuthentication: true,
    signal
  });

export const updateServiceTypeService = (id: string, formData: ServiceTypeType) =>
  axios.put<BaseAPIResponse<Array<ServiceTypeType>>>(
    `/properties/service-types/${id}`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

export const createServiceTypeService = (formData: ServiceTypeType) =>
  axios.post<BaseAPIResponse<Array<ServiceTypeType>>>(
    `/properties/service-types`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

export const deleteServiceTypeService = (id: string) =>
  axios.delete<BaseAPIResponse<string>>(`/properties/service-types/${id}`, {
    requireAuthentication: true
  });
