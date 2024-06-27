import axios from 'axios';
import { OwnHotelInfoType, RateHQrevenueType } from './type';

export const getOwnHotelInfo = (token: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<OwnHotelInfoType>>>(
    `${import.meta.env.REACT_APP_BASE_URL_HQREVENUE}${
      import.meta.env.REACT_APP_BASE_PREFIX_HQREVENUE
    }/me`,
    {
      headers: {
        'X-Auth-Token': token,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      timeout: 30000,
      signal
    }
  );

export const getRatesAdvisor = (query: string, token: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<RateHQrevenueType>>>(
    `${import.meta.env.REACT_APP_BASE_URL_HQREVENUE}${
      import.meta.env.REACT_APP_BASE_PREFIX_HQREVENUE
    }/rates?${query}`,
    {
      headers: {
        'X-Auth-Token': token,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      timeout: 30000,
      signal
    }
  );
