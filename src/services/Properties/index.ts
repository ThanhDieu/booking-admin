/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'services/http';
import { PropertiesAppType, PropertyDetailAppType, PropertyParamsType } from './type';

export const propertyListService = (signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<PropertiesAppType>>>(`/inventory/properties?perPage=20`, {
    requireAuthentication: true,
    signal
  });

export const apiPropertyDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<PropertyDetailAppType>>>(`/inventory/properties/`, {
    requireAuthentication: true,
    signal
  });

export const apiPropertyUpdateService = (id: string, formData: PropertyParamsType) =>
  axios.put<BaseAPIResponse<Array<PropertyParamsType>>>(
    `/inventory/properties/`,
    {
      ...formData
    },
    {
      requireAuthentication: true
    }
  );
export const apiPropertyUpdateStatusService = (id: string, formData: { disabled: boolean }) =>
  axios.put<BaseAPIResponse<Array<PropertyParamsType>>>(
    `${id}/inventory/properties/status?disabled=${formData?.disabled || false}`,
    {},
    {
      requireAuthentication: true
    }
  );

export const apiPropertyCreateService = (formData: PropertyParamsType) =>
  axios.post<BaseAPIResponse<Array<PropertyParamsType>>>(
    `/inventory/properties/`,
    {
      ...formData
    },
    {
      requireAuthentication: true
    }
  );

export const apiPropertyDeleteService = (id: string) =>
  axios.delete<BaseAPIResponse<string>>(`/inventory/properties/`, {
    requireAuthentication: true
  });

/// has query

export const propertyListServiceV2 = (query?: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<PropertiesAppType>>>(
    `/inventory/properties${query ? `?${query}` : ''}`,
    {
      requireAuthentication: true,
      signal
    }
  );
