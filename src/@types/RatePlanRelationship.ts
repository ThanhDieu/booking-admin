// import { RatePlanType } from 'services/RatePlan/type';
import { BaseType } from './BaseType';

export interface NoShowPolicy extends BaseType {
  vat_type?: string;
  percent_value?: number;
  amount?: number;
  currercy?: string;
}
export interface CancellationPolicy extends NoShowPolicy {
  type?: 'Prior' | 'After';
  period?: Period;
}

export interface Period {
  hours: number;
  days: number;
  months: number;
  reference?: string;
}

export interface PeriodTime {
  id?: string;
  from: number | string;
  to: number | string;
}
export interface RatePlanService {
  service_id: string;
  pricing_mode: 'included' | 'additional';
}

export interface Restrictions {
  minAdvance?: {
    hours?: number | null;
    days?: number | null;
    months?: number | null;
  };
  maxAdvance?: {
    hours?: number | null;
    days?: number | null;
    months?: number | null;
  };
  lateBookingUntil?: string;
}

export interface Surcharge {
  value: number;
  type?: 'Absolute' | 'Percent';
  adults: number;
}

export interface AgeCategories {
  id: string;
  surcharges: Surcharge;
}

export interface TimeSliceDefinition {
  checkInTime?: string;
  checkOutTime?: string;
  id: string;
  name?: 'Over Night' | 'Day Use';
  template?: 'OverNight' | 'DayUse';
}
export interface PricingRule {
  baseRatePlan: {
    code?: string;
    description?: string;
    id?: string;
    isSubjectToCityTax?: boolean;
    name?: string;
  };
  type?: 'Absolute' | 'Percent';
  value: number;
}

export interface AccountingConfigs {
  validFrom: string;
  serviceType: string;
  subAccountId?: string;
  vatType: string;
}

export interface IncludedServices {
  grossPrice: {
    amount: number;
    currency: string;
  };
  pricingMode: 'Included' | 'Additional';
  service: BaseType;
}

export interface DefaultGrossPrice {
  amount: number;
  currency?: string;
}

export interface BaseAmount {
  grossAmount: number;
  netAmount: number;
  vatType: string;
  vatPercent: number;
  currency: string;
}
