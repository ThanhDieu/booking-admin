import { BaseDataAppType, BaseType, Period, PolicyFee } from '@types';
import { PropertyDetailAppType } from 'services/Properties/type';

interface PolicyType extends BaseType {
  fee: PolicyFee;
  propertyId: string;
  periodFromReference?: Period;
  reference?: string;
}

interface PolicyAppType extends BaseDataAppType<PolicyType> {
  property: PropertyDetailAppType;
  isGlobal?: boolean;
  title: string;
  reference: string;
}

export interface CancellationPolicyAppType extends PolicyAppType {}

export interface NoShowPolicyAppType extends PolicyAppType {}
