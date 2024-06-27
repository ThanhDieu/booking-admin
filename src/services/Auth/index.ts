import http from 'services/http';

import { UserType } from '../Users/types';
import { LoginPayload, RenewPayload, ResponseNewToken } from './types';
import { paths } from 'constant';

export const loginService = (payload: LoginPayload) =>
  http.post<BaseAPIResponse<Array<UserType>>>(`/auth/login`, {
    ...payload
  });

// export const logoutService = () => http.post<BaseAPIResponse>(`/auth/logout`);

export const apiRefreshToken = async (payload: RenewPayload) => {
  const res = await http.post<BaseAPIResponse<Array<ResponseNewToken>>>(
    paths.RENEW,
    {
      ...payload
    },
    {
      requireAuthentication: true
    }
  );
  return res?.data;
};
