import { ConditionEnum } from 'services/Units/type';

export interface UnitStatusType {
  isOccupied: boolean;
  condition: ConditionEnum.Clean | ConditionEnum.Dirty;
  maintenance: string; // OutOfService, OutOfOrder
}

export interface UnitUtilityType {
  id: string;
  name: string;
  descriptions: string;
}

export interface UnitBenefitsType {
  id: string;
  name: string;
  descriptions: string;
}
