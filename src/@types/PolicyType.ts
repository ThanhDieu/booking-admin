import { DefaultGrossPrice } from './RatePlanRelationship';

export interface PolicyFee {
  vatType: string;
  fixedValue?: DefaultGrossPrice;
  percentValue?: {
    percent: number;
    limit?: number;
    includeServiceIds?: string[];
  };
  description?: string;
  name?: string;
}
