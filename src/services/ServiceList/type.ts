import {
  AccountingConfigs,
  BaseDataAppType,
  BaseParamsType,
  BaseType,
  DefaultGrossPrice
} from '@types';
import { daysOfWeek, vatType } from 'configs/const/general';
import { PropertyDetailAppType } from 'services/Properties/type';
import { TagDetailAppType } from 'services/Tags/type';

export interface AvailabilityType {
  daysOfWeek: keyof typeof daysOfWeek;
  mode: 'Departure' | 'Daily' | 'Arrival';
  quantity?: number;
}

export interface ServiceGeneralInfo extends BaseType {
  defaultGrossPrice: DefaultGrossPrice;
  pricingUnit: 'Person' | 'Room';
}
export interface ServiceType extends ServiceGeneralInfo {
  serviceType: string;
  validFrom: string;
  vatType: keyof typeof vatType;
  channelCodes: string[];
  availability: AvailabilityType;
  postNextDay?: boolean;
  property: {
    id: string;
  };
  accountingConfigs: AccountingConfigs[];
  extId?: string;
  price?: number;
  mode: 'Departure' | 'Daily' | 'Arrival';
}

export interface ServiceDetailAppType extends BaseDataAppType<ServiceType> {
  discount: number;
  property: PropertyDetailAppType;
  title?: string;
  serviceType?: TagDetailAppType[];
  price: number;
  key?: string;
  count?: number;
  serviceId?: string;
  media?: string[];
  popular?: boolean;
  tags?: TagDetailAppType[];
  mode?: string;
  disabled?: boolean;
  type?: string;
  when?: string;
}

export interface ServicesAppType extends DataResponseType<ServiceDetailAppType> { }

export interface ServiceMedia {
  file: string;
  title: string;
  disabled?: boolean;
  serviceId?: string;
}
export interface ServiceParamsType extends BaseParamsType {
  defaultGrossPrice?: DefaultGrossPrice;
  propertyId?: string;
  code?: string;
  serviceMedias?: ServiceMedia[];
  availability?: AvailabilityType;
  channelCodes?: string[];
  pricingUnit?: 'Person' | 'Room';
  serviceType?: string[];
  validFrom?: string;
  vatType?: string;
  media?: string[];
  popular?: boolean;
}
