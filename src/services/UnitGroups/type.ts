import { BaseDataAppType, BaseParamsType, BaseType } from '@types';
import { PropertyDetailAppType } from 'services/Properties/type';
import { TagDetailAppType } from 'services/Tags/type';
import { UnitDetailAppType } from 'services/Units/type';

export interface UnitGroupDetailType extends BaseType {
  maxPersons: number;
  memberCount: number;
  property: {
    id: string;
  };
  rank: number;
  type: string;
}
export interface UnitGroupDetailAppType extends BaseDataAppType<UnitGroupDetailType> {
  title?: string;
  description?: string;
  units: UnitDetailAppType[];
  property: PropertyDetailAppType;
  maxPersons?: number;
  rank?: number;
  ratePlans: BaseDataAppType[];
  tags?: TagDetailAppType[];
  media?: string[];
  minimumPrice?: number;
  maximumDiscount?: number;
}

export interface UnitGroupsAppType extends DataResponseType<UnitGroupDetailAppType> {}

export interface UnitGroupParamsType extends BaseParamsType {
  code: string;
  maxPersons?: number;
  propertyId: string;
  media: string[];
  type?: string;
  minimumPrice?: number;
  maximumDiscount?: number;
}
