import { SelectProps } from 'antd';
import { DEFAULT_LANGUAGE } from 'configs/const/format';
import { LanguageSettingType } from 'services/SettingLanguage/type';
import { currencies } from './currency';
import { addSpaceInString, capitalize } from './text';
import { ExtendedDataType } from '@types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const formatValueOption = <T>(
  option: T,
  label: keyof T,
  value?: keyof T,
  iconCustom = '@'
) => {
  return value
    ? iconCustom
      ? `${option[value]}${iconCustom}${option[label]}`
      : option[value]
    : option[label];
};

// const countryOptions = useMemo(() => {
//   const countries = listProperty.map((property) => property?.country);
//   const uniqueArray = countries.filter((item, index) => {
//     return countries.indexOf(item) === index;
//   });
//   return uniqueArray.map((country) => ({
//     text: country,
//     value: country
//   }));
// }, [listProperty]);

export const formatFilterOptions = <T>(dataArray: T[], filterdField: keyof T) => {
  const options = dataArray.map((item: T) => item[filterdField]);
  const uniqueArray = options?.filter((item, idx) => {
    return options.indexOf(item) === idx;
  });
  return uniqueArray.map((option) => ({
    text: addSpaceInString(option as string),
    value: option
  }));
};

export const formatSelectOption = <T>(
  array: T[],
  label: keyof T,
  value?: keyof T,
  iconCustom = '@',
  disable?: keyof T,
  other?: ExtendedDataType
) => {
  return array.map((option: T) => ({
    ...option,
    label: other?.isFormatLabel ? capitalize((option[label] as any)?.replaceAll('_', ' ')) : `${option[label]}`,
    value: formatValueOption(option, label, value, iconCustom),
    disabled: disable ? !option[disable] : false
  })) as SelectProps['options'];
};

export const formatDefaultSelected = <T>(
  option: T | T[],
  label: keyof T,
  value?: keyof T,
  iconCustom = '@'
) => {
  if (Array.isArray(option)) {
    return option.map((item) => formatValueOption(item, label, value, iconCustom));
  }
  return formatValueOption(option, label, value, iconCustom);
};

export const revertValueOption = (value: string, iconCustom = '@') => {
  return {
    label: value?.length > 1 ? value?.split(iconCustom)[1] : '',
    value: value?.split(iconCustom)[0]
  };
};

export const formatObjectList = (objects: { [key: string]: string }, iconCustom?: string) => {
  const newObjects = Object.keys(objects).map((objectKey) => ({
    value: iconCustom
      ? `${objectKey}${iconCustom}${objects[objectKey as keyof typeof objects]}`
      : `${objectKey}`,
    label: `${objects[objectKey as keyof typeof objects]}`
  }));
  return newObjects;
};

export const formatPriceByLocales = (
  price = 0,
  currency = 'EUR',
  options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }
) => {
  const found = currencies.find((value) => value.iso === currency);
  return Number(price || 0).toLocaleString(found?.locale || 'de-DE', options);
};

export const formatPayloadWithLocale = (
  langObj: LanguageSettingType[],
  formData: any,
  label: string
) => {
  return langObj
    ?.map((lang) => ({ [lang.code]: formData[`${label}_${lang.code}`] }))
    .reduce((result, item) => {
      const languageKey = Object.keys(item)[0]; // Get the language code
      result[languageKey] = item[languageKey]; // Add to the result object
      return result;
    });
};

export const formatStringByLocale = (defaultValue?: string, label?: ExtendedDataType, locale?: string) => {
  return label?.[(locale || DEFAULT_LANGUAGE) as keyof typeof label] as string || defaultValue || ''
}