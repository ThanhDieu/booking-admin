/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CurrencyInfoType {
  name: string;
  symbol: string;
  iso: string;
  locale: string;
}
export const currencies: CurrencyInfoType[] = [
  {
    name: 'United States Dollar',
    symbol: '$',
    iso: 'USD',
    locale: 'en-US'
  },
  {
    name: 'European Euro',
    symbol: '€',
    iso: 'EUR',
    locale: 'de-DE'
  },
  {
    name: 'British Pound',
    symbol: '£',
    iso: 'GBP',
    locale: 'en-GB'
  }
];

let localeSelected = 'de-DE';

export const currencyFormatter = (value: any, currency = 'EUR') => {
  const currencyInfo = currencies.find((item) => item.iso === currency);
  if (currencyInfo) localeSelected = currencyInfo.locale;

  const res = new Intl.NumberFormat(currencyInfo ? currencyInfo.locale : localeSelected, {
    style: 'currency',
    currency: currency
  })
    .format(value)
    .replace(/[\p{Sc}\p{So}]\s*|\b\p{C}\p{Z}*\b/gu, '')
    .trim();

  return res;
};

export const currencyParser = (val: any) => {
  try {
    // for when the input gets clears
    if (typeof val === 'string' && !val.length) {
      val = undefined;
    }

    // detecting and parsing between comma and dot
    const group = new Intl.NumberFormat(localeSelected).format(1111).replace(/1/g, '');
    const decimal = new Intl.NumberFormat(localeSelected).format(1.1).replace(/1/g, '');

    if (val) {
      let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '');
      reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.');
      //  => 1232.21 €

      // removing everything except the digits and dot
      reversedVal = reversedVal.replace(/[^0-9.\s]/g, '');
      //  => 1232.21

      // appending digits properly
      const digitsAfterDecimalCount = (reversedVal.split('.')[1] || []).length;
      const needsDigitsAppended = digitsAfterDecimalCount > 2;

      if (needsDigitsAppended) {
        reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
      }

      return Number.isNaN(reversedVal) ? 0 : reversedVal;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getCurrencySymbol = (currencyISO: string) => {
  const found = currencies.find((value) => value.iso === currencyISO);
  if (found) return found;
  else
    return {
      name: 'European Euro',
      symbol: '€',
      iso: 'EUR',
      locale: 'de-DE'
    };
};
