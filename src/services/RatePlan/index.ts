import axios from 'services/http';
import { RateDetailAppType, RatePlanDetailAppType } from './type';

//////// Rateplan area ////////
export const getRatePlanListService = (
  propertyId: string,
  unitGroupId: string[] = [''],
  signal?: AbortSignal
) =>
  axios.get<BaseAPIResponse<Array<RatePlanDetailAppType>>>(
    `/rateplans?propertyId=${propertyId}&unitGroupId=${unitGroupId}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const getRatePlanDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<RatePlanDetailAppType>>(`/rateplans/${id}`, {
    requireAuthentication: true,
    signal
  });

export const updateRatePlanService = (id: string, params: RatePlanDetailAppType) =>
  axios.put<BaseAPIResponse<RatePlanDetailAppType>>(
    `/rateplans/${id}`,
    {
      ...params
    },
    { requireAuthentication: true }
  );

export const createRatePlanService = (params: RatePlanDetailAppType) =>
  axios.post<BaseAPIResponse<RatePlanDetailAppType>>(
    `/rateplans`,
    {
      ...params
    },
    { requireAuthentication: true }
  );

export const deleteRatePlanService = (id: string) =>
  axios.delete<BaseAPIResponse<RatePlanDetailAppType>>(`/rateplans/${id}`, {
    requireAuthentication: true
  });

//////// Rate area ////////
export const getRatesService = (
  propertyId: string,
  from?: string,
  to?: string,
  ratePlanIds: string[] = [''],
  signal?: AbortSignal
) =>
  axios.get<BaseAPIResponse<Array<RateDetailAppType>>>(
    `/rateplans/rates?ratePlanIds=${ratePlanIds.join(
      ','
    )}&propertyId=${propertyId}&from=${from}&to=${to}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const getRateByDayService = (ratePlanId: string, from?: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<RateDetailAppType>>>(
    `/rateplans/rate-by-day?ratePlanId=${ratePlanId}&from=${from}`,
    {
      requireAuthentication: true,
      signal
    }
  );
