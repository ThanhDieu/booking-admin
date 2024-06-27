import http from 'services/http';
import { OfferDetailType, OfferPayloadType, OfferUpdateType } from './type';

export const getOfferListService = (queryText: string, signal?: AbortSignal) =>
  http.get<BaseAPIResponse<Array<OfferDetailType>>>(`offers?${queryText}`, {
    requireAuthentication: true,
    signal
  });

export const getOfferDetailService = (id: string, signal?: AbortSignal) =>
  http.get<BaseAPIResponse<OfferDetailType>>(`/offers/${id}`, {
    requireAuthentication: true,
    signal
  });

export const updateOfferService = (id: string, formData: OfferUpdateType, signal?: AbortSignal) =>
  http.put<BaseAPIResponse<OfferDetailType>>(
    `/offers/${id}`,
    {
      ...formData
    },
    { requireAuthentication: true, signal }
  );

export const createOfferService = (formData: OfferPayloadType, signal?: AbortSignal) =>
  http.post<BaseAPIResponse<OfferDetailType>>(
    `/offers`,
    {
      ...formData
    },
    { requireAuthentication: true, signal }
  );

export const deleteOfferService = (id: string, signal?: AbortSignal) =>
  http.delete<BaseAPIResponse<OfferDetailType>>(`/offers/${id}`, {
    requireAuthentication: true,
    signal
  });

export const duplicateOfferService = (id: string, signal?: AbortSignal) =>
  http.post<BaseAPIResponse<OfferDetailType>>(
    `/offers/${id}/duplicate`,
    {},
    {
      requireAuthentication: true,
      signal
    }
  );
