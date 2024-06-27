import { RatePlanResType } from 'services/RatePlan/type';
import { BaseType } from './BaseType';
import { UnitResAppType } from 'services/Units/type';
import { BaseAmount, DefaultGrossPrice } from '@types';

export interface ActionType {
  action: string;
  isAllowed: boolean;
  reasons?: {
    code: string;
    message: string;
  }[];
}
export interface TimeSliceType {
  from: string;
  to: string;
  serviceDate: string;
  ratePlan: RatePlanResType;
  unitGroup: BaseType;
  unit: UnitResAppType;
  baseAmount: BaseAmount;
  totalGrossAmount: DefaultGrossPrice;
  actions: ActionType[];
}

export interface TimeSliceBookingType {
  ratePlanId: string;
  totalAmount: DefaultGrossPrice;
}
