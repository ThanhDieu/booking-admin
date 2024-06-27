/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BaseType {
  name?: string;
  description?: string;
  id?: string;
  code?: string;
  type?: string;
  title?: string;
  extendedData?: {
    [key: string]: ExtendedDataType;
  }
}

export interface BaseDataAppType<T = unknown> {
  extId?: string;
  name?: string;
  createdAt?: number;
  updatedAt?: number;
  comment?: string;
  disabled?: boolean;
  version?: string;
  description?: string;
  data?: T;
  extendedData?: {
    [key: string]: ExtendedDataType
  };
}

export interface BaseParamsType {
  description?: string;
  disabled?: boolean;
  priority?: number;
  tagIds?: string[];
  title?: string;
  comment?: string;
}

export interface ExtendedDataType {
  [key: string]: any;

}