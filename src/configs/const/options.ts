export const bookingChannelOptions = [
  // {
  //   label: 'Direct',
  //   value: 'Direct'
  // },
  // {
  //   label: 'Expedia',
  //   value: 'Expedia'
  // },
  // {
  //   label: 'Hrs',
  //   value: 'Hrs'
  // },
  // {
  //   label: 'BookingCom',
  //   value: 'BookingCom'
  // },
  {
    label: 'AltoVita',
    value: 'AltoVita'
  }
  // {
  //   label: 'Homelike',
  //   value: 'Homelike'
  // },
  // {
  //   label: 'Ibe',
  //   value: 'Ibe'
  // }
];

export const calculationModeOptions = [
  { lable: 'Truncate', value: 'Truncate' },
  { lable: 'Round', value: 'Round' }
];

export const guaranteeOptions = [
  { label: '6 pm hold', value: '6 pm hold' },
  { label: 'CreditCard', value: 'CreditCard' },
  { label: 'Prepayment', value: 'Prepayment' },
  { label: 'Company', value: 'Company' }
];

export const identificationOptions = [
  { label: 'Passport number', value: 'PassportNumber' },
  { label: 'Id number', value: 'IdNumber' },
  { label: 'Driver license number', value: 'DriverLicenseNumber' },
  { label: 'Social insurance number', value: 'SocialInsuranceNumber' }
];

export const bookerTitleOptions = [
  { label: 'Mr.', value: 'Mr' },
  { label: 'Ms.', value: 'Ms' },
  { label: 'Mrs.', value: 'Mrs' },
  { label: 'Prof.', value: 'Prof' },
  { label: 'Dr.', value: 'Dr' }
  // { label: 'Other', value: 'Other' }
];

export const genderOptions = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Other', value: 'Other' }
];

export const descriptionLangOptions = [
  { label: 'German', value: 'German' },
  { label: 'English', value: 'English' }
];

export const travelPurpose = [
  {
    label: 'Leisure',
    value: 'Leisure'
  },
  {
    label: 'Business',
    value: 'Business'
  }
];

export const serviceTypeOptions = [
  {
    text: 'Accommodation',
    value: 'Accommodation'
  },
  {
    text: 'Food And Beverages',
    value: 'FoodAndBeverages'
  },
  {
    text: 'Other',
    value: 'Other'
  }
];

export const childrenAges = () => {
  return Array(18)
    .fill(0)
    .map((i, idx) => {
      return {
        label: i + idx,
        value: i + idx
      };
    });
};

export const voucherStatusFilter = [
  { text: 'Valid', value: 'valid' },
  { text: 'Expired', value: 'expired' },
  { text: 'Pending', value: 'pending' },
  { text: 'Used', value: 'isUsed' },
  { text: 'Invalid', value: 'invalid' }
];
