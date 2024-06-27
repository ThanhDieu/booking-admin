import { GetBundlePriceTypeV2 } from 'services/Bundle/type';
import { formatPriceByLocales } from './format';

export function filter<T>(array: T[], callbacks: ((item: T) => boolean | T)[]): T[] {
  let tmp: T[] = array;

  callbacks.map((callback) => {
    tmp = tmp.filter(callback);

    return callback;
  });

  return tmp;
}

export function partition<T>(array: T[], callback: (item: T) => boolean | T): [T[], T[]] {
  return array.reduce(
    (acc, e) => {
      acc[callback(e) ? 0 : 1].push(e as unknown as never);
      return acc;
    },
    [[], []]
  );
}

export const isRequired = (name: string, required?: string[]) => {
  return required ? required.findIndex((title) => title === name) > -1 : false;
};

export const isShowFields = (
  showedFields: string[],
  fieldName: string,
  formItem: React.ReactNode
) => {
  return showedFields.findIndex((field) => field === fieldName) !== -1 ? formItem : undefined;
};

export const totalPriceBundle = (bundle: GetBundlePriceTypeV2 | undefined, getNumber?: boolean) => {
  let totalUnit = 0,
    totalExtraService = 0;

  if (bundle?.timeSliceDefinitions?.length) {
    const timeSliceDefinitions = bundle.timeSliceDefinitions;
    for (let i = 0; i <= timeSliceDefinitions.length - 1; i++) {
      totalUnit += bundle?.timeSliceDefinitions[i].overwritePrice;
      if (timeSliceDefinitions[i]?.includedServices?.length) {
        const includedServices = timeSliceDefinitions[i]?.includedServices;
        if (includedServices)
          for (let i = 0; i <= includedServices.length - 1; i++) {
            totalExtraService += includedServices[i].overwritePrice;
          }
      }
    }
  }

  return {
    totalUnit: getNumber ? totalUnit : `${formatPriceByLocales(totalUnit, bundle?.currency)}`,
    totalService: getNumber
      ? totalExtraService
      : `${formatPriceByLocales(totalExtraService, bundle?.currency)}`
  };
};

export const removeDuplicateObjects = <T>(arr: T[], byField: keyof T) => {
  const uniqueObjects = [];
  const ids = new Set();

  for (const obj of arr) {
    if (!ids.has(obj[byField])) {
      uniqueObjects.push(obj);
      ids.add(obj[byField]);
    }
  }

  return uniqueObjects;
};

export const mergeDuplicateObjAndCount = <T>(arr: T[], fieldCheckArr: (keyof T)[]) => {
  const seen = new Map();
  const t: {
    [key: string]: any;
  } = {};

  arr.forEach((item) => {
    const keyObj = fieldCheckArr.map((field) => (t.field = item[field]));
    const key = JSON.stringify(keyObj);

    if (seen.has(key)) {
      seen.get(key).count += 1;
    } else {
      seen.set(key, { ...item });
    }
  });

  return Array.from(seen.values());
};
