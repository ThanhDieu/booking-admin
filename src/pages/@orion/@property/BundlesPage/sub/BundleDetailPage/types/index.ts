/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dayjs } from 'dayjs';
import { MediaStrapiType } from 'services/@strapi/type';

export type InitPricingType = {
  standard?: number;
  overwrite?: number;
  discount?: number;
  price?: number;
};
export interface InitBaseType extends InitPricingType {
  category?: number;
  unit_group?: string;
  rate_plan?: string;
}

export interface InitServiceType extends InitPricingType {
  title?: string;
}

export interface InitialBundleType {
  title: {
    [key: string]: string;
  };
  description?: {
    [key: string]: any;
  };
  is_holiday_package?: boolean;
  currency: string;
  activities?: string[];
  special_bundle?: string[];
  landscape?: string;
  tags?: (string | undefined)[];
  disabled: boolean;
  is_template: boolean;
  periods?: (Dayjs[] | undefined)[];
  days_of_week?: string[];
  base: InitBaseType[];
  services_include: InitServiceType[];
  upgrade?: InitBaseType[];
  media?: MediaStrapiType[];
  extra?: MediaStrapiType[];
  online?: boolean;
  status?: string;
}
