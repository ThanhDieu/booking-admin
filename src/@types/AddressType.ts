export interface AddressType {
  addressLine1: string;
  addressLine2?: string;
  postalCode?: string;
  city?: string;
  countryCode?: string;
  currencyCode?: string;
}

export interface CompanyDetailsType {
  name?: string;
  taxId?: string;
  managingDirectors?: string;
  commercialRegisterEntry?: string;
}

export interface IdentificationType {
  nationality?: string;
  birthPlace?: string;
  identificationType?: string;
  identificationNumber?: string;
  issuedOn?: string;
}
