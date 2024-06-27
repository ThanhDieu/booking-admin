/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseType, ExtendedDataType } from '@types';
import { ActivityType } from 'services/Activity/type';
import { LandscapeType } from 'services/Landscape/type';
import { PropertyDetailAppType } from 'services/Properties/type';
import { TagDetailAppType } from 'services/Tags/type';

export interface BundleServiceType {
  originalPrice: number;
  overwritePrice: number;
  serviceId?: string;
  name?: string;
  mode?: string;
}

export interface TimeSliceBundlePriceDetailType {
  from: number;
  to: number;
  originalPrice: number;
  overwritePrice: number;
  totalPrice: number;
  initialPrice: number;
  currency?: string;
  includedServices?: {
    serviceId: string;
    name: string;
    originalPrice: number;
    overwritePrice: number;
    mode: string;
  }[];
}

export interface GetBundlePriceTypeV2 extends BaseType {
  bundlePriceId: string;
  unitGroup: {
    name: string;
    title: string;
    description: string;
    maxPersons: number;
    extId: string;
    version: string;
    size: number;
    availableUnits: number;
    maximumDiscount?: number;
    minimumPrice?: number;
    extendedData?: {
      [key: string]: ExtendedDataType;
    };
  };
  ratePlan: {
    name: string;
    extId: string;
    version: string;
    description: string;
    type?: string;
  };
  property?: PropertyDetailAppType;
  category: number;
  discount: number;
  totalPrice: number;
  initialPrice?: number;
  timeSliceDefinitions?: TimeSliceBundlePriceDetailType[];
  bundleName?: string;
  currency?: string;
  priceMin?: number;
  bundleId?: string;
  periods?: { start: number; end: number }[];
}
export interface BundlePriceType {
  bundlePriceId: string;
  unitGroupId: string;
  ratePlanId: string;
  category: number;
  discount: number;
  initialPrice: number;
  originalPrice: number;
  overwritePrice: number;
  totalPrice: number;
  availableForBooking: boolean;
}

export interface BundleBaseType {
  title: string;
  description?: string;
  periods: {
    start: number;
    end: number;
  }[];
  daysOfWeek?: string[];
  minimumStay?: number;
  maximumStay?: number;
  bundlePrices: BundlePriceType[];
  bundleServices: BundleServiceType[];
  createdBy: string; // User Id
  currency: string;
  media: string[];
}

export interface BundleType extends BaseType {
  bundleId: string;
  disabled: boolean;
  isTemplate: boolean;
  isNewsletter?: boolean;
  archived: boolean;
  online: boolean;
  isHolidayPackage: boolean;
  property: PropertyDetailAppType;
  activities: ActivityType[];
  mainActivity: string;
  specialBundle?: SpecialBundleType;
  tags: TagDetailAppType[];
  landscape: LandscapeType;
  media: string[];
  createdBy: string;
  currency: string;
  status: string;
  periods: {
    start: number;
    end: number;
  }[];
  daysOfWeek: string[];
  minimumStay: number;
  maximumStay: number;
  bundleServices?: BundleServiceType[];
  isHomePage?: boolean;
  isHotelPage?: boolean;
  isTopicPage?: boolean;
  extendedData?: any;
  isArchive?: boolean;
}

export interface BundleListType extends BundleType {
  bundlePrices: GetBundlePriceTypeV2[];
}

export interface BundleDetailType extends BundleType {
  bundlePrices: BundlePriceType[];
}

export interface BundlePayloadCreateType extends BundleBaseType {
  propertyId: string;
  activityIds?: string[];
  specialBundleId?: string;
  landscapeId?: string;
  tagIds?: string[];
  isTemplate: boolean;
  extendedData?: {
    [key: string]: ExtendedDataType;
  };
  priceMin?: number;
  isNewsletter: boolean;
}

export interface BundlePayloadUpdateType {
  title: string;
  description: string;
  extendedData?: {
    [key: string]: ExtendedDataType;
  };
  isTemplate: boolean;
  activityIds: string[];
  specialBundleId?: string;
  landscapeId: string;
  tagIds: string[];
  media: string[];
  online: boolean;
  disabled: boolean;
}

export interface BundlePayloadDuplicateType {
  period?: {
    start: number;
    end: number;
  }[];
  isTemplate?: boolean;
}

//? Special Bundle
export interface SpecialBundleType {
  name: string;
  specialBundleId: string;
  title: string;
  icons: {
    light: string;
    dark: string;
  };
  extendedData?: {
    [key: string]: ExtendedDataType;
  };
}

export interface BundleSettingPayloadType {
  homePageMax?: number;
  hotelPageMax?: number;
  propertyId?: string;
}

export interface BundleSettingType extends BundleSettingPayloadType {
  property: PropertyDetailAppType;
}

export interface LocaleSettingOptionType {
  options: {
    label: string;
    value: string;
  }[];
  mandatoryLocaleList: string[] | undefined;
}

export interface SendNewsletterPayload {
  bundle_id: string;
  token: string;
}
