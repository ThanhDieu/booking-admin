import {
  BankAccount,
  FieldInDiffLang,
  AddressType,
  BaseDataAppType,
  BaseType,
  MediaType,
  CompanyDetailsType,
  BaseParamsType
} from '@types';
import { TagDetailAppType } from 'services/Tags/type';

export interface PropertyPayload extends BaseType {
  location: AddressType;
  currencyCode: 'EUR' | 'USD';
  timeZone: 'Europe/Berlin';
  isTemplate: boolean;
  defaultCheckInTime?: string;
  defaultCheckOutTime?: string;
  taxId?: string;
  bankAccount?: BankAccount;
  companyName?: string;
  managingDirectors?: string;
  commercialRegisterEntry?: string;
}

export interface PropertyDetail extends PropertyPayload {
  propertyTemplateIs?: string;
  paymentTerms?: FieldInDiffLang;
  created?: string;
  status?: string;
  isArchived?: string;
}

export interface Properties extends PropertyPayload {
  id: string;
  status: string;
}

export interface PropertyDetailAppType extends BaseDataAppType<PropertyDetail> {
  unavailableBookingOnline?: {
    start: number;
    end: number;
  };
  city?: string;
  country?: string;
  tags?: TagDetailAppType[];
  media?: string[];
  timeSliceDefinition?: {
    checkInTime: string;
    checkOutTime: string;
    name?: 'Over Night' | 'Day use';
  };
  currency?: string;
  homePageMax?: number;
  hotelPageMax?: number;
}

export interface PropertiesAppType extends DataResponseType<PropertyPayload> {}
export interface PropertyParamsType extends BaseParamsType {
  code: string;
  comment?: string;
  companyDetails?: CompanyDetailsType;
  end?: number;
  landScapeId?: string;
  location?: AddressType;
  propertyMedias?: MediaType[];
  start?: number;
  status?: string;
  bankAccount?: BankAccount;
  timeZone?: string;
  currencyCode?: string;
  media?: string[];
}
