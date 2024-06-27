/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import store from 'store';
import { loadAccessToken, loadRefreshToken, loadViewMode, saveAccessToken } from 'utils/storage';

import errors from 'configs/const/errors';
import { authSlice } from 'store/orion/Auth';
import { alert } from 'store/app/alert';
import { apiRefreshToken } from './Auth';
import { paths } from 'constant';
import { AuthStatus, ViewMode } from 'configs/const/auth';
import { displayRole } from 'utils/view';

type AxiosRequestConfigCustom = AxiosRequestConfig & {
  shouldNOTUseLocale?: boolean;
  requestStartTime?: number;
  requireAuthentication?: boolean;
  isPostFile?: boolean;
  isDifferenceDomain?: string;
  newUrl?: string;
};
declare module 'axios' {
  export interface AxiosInstance {
    request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfigCustom): Promise<R>;
    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfigCustom): Promise<R>;
    delete<T = any, R = AxiosResponse<T>>(
      url: string,
      config?: AxiosRequestConfigCustom
    ): Promise<R>;
    head<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfigCustom): Promise<R>;
    options<T = any, R = AxiosResponse<T>>(
      url: string,
      config?: AxiosRequestConfigCustom
    ): Promise<R>;
    post<T = any, R = AxiosResponse<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfigCustom
    ): Promise<R>;
    put<T = any, R = AxiosResponse<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfigCustom
    ): Promise<R>;
    patch<T = any, R = AxiosResponse<T>>(
      url: string,
      data?: any,
      config?: AxiosRequestConfigCustom
    ): Promise<R>;
  }
}

const getBaseURL = (config?: any) => {
  if (config.newUrl) return Promise.resolve(config.newUrl);
  return Promise.resolve(
    `${import.meta.env.REACT_APP_API_BASE_URL}${import.meta.env.REACT_APP_API_BASE_PREFIX}`
  );
};

const http = axios.create({
  headers: {
    // 'Content-Type': 'application/json',
    // Accept: 'application/json',
    credentials: 'include',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'X-Auth-Token': `${import.meta.env.REACT_APP_API_BASE_X_TOKEN}`
  }
});
axios.defaults.withCredentials = true;

//
let isRefreshing = false;
let subscribers: any[] = [];

const urlsGlobal = [
  '/inventory/properties?'
]

const subscribeTokenRefresh = (cb: (token: any) => void) => {
  subscribers.push(cb);
};
const onRefreshed = (authorisationToken: any) => {
  subscribers.map((cb) => cb(authorisationToken));
};

const onResult = (myErrors: string, res: any) => {
  if (myErrors)
    store.dispatch(
      alert({
        status: 'error',
        message: myErrors
      })
    );
  return res
}

// refresh token
const renewToken = (error: any, originalRequest: any) => {
  const myErrors = error.response?.data.errors;
  if (!isRefreshing) {
    isRefreshing = true;
    const requestNewToken = loadRefreshToken() || '';
    if (
      // JSON.parse(atob(requestNewToken.split('.')[1])).exp * 1000 < Date.now() ||
      myErrors.length > 0 &&
      (myErrors[0].toLowerCase() === errors.INVALID_TOKEN ||
        myErrors[0].toLowerCase() === errors.AUTH_MISS ||
        (originalRequest?.url &&
          originalRequest?.url.toLowerCase() === paths.RENEW &&
          myErrors[0].toLowerCase() === errors.TOKEN_EXP))
    ) {
      store.dispatch(authSlice.actions.logout());
      isRefreshing = false;
    } else {
      const payload = {
        refreshToken: requestNewToken
      };

      apiRefreshToken(payload)
        .then((res) => {
          isRefreshing = false;
          saveAccessToken(res.data[0].token);
          onRefreshed(res.data[0].token);
          subscribers = [];
        })
        .catch(() => {
          store.dispatch(authSlice.actions.logout());
          isRefreshing = false;
        });
    }
  }

  return new Promise((resolve) => {
    subscribeTokenRefresh((token) => {
      if (originalRequest.headers) {
        Object.assign(originalRequest.headers, {
          Authorization: `Bearer ${token}`
        });
      }
      resolve(http(originalRequest));
    });
  });
};


// rejects
const isError = (error: any, originalRequest: any) => {
  const myErrors = error?.response?.data?.errors;
  if (
    (myErrors?.length > 0 &&
      (myErrors[0].toLowerCase() === errors.SS_NOTFOUND ||
        myErrors[0].toLowerCase() === errors.INVALID_SSID ||
        myErrors[0].toLowerCase() === errors.HTTP_NAMED ||
        myErrors[0].toLowerCase() === errors.INVALID_TOKEN ||
        myErrors[0].toLowerCase() === errors.AUTH_MISS)) ||
    (originalRequest?.url &&
      originalRequest?.url.toLowerCase() === paths.RENEW &&
      myErrors[0].toLowerCase() === errors.TOKEN_EXP)
  ) {
    store.dispatch(authSlice.actions.logout());
  }

  return onResult(myErrors?.[0] || '', Promise.reject(error))
};

http.interceptors.request.use(async (config: AxiosRequestConfigCustom | any) => {
  config.baseURL = await getBaseURL(config);

  config.requestStartTime = Date.now();

  if (config.requireAuthentication) {
    const accessToken = loadAccessToken();
    const view = loadViewMode()
    if (config.isDifferenceDomain) {
      config.baseURL = config.isDifferenceDomain;
    }

    if (view && view !== ViewMode.Account && !urlsGlobal.some(item => config?.url && config?.url?.includes(item))) {
      const hotel = displayRole(view)
      if (hotel?.code) {
        config.baseURL = `${config.baseURL}/${hotel.code}`
      }
    }
    if (accessToken) {
      Object.assign(config.headers || '', {
        Authorization: `Bearer ${accessToken}`
      });
    }
  }
  return config;
});

http.interceptors.response.use(
  (response: any) => {
    if (response?.data?.success === false) {
      const error: any = new Error(response?.data?.errors[0]);
      error.response = response;
      error.config = response?.config;
      const { config } = error;
      const originalRequest = config;

      if (response?.data?.code === 401 && store.getState().orion.auth.status === AuthStatus.Auth) {
        if (
          response?.data.errors.length > 0 &&
          (response?.data.errors[0].toLowerCase() === errors.ACTION_ACL ||
            response?.data.errors[0].toLowerCase() === errors.NO_PERMISSION ||
            response?.data.errors[0].toLowerCase() === errors.INVALID_CREDEN)
        ) {


          return onResult(response?.data.errors[0], response)
        }
        return renewToken(error, originalRequest);
      }
      return isError(error, originalRequest);
    }
    return response;
  },
  async (error: AxiosError<any>) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response?.data?.code === 401 && store.getState().orion.auth.status === AuthStatus.Auth) {
      if (
        response?.data.errors.length > 0 &&
        (response?.data.errors[0].toLowerCase() === errors.ACTION_ACL ||
          response?.data.errors[0].toLowerCase() === errors.NO_PERMISSION ||
          response?.data.errors[0].toLowerCase() === errors.INVALID_CREDEN)
      ) {

        return onResult(response?.data.errors[0], response)
      }
      return renewToken(error, originalRequest);
    }

    return isError(error, originalRequest);
  }
);

export default http;
