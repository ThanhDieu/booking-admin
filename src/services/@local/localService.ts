/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const BASE_URL_LOCAL = `https://test:test@api.a3bd78f6.booking.wixcloud.de/testing/v1/test1`;

export const testService = () =>
  axios.get<BaseAPIResponse<Array<any>>>(`${BASE_URL_LOCAL}`, {
    headers: {
      // Authorization: `Bearer ${import.meta.env.REACT_APP_TOKEN_STRAPI}`
    },
    auth: {
      username: 'test',
      password: 'test'
    }
    // withCredentials: true
  });
