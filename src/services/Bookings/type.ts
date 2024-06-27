import { BaseDataAppType, GuestInfo, PaymentAccountType, TimeSliceBookingType } from '@types';
import { ServiceSelectedType } from 'pages/@orion/ReservationsPage/partials/booking/FormCreateBooking';
import { ReservationDetailAppType, ReservationDetailType } from 'services/Reservation/type';

// booking

export interface BookingResDetailType {
  arrival?: number;
  departure?: number;
  adults?: number;
  primaryGuest?: GuestInfo;
  timeSlice?: TimeSliceBookingType;
  childrenAges?: string[];
  bookerComment?: string;
  additionalGuests?: GuestInfo[];
  channelCode?: string;
  services?: ServiceSelectedType[];
  guaranteeType?: string;
  corporateCode?: string;
  promoCode?: string;
  propertyId?: string;
  bundlePriceId?: string;
}

export interface BookerPayloadProps {
  booker: GuestInfo;
}

export interface BookingPayloadProps {
  booker?: GuestInfo;
  bookerComment?: string;
  reservations?: BookingResDetailType[];
  vouchers?: string[];
}
export default interface BookingDetailProps {
  booker?: GuestInfo;
  bookerComment?: string;
  created?: string;
  id: string;
  modified?: string;
  paymentAccount?: PaymentAccountType;
  reservations?: ReservationDetailType[];
  comment?: string;
}

export interface BookingDetailAppType extends BaseDataAppType<BookingDetailProps> {
  reservations?: ReservationDetailAppType[];
}
