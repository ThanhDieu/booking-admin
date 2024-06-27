/* eslint-disable @typescript-eslint/no-explicit-any */
import { ServiceDetailAppType } from 'services/ServiceList/type';

export const calculateTotal = <T>(arr: T[], calField: (keyof T)[]) => {
  const totalArr = calField.map((field) => {
    const value = arr.reduce((prev, curr) => {
      return (
        prev +
        ((typeof curr[field] === 'number' ? curr[field] : (curr[field] as any)?.length) ?? 0) *
          ((curr as any)?.count ?? 1)
      );
    }, 0);
    return { [field]: value };
  });

  //format arr into obj
  const mergedObject = totalArr.reduce((result, currentObject) => {
    return { ...result, ...currentObject };
  });

  return mergedObject;
};

export const calculateServicePrice = (
  serviceArr: ServiceDetailAppType[],
  numberOfNight: number
) => {
  const reusult = serviceArr.reduce((prevValue, currentValue) => {
    const isOneDay = currentValue?.mode
      ? currentValue?.mode === 'Arrival' || currentValue?.mode === 'Departure'
      : true;

    return (
      prevValue +
      currentValue?.price *
        (isOneDay ? 1 : numberOfNight) *
        (currentValue?.count ? currentValue?.count : 1)
    );
  }, 0);
  return reusult;
};
