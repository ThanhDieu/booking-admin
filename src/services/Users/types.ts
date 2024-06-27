import { AddressType, RoleType } from '@types';
import { PropertyDetailAppType } from 'services/Properties/type';

export interface PropertyType {
  id: string;
  code: string;
  name: string;
}

export interface PropertiesType {
  property: PropertyType;
  roles: RoleType[];
}

export interface UserPayload {
  password?: string;
  roles: string[];
  username: string;
  avarta?: string;
  language?: string;
  propertyId?: string
}

export interface UserType {
  // base type
  id: string;
  code: string;
  name: string;
  description: string;

  email: string;
  avatar: string;
  location: AddressType;
  username: string;
  password: string;
  is_admin?: boolean;
  property?: PropertyDetailAppType;
  token: string;
  refreshToken: string;
  disabled: boolean;
  default_language: string;
  additionally_supported_countries: string;

  enabled?: boolean;
  roles?: RoleType[];
  userId?: string;
  type?: string;
  language?: string;
}
