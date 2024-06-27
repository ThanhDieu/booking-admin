import axios from 'services/http';
import {
  BundleDetailType,
  BundleListType,
  BundlePayloadCreateType,
  BundlePayloadDuplicateType,
  BundlePayloadUpdateType,
  BundleSettingType,
  SpecialBundleType,
  BundleSettingPayloadType,
  SendNewsletterPayload
} from './type';
import http from 'services/http';

//? Bundle
export const getBundlesService = (queries: string, signal?: AbortSignal) => {
  return axios.get<BaseAPIResponse<Array<BundleListType>>>(`/bundles?${queries}`, {
    requireAuthentication: true,
    signal
  });
};

export const getBundleDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<BundleDetailType>>>(`/bundles/${id}`, {
    requireAuthentication: true,
    signal
  });

export const createBundleService = (formData: BundlePayloadCreateType) =>
  axios.post<BaseAPIResponse<Array<BundlePayloadCreateType>>>(
    `/bundles`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

export const duplicateBundleService = (id: string, payload: BundlePayloadDuplicateType) =>
  axios.post<BaseAPIResponse<Array<BundlePayloadCreateType>>>(
    `/bundles/${id}/duplicate`,
    {
      ...payload
    },
    { requireAuthentication: true }
  );

export const handleHolidayBundlesService = (formData: string[]) =>
  axios.post<BaseAPIResponse<Array<string[]>>>(`/bundles/holiday`, formData, {
    requireAuthentication: true
  });

export const updateBundleService = (id: string, formData: BundlePayloadUpdateType) =>
  axios.put<BaseAPIResponse<Array<BundlePayloadUpdateType>>>(
    `/bundles/${id}`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

export const deleteBundleService = (id: string) =>
  axios.delete<BaseAPIResponse<string>>(`/bundles/${id}`, {
    requireAuthentication: true
  });

//? Special Bundle
export const getSpecialBundlesService = (query = '', signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<SpecialBundleType>>>(
    `/inventory/special-bundles${query ? `?${query}` : ''}`,
    {
      requireAuthentication: true,
      signal
    }
  );

//Setting bundle
export const getBundleSettingService = (propertyId?: string, signal?: AbortSignal) =>
  http.get<BaseAPIResponse<Array<BundleSettingType>>>(
    `/settings/bundle${propertyId ? `?propertyId=${propertyId}` : ''}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const updateBundleSettingService = (
  formData?: BundleSettingPayloadType,
  propertyId?: string,
  signal?: AbortSignal
) =>
  http.put<BaseAPIResponse<Array<BundleSettingType>>>(
    `/settings/bundle${propertyId ? `/${propertyId}` : ''}`,
    { ...formData },
    {
      requireAuthentication: true,
      signal
    }
  );

//Send newsletter
export const triggerSendNewsletterService = (formData: SendNewsletterPayload) =>
  http.post<BaseAPIResponse<SendNewsletterPayload>>(
    `/3ae173f3-597f-42ae-ada4-b7a817e50c67`,
    { ...formData },
    {
      newUrl: `${import.meta.env.REACT_APP_BASE_PREFIX_WEBHOOK_AUTOMATE}`,
      requireAuthentication: true
    }
  );
