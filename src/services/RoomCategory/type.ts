import { BaseType } from '@types';

export interface RoomCategoryType extends BaseType {
  specialBundleId: string;
  icons: {
    dark: string;
    light: string;
  };
  extendedData?: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

export interface RoomCategoryPayload {
  title: string;
  icons: {
    dark: string;
    light: string;
  };
  extendedData?: {
    [key: string]: {
      [key: string]: string;
    };
  };
}
