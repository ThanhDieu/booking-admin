import { BaseType } from '@types';

export interface AvailabilityStat {
  physicalCount: number;
  houseCount: number;
  soldCount: number;
  occupancy: number;
  sellableCount: number;
  allowedOverbookingCount: number;
  maintenance: {
    outOfService: number;
    outOfOrder: number;
    outOfInventory: number;
  };
  block: {
    definite: number;
    tentative: number;
    picked: number;
    remaining: number;
  };
}

export interface UnitGroupAvailability extends AvailabilityStat {
  unitGroup: BaseType;
}

export interface AllUnitGroupsAvailabilityType {
  from: string;
  to: string;
  property: AvailabilityStat;
  unitGroups: UnitGroupAvailability[];
}
