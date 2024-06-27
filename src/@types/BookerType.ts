import { AddressType, CompanyDetailsType } from './AddressType';

export interface GuestInfo {
  title?: string;
  firstName?: string;
  middleInitial?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  preferredLanguage?: string;
  company?: CompanyDetailsType;
  guestComment?: string;
  bookerComment?: string;
  //address
  address?: AddressType;
  //Indentification
  travelPurpose?: string;
  nationalityCountryCode?: string;
  birthPlace?: string;
  identificationType?: string;
  identificationNumber?: string;
  identificationIssueDate?: string;
}
