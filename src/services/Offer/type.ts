import { BaseType, GuestInfo } from '@types';
import { BundleDetailType, BundlePriceType, GetBundlePriceTypeV2 } from 'services/Bundle/type';
import { PropertyDetailAppType } from 'services/Properties/type';
import { ServiceType } from 'services/ServiceList/type';
import { UnitGroupDetailType } from 'services/UnitGroups/type';

export interface BundleOfferType {
  bundlePriceId: string;
  adults: number;
  children?: string[];
  count: number;
  bundleUpgrade: BundlePriceType & {
    bundle: BundleDetailType;
    unitGroup: UnitGroupDetailType;
  };
}

export interface OfferPayloadType extends BaseType {
  arrival: number;
  departure: number;
  discount: number;
  price: number;
  propertyId: string;
  offerBundleUpgrades: BundleOfferType[];
  offerServices?: {
    count: number;
    service: ServiceType;
  }[];
  services?: {
    count: number;
    serviceId: string;
  }[];
  validity: number;
  booker: GuestInfo;
  status?: string;
  disabled?: boolean;
}

export interface OfferDetailType extends OfferPayloadType {
  offerId: string;
  status: string;
  createdAt: number;
  property?: PropertyDetailAppType;
}

export interface OfferInforType extends GuestInfo {
  discount?: number;
  name: string;
  price: number;
  validity: number;
}

export interface OfferBundleType extends GetBundlePriceTypeV2 {
  key?: string;
  totalGuest?: number;
  count: number;
  adults: number;
  children?: string[];
}

export interface OfferUpdateType {
  status: string;
  validity: number;
  disabled: boolean;
}
