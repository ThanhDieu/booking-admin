import { BaseDataAppType, BaseParamsType, BaseType, UnitStatusType } from '@types';
import { PropertyDetailAppType } from 'services/Properties/type';
import { TagDetailAppType } from 'services/Tags/type';
import { UnitGroupDetailAppType } from 'services/UnitGroups/type';

/// api
export enum ConditionEnum {
  Clean = 'Clean',
  Dirty = 'Dirty'
}

export interface UnitType extends BaseType {
  created: string;
  maxPersons: number;
  property: {
    id: string;
  };
  status: UnitStatusType;
  unitGroup: {
    id: string;
  };
  tags?: {
    id: string;
    name: string;
  }[];
}
export interface UnitDetailAppType extends BaseDataAppType<UnitType> {
  priority: number;
  size: number;
  property: PropertyDetailAppType;
  unitGroup?: UnitGroupDetailAppType;
  tags?: TagDetailAppType[];
  title?: string;
  maxPersons?: number;
}

export interface UnitsAppType extends DataResponseType<UnitDetailAppType> {}

export interface UnitResAppType extends BaseType {
  unitGroupId?: string;
  extId?: string;
  status?: {
    condition: string;
    isOccupied: boolean;
  };
}

export interface UnitParamsType extends BaseParamsType {
  unitGroupId?: string;
  size?: number;
  propertyId?: string;
  code?: string;
  maxPersons?: number;
  tagIds: string[];
}
