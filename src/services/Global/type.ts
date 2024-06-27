import { paths } from 'constant';

export interface GlobalSearchItemType {
  id: string;
  name: string;
  properties?: string[] | string;
  isGlobal?: boolean;
  property?: string;
  isTemplate?: boolean;
  type?: string;
}

export interface GlobalSearchItemTypeV2 {
  Category: string;
  Id: string;
  Name: string;
  Description?: string;
  IsTemplate?: boolean;
  Property?: string;
  Type?: string;
  IsGlobal?: boolean;
  Code?: string;
  GuestFullName?: string;
  Properties?: string;
  Disabled?: boolean;
}
export type GlobalSearchType = {
  [key in keyof typeof paths]: GlobalSearchItemType[];
};
