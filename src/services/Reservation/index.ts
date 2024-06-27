/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'services/http';
import { ReservationDetailType, ServiceParamsReservationType } from './type';
import { GuestInfo } from '@types';
import { UnitsAppType } from 'services/Units/type';

export const getReservationListService = (queryText: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<ReservationDetailType>>>(`/bookings/reservations?${queryText}`, {
    requireAuthentication: true,
    signal
  });

export const getReservationDetailService = (propetyId: string, id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<ReservationDetailType>>(
    `/bookings/reservations/${id}?propertyId=${propetyId}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const actionReservationCheckinService = (id: string) =>
  axios.put<BaseAPIResponse<ReservationDetailType>>(
    `/bookings/reservation-actions/${id}/checkin`,
    {},
    { requireAuthentication: true }
  );

export const actionReservationCheckoutService = (id: string) =>
  axios.put<BaseAPIResponse<ReservationDetailType>>(
    `/bookings/reservation-actions/${id}/checkout`,
    {},
    { requireAuthentication: true }
  );

export const actionReservationCancelService = (id: string) =>
  axios.put<BaseAPIResponse<ReservationDetailType>>(
    `/bookings/reservation-actions/${id}/cancel`,
    {},
    { requireAuthentication: true }
  );

export const assignUnitReservationService = (id: string, unitId?: string, params?: any) =>
  axios.put<BaseAPIResponse<ReservationDetailType>>(
    `/bookings/reservation-actions/${id}/assign-unit${unitId ? `/${unitId}` : ''}`,
    { ...params },
    { requireAuthentication: true }
  );

export const amendReservationService = (id: string, params: any) =>
  axios.put<BaseAPIResponse<ReservationDetailType>>(
    `/bookings/reservation-actions/${id}/amend`,
    { ...params },
    { requireAuthentication: true }
  );

export const updateReservationService = (reservationId: string, payload: any) =>
  axios.patch<BaseAPIResponse<GuestInfo>>(
    `bookings/reservations/${reservationId}`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );

export const unassignUnitReservationService = (id: string) =>
  axios.put<BaseAPIResponse<ReservationDetailType>>(
    `/bookings/reservation-actions/${id}/unassign-unit`,
    {},
    { requireAuthentication: true }
  );

export const addServiceReservationService = (id: string, params: ServiceParamsReservationType) =>
  axios.put<BaseAPIResponse<ReservationDetailType>>(
    `/bookings/reservation-actions/${id}/book-service`,
    { ...params },
    { requireAuthentication: true }
  );
export const removeServiceReservationService = (id: string, serviceId: string) =>
  axios.delete<BaseAPIResponse<ReservationDetailType>>(
    `/bookings/reservations/${id}/service?serviceId=${serviceId}`,
    {
      requireAuthentication: true
    }
  );

export const getAvailabilityUnitsByReservationService = (
  id: string,
  queryText: string,
  signal?: AbortSignal
) => {
  return axios.get<BaseAPIResponse<Array<UnitsAppType>>>(
    `/inventory/availability/v1/reservations/${id}/units${queryText ? `?${queryText}` : ''}`,
    {
      requireAuthentication: true,
      signal
    }
  );
};
