import axios from 'services/http';
import { BookerPayloadProps, BookingDetailAppType, BookingPayloadProps } from './type';
import { GuestInfo } from '@types';

export const getReservationsByBookingIdService = (queryText: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<BookingDetailAppType>>>(
    `/bookings/reservations${queryText ? `?${queryText}` : ''}`,
    {
      requireAuthentication: true,
      signal
    }
  );

export const getBookingByIdService = (bookingId: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<BookingDetailAppType>>>(`/bookings/${bookingId}`, {
    requireAuthentication: true,
    signal
  });

export const createBookingService = (payload: BookingPayloadProps) =>
  axios.post<BaseAPIResponse<BookingPayloadProps>>(
    `/bookings`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );

export const createReservationByBookingId = (bookingId: string, payload: BookingPayloadProps) =>
  axios.post<BaseAPIResponse<BookingPayloadProps>>(
    `/bookings/${bookingId}/reservations`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );

//update booker||primaryguest||comment
export const updateBookingService = (bookingId: string, payload: BookerPayloadProps) =>
  axios.patch<BaseAPIResponse<GuestInfo>>(
    `bookings/${bookingId}`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );
