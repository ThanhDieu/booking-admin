import http from 'services/http';
import { VoucherCreatePayload, VoucherType } from './type';

export const getVouchersListService = (queryText: string, signal?: AbortSignal) =>
  http.get<BaseAPIResponse<Array<VoucherType>>>(`/vouchers${queryText ? `?${queryText}` : ''}`, {
    requireAuthentication: true,
    signal
  });

export const checkVoucherService = (propertyId: string, code: string, signal?: AbortSignal) =>
  http.get<BaseAPIResponse<Array<VoucherType>>>(
    `/vouchers/check?propertyId=${propertyId}&code=${code}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const createVoucherService = (formData: VoucherCreatePayload, signal?: AbortSignal) =>
  http.post<BaseAPIResponse<VoucherCreatePayload>>(
    `/vouchers`,
    { ...formData },
    {
      requireAuthentication: true,
      signal
    }
  );

export const setInvalidVoucherService = (voucherId: string, signal?: AbortSignal) =>
  http.put<BaseAPIResponse<VoucherType>>(`/vouchers/${voucherId}/invalid`, {
    requireAuthentication: true,
    signal
  });
