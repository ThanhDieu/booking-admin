import axios from 'services/http';
import { ServiceDetailAppType, ServiceParamsType, ServiceType, ServicesAppType } from './type';

// Get unit list by code
export const getServicesByPropertyService = (code: string, signal?: AbortSignal) => {
  return axios.get<BaseAPIResponse<Array<ServicesAppType>>>(
    `/rateplans/services?propertyId=${code}&expands=data`,
    {
      requireAuthentication: true,
      signal
    }
  );
};

export const getServiceDetail = (code: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<ServiceDetailAppType>>>(`/rateplans/services/${code}`, {
    requireAuthentication: true,
    signal
  });

export const updateServiceService = (id: string, formData: ServiceParamsType) =>
  axios.put<BaseAPIResponse<Array<ServiceType>>>(
    `/rateplans/services/${id}`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

export const createServiceService = (formData: ServiceParamsType) =>
  axios.post<BaseAPIResponse<Array<ServiceType>>>(
    `/rateplans/services`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

export const deleteServiceService = (id: string) =>
  axios.delete<BaseAPIResponse<string>>(`/rateplans/services/${id}`, {
    requireAuthentication: true
  });

export const getServicesByPropertyServiceV2 = (queryText: string, signal?: AbortSignal) => {
  return axios.get<BaseAPIResponse<Array<ServicesAppType>>>(
    `/rateplans/services${queryText ? `?${queryText}` : ''}&expands=data`,
    {
      requireAuthentication: true,
      signal
    }
  );
};
