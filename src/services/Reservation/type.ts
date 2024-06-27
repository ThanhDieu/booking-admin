import {
  ActionType,
  BaseDataAppType,
  BaseType,
  DefaultGrossPrice,
  GuestInfo,
  PaymentAccountType,
  PolicyFee,
  ServiceResType,
  TimeSliceType
} from '@types';
import { BundleType, TimeSliceBundlePriceDetailType } from 'services/Bundle/type';
import { PropertyDetailAppType } from 'services/Properties/type';
import { RatePlanResType } from 'services/RatePlan/type';
import { UnitGroupDetailAppType } from 'services/UnitGroups/type';
import { UnitResAppType } from 'services/Units/type';

export enum ReservationAction {
  CheckIn = 1,
  CheckedOut = 2
}
export interface ReservationType {
  id: string;
}

type statusType = 'Confirmed' | 'InHouse' | 'Canceled' | 'CheckedOut' | 'NoShow';
export interface ReservationDetailType extends BaseType {
  adults: number;
  arrival: string;
  departure: string;
  primaryGuest: GuestInfo;
  childrenAges?: string[];
  additionalGuests?: GuestInfo[];
  services?: ServiceResType[];
  timeSlices: TimeSliceType[];
  guestComment?: string;
  comment?: string;
  channelCode?: string;
  corporateCode?: string;
  promoCode?: string;
  guaranteeType?: string;

  actions?: ActionType[];
  allFoliosHaveInvoice?: boolean;
  balance?: DefaultGrossPrice;
  booker?: GuestInfo;
  bookingId?: string;
  cancellationFee?: PolicyFee;
  checkInTime?: string;
  checkOutTime?: string;
  created?: string;
  hasCityTax?: boolean;
  id?: string;
  modified?: string;
  noShowFee?: PolicyFee;
  paymentAccount?: PaymentAccountType;
  property?: BaseType;
  ratePlan?: RatePlanResType;
  totalGrossAmount?: DefaultGrossPrice;
  unitGroup?: BaseType;
  status?: statusType;
  unit?: UnitResAppType;
  travelPurpose?: string;
}

export interface ReservationDetailAppType extends BaseDataAppType<ReservationDetailType> {
  arrivalTimestamp: string;
  departureTimestamp: string;
  unit?: UnitResAppType;
  unitGroup?: UnitGroupDetailAppType;
  timeSliceDefinitions?: TimeSliceBundlePriceDetailType[];
  property?: PropertyDetailAppType;
  bundle?: BundleType;
}

export interface ServiceParamsReservationType {
  serviceId: string;
  dates?: {
    serviceDate: string; //"2023-07-10",
    amount?: {
      amount: number;
      currency: string; //"EUR"
    };
    count?: number;
  }[];
  amount?: {
    amount: number;
    currency: string; //"EUR"
  };
  count?: number;
}
