import { GetBundlePriceTypeV2 } from 'services/Bundle/type';

export interface NewsletterType {
  id: string;
}

export interface BundleNewsletterPayload {
  name: string;
  bundleId: string;
  price: number;
  currency: string;
  periods: {
    start: number;
    end: number;
  }[];
  propertyId: string;
  propertyName: string;
}
export interface DataNewsletterPayload {
  name: string;
  intro: string;
  outro: string;
  bundles: BundleNewsletterPayload[];
  campaign?: {
    id: string;
    name: string;
  };
}

export enum NewsletterCreateType {
  newsletter = 'newsletter'
}

export interface NewsletterCreatePayload {
  data: {
    type: NewsletterCreateType.newsletter;
    data: DataNewsletterPayload;
  };
}
export interface NewsletterDetailType {
  createdAt: string;
  data: DataNewsletterPayload;
  id: number;
  publishedAt: string;
  type: 'newsletter';
  updatedAt: string;
}
export interface BundleNewsletterSelect {
  propertyId: string;
  bundles: GetBundlePriceTypeV2[];
}
