import { ServiceGeneralInfo } from 'services/ServiceList/type';
import { BaseAmount } from './RatePlanRelationship';

export interface ServiceDate {
  amount: BaseAmount;
  count: number;
  isMandatory: boolean;
  serviceDate: string;
}

export interface ServiceResType {
  dates: ServiceDate[];
  service: ServiceGeneralInfo;
  totalAmount: BaseAmount;
  code?: string;
}
