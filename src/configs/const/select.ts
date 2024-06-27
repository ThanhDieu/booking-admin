import { addSpaceInString } from 'utils/text';
import { daysOfWeek, modeList, vatType, whenList } from './general';

export const modeOption = Object.keys(modeList).map((key) => ({
  label: modeList[key as keyof typeof modeList],
  value: key.toLowerCase()
}));

export const bundleDayOption = Object.values(daysOfWeek).map((item) => ({
  label: item,
  value: item
}));

export const serviceUnitOptions = [
  {
    label: 'Per guest',
    value: 'Per guest'
  },
  {
    label: 'Per unit',
    value: 'Per unit'
  }
];

export const whenOptions = Object.values(whenList).map((item) => ({
  label: addSpaceInString(item),
  value: item
}));
export const periodReferenceOption = [
  {
    label: 'Prior to arrival',
    value: '"PriorToArrival"'
  },
  {
    label: 'After booking',
    value: 'AfterBooking'
  }
];

export const vatOptions = Object.keys(vatType).map((key) => ({
  label: vatType[key as keyof typeof vatType],
  value: key.toLowerCase()
}));

export const filterTypeOptions = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: '.jpeg',
    value: '.jpeg'
  },
  {
    label: '.svg',
    value: '.svg'
  },
  {
    label: '.jpg',
    value: '.jpg'
  },
  {
    label: '.png',
    value: '.png'
  },
  {
    label: '.webp',
    value: '.webp'
  }
];

export const currencyOptions = [
  {
    label: 'EUR',
    value: 'EUR'
  },
  {
    label: 'USD',
    value: 'USD'
  }
];
