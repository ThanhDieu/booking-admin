/* eslint-disable @typescript-eslint/no-explicit-any */
export enum FuncType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  DUPLICATE = 'duplicate',
  REMOVE = 'remove',
  BUILD = 'build',
  INVALID = 'invalid',
  SEND_MAIL = 'send_mail',
  ARCHIVE = 'archive',
  RESTORE = 'restore'
}

export const vatType = {
  NORMAL: '7% - Normal',
  REDUCED: '5% - Reduced',
  NULL: '0% - Null',
  WITHOUT: 'Without'
};

export const tagType = {
  SERVICE: 'services',
  UNITGROUP: 'unit-groups',
  PROPERTY: 'properties',
  BUNDLE: 'bundles',
  UNIT: 'units'
  // POLICY: 'policies'
};

export const GeneralName = {
  Property: 'Property',
  ManyProperty: 'Properties',
  Tag: 'tag',
  Attribute: 'attribute'
};

export const countryCodes = ['AT', 'BE', 'CH', 'DE', 'DK', 'ES', 'FI', 'FR', 'GB', 'NL'];

export const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const editModalType = {
  RESTRICTION: 'restriction',
  CANCELLATION: 'cancellation',
  GUARANTEE: 'guarantee',
  CHANNEL: 'channel',
  PERIODS: 'periods',
  ACCOUNTING: 'accounting',
  COMMENT: 'comment'
};

export const policyType = {
  CANCELLATION: 'cancellation',
  NO_SHOW: 'no-show'
};

export const sorterType = {
  DES: 'descend',
  ASC: 'ascend'
};

export const statusPropertyType = {
  TEST: 'Test',
  LIVE: 'Live'
};

export const statusReservationType: { [key: string]: string } = [
  'Confirmed',
  'InHouse',
  'Canceled',
  'CheckedOut',
  'NoShow'
].reduce((obj: any, item) => {
  obj[item] = item;
  return obj;
}, {});

export const actionReservationType: { [key: string]: string } = [
  'CheckIn',
  'CheckOut',
  'AssignUnit',
  'Cancel',
  'UnassignUnit'
  // 'AddCityTax',
  // 'RemoveCityTax'
].reduce((obj: any, item) => {
  obj[item] = item;
  return obj;
}, {});

export const A_THOUSAND = 1000;

export const modeList = {
  DAILY: 'Entire stay',
  ARRIVAL: 'Only on arrival',
  DEPARTURE: 'Only on departure'
};
export const whenList = ['EntireStay', 'Once', 'SpecificDates'];

export enum filterBundle {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending',
  EXPIRED = 'expired',
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  INVALID = 'invalid'
}

export const statusVoucher = {
  VALID: 'valid',
  EXPIRED: 'expired',
  PENDING: 'pending',
  INVALID: 'invalid'
};

export enum ThemeType {
  DEFAULT = 'default',
  DARK = 'dark'
}

export enum BuildStatus {
  BUILDING = 'building',
  SUCCESS = 'success',
  FAIL = 'fail'
}

export enum DisplayIBEOptions {
  HOME = 'Home page',
  HOTEL = 'Hotel page',
  TOPIC = 'Topic page'
}

export const StatusOffer = {
  created: 'created',
  submitted: 'submitted',
  pending: 'pending',
  booked: 'booked',
  expired: 'expired'
};
export const ServiceMode: { [key: string]: string } = [
  'Departure', 'Daily', 'Arrival'
].reduce((obj: any, item) => {
  obj[item] = item;
  return obj;
}, {});