/* eslint-disable @typescript-eslint/no-explicit-any */
import { RatePlanDetailAppType } from 'services/RatePlan/type';

const mergeNestedObj = (data: RatePlanDetailAppType[]) => {
  const mapping: any = {};
  const result: any = [];
  data
    .map((obj: RatePlanDetailAppType) => {
      if (obj?.data?.id) mapping[obj?.data?.id] = { ...obj, key: obj?.data?.id };
      return obj;
    })
    .map((obj: RatePlanDetailAppType) => {
      if (obj?.data?.isDerived && obj?.data?.id && obj?.data?.pricingRule.baseRatePlan.id) {
        const parent = mapping[obj?.data?.pricingRule.baseRatePlan.id];

        if (parent?.children) {
          parent?.children.push(mapping[obj?.data.id]);
        }
        if (parent && !parent?.children) {
          parent['children'] = [mapping[obj?.data.id]];
        }
      } else {
        if (obj?.data?.id) result.push(mapping[obj?.data?.id]);
      }
      return obj;
    });
  return result;
};

export default mergeNestedObj;
