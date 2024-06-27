/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { MediaStrapiType } from './type';

export const getMediaListService = (signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<MediaStrapiType>>>(
    `${import.meta.env.REACT_APP_BASE_URL_STRAPI}/api/upload/files`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.REACT_APP_TOKEN_STRAPI}`
      },
      signal
    }
  );

export const uploadMediaService = (file: any, fileInfo: any) => {
  const formData = new FormData();
  const fileData = {
    alternativeText: fileInfo.alt,
    caption: fileInfo.caption
  };
  formData.append('files', file, fileInfo.name);
  formData.append('fileInfo', JSON.stringify(fileData));

  return axios.post<BaseAPIResponse<Array<MediaStrapiType>>>(
    `${import.meta.env.REACT_APP_BASE_URL_STRAPI}/api/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.REACT_APP_TOKEN_STRAPI}`,
        'Content-Type': 'multipart/form-data',
        Accept: 'image/*'
      }
    }
  );
};

export const deleteMediaService = (id: string) =>
  axios.delete<BaseAPIResponse<Array<MediaStrapiType>>>(
    `${import.meta.env.REACT_APP_BASE_URL_STRAPI}/api/upload/files/${id}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.REACT_APP_TOKEN_STRAPI}`
      }
    }
  );

export const getApiTokenHQrevenue = (signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<MediaStrapiType>>>(
    `${
      import.meta.env.REACT_APP_BASE_URL_STRAPI
    }/api/settings?filters[name][$eq]=hqrevenue&populate=deep`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.REACT_APP_TOKEN_STRAPI}`
      },
      signal
    }
  );
