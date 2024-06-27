import { ImageAcceptType } from 'components/common/modal/ModalGalleryComponent';

export interface MediaAttributeFormatType {
  ext: ImageAcceptType;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
}

export interface MediaFormatType {
  large?: MediaAttributeFormatType;
  small?: MediaAttributeFormatType;
  medium?: MediaAttributeFormatType;
  thumbnail?: MediaAttributeFormatType;
}

export interface MediaStrapiType {
  id: string | number;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: MediaFormatType | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseStrapiType {
  data: {
    id: number;
    attributes: any;
  }[];
  meta: {
    pagination: {
      page: number;
      pageCount: number;
      pageSize: number;
      total: number;
    };
  };
}

export interface HQrevenueInfoType {
  name: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  entries: {
    id: number;
    name: string;
    value: string;
  }[];
}
