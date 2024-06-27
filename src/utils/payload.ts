/* eslint-disable @typescript-eslint/no-explicit-any */
import { GuestInfo } from '@types';
import { DATE_FORMAT_1 } from 'configs/const/format';
import { countries, languages } from 'constant';
import dayjs from 'dayjs';

export const formatInitialValueGuest = (formData: GuestInfo) => {
  return {
    ...formData,
    ...formData?.address,
    birthDate: formData?.birthDate ? dayjs(formData?.birthDate, DATE_FORMAT_1) : undefined,
    identificationIssueDate: formData?.identificationIssueDate
      ? dayjs(formData?.identificationIssueDate, DATE_FORMAT_1)
      : undefined,
    countryCode: formData?.address?.countryCode
      ? `${formData?.address?.countryCode}@${
          countries[formData?.address?.countryCode as keyof typeof countries]
        }`
      : '',
    preferredLanguage: formData?.preferredLanguage
      ? `${formData?.preferredLanguage}@${
          languages[formData?.preferredLanguage as keyof typeof languages]
        }`
      : '',
    nationalityCountryCode: formData?.nationalityCountryCode
      ? `${formData?.nationalityCountryCode}@${
          countries[formData?.nationalityCountryCode as keyof typeof countries]
        }`
      : '',
    companyName: formData?.company?.name,
    taxId: formData?.company?.taxId
  };
};

export const formatPayloadUpdateGuest = (
  formData: any,
  type: 'booker' | 'primaryGuest' | 'none' = 'none'
) => {
  const payload: any = {
    title: formData?.title,
    firstName: formData?.firstName,
    middleInitial: formData?.middleInitial,
    lastName: formData?.lastName,
    email: formData?.email,
    phone: formData?.phone,
    gender: formData?.gender,
    birthDate: formData?.birthDate ? dayjs(formData?.birthDate).format(DATE_FORMAT_1) : undefined,
    identificationIssueDate: formData?.identificationIssueDate
      ? dayjs(formData?.identificationIssueDate).format(DATE_FORMAT_1)
      : undefined,
    nationalityCountryCode: formData?.nationalityCountryCode
      ? formData?.nationalityCountryCode?.split('@')[0]
      : '',
    preferredLanguage: formData?.preferredLanguage
      ? formData?.preferredLanguage?.split('@')[0]
      : '',
    address: {
      addressLine1: formData?.addressLine1,
      addressLine2: formData?.addressLine2,
      postalCode: formData?.postalCode,
      city: formData?.city,
      countryCode: formData?.countryCode ? formData?.countryCode?.split('@')[0] : ''
    },
    company: {
      name: formData?.companyName,
      taxId: formData?.taxId
    }
  };
  if (type === 'none') return { ...payload };
  if (type === 'primaryGuest') payload.guestComment = formData?.guestComment;
  return {
    [type]: {
      ...payload
    }
  };
};
