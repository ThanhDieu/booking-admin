import axios from 'services/http';

import { CancellationPolicyAppType, NoShowPolicyAppType } from './type';

//CANCELLATION SERVICE
export const getCancellationListService = (propertyId: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<CancellationPolicyAppType>>>(
    `/rateplans/cancellation-policies?propertyId=${propertyId}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const getCancellationDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<CancellationPolicyAppType>>(`/rateplans/cancellation-policies/${id}`, {
    requireAuthentication: true,
    signal
  });

//NOSHOW SERVICE
export const getNoShowListService = (propertyId: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<NoShowPolicyAppType>>>(
    `/rateplans/no-show-policies?propertyId=${propertyId}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const getNoShowDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<NoShowPolicyAppType>>(`/rateplans/no-show-policies/${id}`, {
    requireAuthentication: true,
    signal
  });

// export const getPoliciesListService = (signal?: AbortSignal) =>
//   axios.get<BaseAPIResponse<Array<CancellationPolicyType | NoShowPolicyType>>>(`/policies`, {
//     requireAuthentication: true,
//     signal
//   });

// export const getPoliciesByTypeService = (type: string, signal?: AbortSignal) =>
//   axios.get<BaseAPIResponse<CancellationPolicyType | NoShowPolicyType>>(`/policies/${type}`, {
//     requireAuthentication: true,
//     signal
//   });

// export const getPoliciesDetailService = (code: string, signal?: AbortSignal) =>
//   axios.get<BaseAPIResponse<CancellationPolicyType | NoShowPolicyType>>(`/policies/${code}`, {
//     requireAuthentication: true,
//     signal
//   });

// export const updatePoliciesService = (
//   id: string,
//   params: CancellationPolicyType | NoShowPolicyType
// ) =>
//   axios.put<BaseAPIResponse<CancellationPolicyType | NoShowPolicyType>>(
//     `/policies`,
//     {
//       ...params
//     },
//     { requireAuthentication: true }
//   );

// export const createPoliciesService = (params: CancellationPolicyType | NoShowPolicyType) =>
//   axios.post<BaseAPIResponse<CancellationPolicyType | NoShowPolicyType>>(
//     `/policies`,
//     {
//       ...params
//     },
//     { requireAuthentication: true }
//   );

// export const deletePoliciesService = (id: string) =>
//   axios.delete<BaseAPIResponse<CancellationPolicyType | NoShowPolicyType>>(`/policies/${id}`, {
//     requireAuthentication: true
//   });
