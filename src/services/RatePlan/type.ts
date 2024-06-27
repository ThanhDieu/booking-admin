import {
  AccountingConfigs,
  AgeCategories,
  BaseDataAppType,
  BaseType,
  CancellationPolicy,
  DefaultGrossPrice,
  IncludedServices,
  NoShowPolicy,
  PeriodTime,
  PricingRule,
  Restrictions,
  Surcharge,
  TimeSliceDefinition
} from '@types';

///////// Rate plan /////////
export interface RatePlanPayload extends BaseType {
  unitGroup: BaseType;
  property: BaseType;
  cancellationPolicy: CancellationPolicy;
  noShowPolicy?: NoShowPolicy;
  channelCodes: string[];
  isSubjectToCityTax: boolean;
  minGuaranteeType: string;
  priceCalculationMode: 'Truncate' | 'Round';
  ratesRange?: PeriodTime;
  restrictions?: Restrictions;
  timeSliceDefinition?: TimeSliceDefinition;
  pricingRule: PricingRule;
  surcharges?: Surcharge[];
  ageCategories?: AgeCategories[];
  accountingConfigs: AccountingConfigs[];
  includedServices?: IncludedServices;
  promoCodes: string[];
  bookingPeriod?: PeriodTime[];
}

export interface RatePlanDetail extends RatePlanPayload {
  derivationLevel?: number;
  isBookable: boolean;
  isDerived: boolean;
}

export interface RatePlanDetailAppType extends BaseDataAppType<RatePlanDetail> {}

///////// Rate /////////
export interface RateDetail extends BaseType {
  from: string;
  to: string;
  includedServicesPrice: DefaultGrossPrice;
  price: DefaultGrossPrice;
  ratePlanId: string;
}

export interface RateDetailAppType extends BaseDataAppType<RateDetail> {
  priority: number;
  fromTimestamp: string;
  toTimestamp: string;
  price: number;
}

export interface AllRateOfRatePlanAppType {
  ratePlanId: string;
  rates: RateDetailAppType[];
}

export interface RatePlanResType extends BaseType {
  isSubjectToCityTax: boolean;
  extId?: string;
}

export interface RateByDayType {
  priority: number;
  disabled: boolean;
  version: string;
  fromTimestamp: number;
  toTimestamp: number;
  price: number;
  currency: string;
  data: any;
}
