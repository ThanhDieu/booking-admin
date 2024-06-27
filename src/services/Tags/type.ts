import { BaseDataAppType, BaseType } from '@types';
import { PropertyType } from 'services/Users/types';

export interface TagType extends BaseType {
  // id: string;
  // name: FieldInDiffLang;
  count?: number;
  disabled: boolean;
  type: string;
  property?: PropertyType;
}

export interface TagDetailAppType extends BaseDataAppType {
  type: string;
  propertyIds: string[];
  title: string;
  status: boolean;
  color: string;
  tagId?: string;
  count?: number;
  isGlobal?: boolean;
  properties?: {
    extId: string;
    name: string;
  }[];
  icon?: string;
  extendedData?: {
    [key: string]: {
      [key: string]: string;
    };
  };
}
export interface TagsAppType extends DataResponseType<TagDetailAppType> {}
