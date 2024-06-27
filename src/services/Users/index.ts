/* eslint-disable camelcase */
import http from 'services/http';
import axios from 'axios';

import { UserPayload, UserType } from './types';
import { RoleType } from '@types';

// Get all users
export const getAllUsersService = (queryText: string, signal?: AbortSignal) => {
  return http.get<BaseAPIResponse<Array<UserType>>>(
    `/auth/users?userType=admin${queryText ? `&${queryText}` : ''}`,
    { requireAuthentication: true, signal }
  );
};

//Get user profile
export const getUserInfoByToken = () => {
  return http.get<BaseAPIResponse<Array<UserType>>>(`/auth/users/profile?expands=roles`, {
    requireAuthentication: true
  });
};

//Get all roles
export const getAllRoleService = (signal?: AbortSignal) =>
  http.get<BaseAPIResponse<Array<RoleType>>>(`roles`, {
    requireAuthentication: true,
    signal
  });

//Create user
export const createUserService = (payload: UserPayload) => {
  return http.post<BaseAPIResponse<UserType>>(
    `/auth`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );
};

//Update user
export const updateUserService = (id: string, payload: UserPayload) =>
  http.put<BaseAPIResponse<UserType>>(
    `auth/users/profile/${id}`,
    { ...payload },
    {
      requireAuthentication: true
    }
  );

/////////////////////////////////
// Get user by id
export const getUserByIdService = (id: string) => {
  return axios.get<BaseAPIResponse<Array<UserType>>>(`/user/${id}`);
};
// Get users by mode
export const getUsersByPropertyService = (property: string) => {
  return axios.get<BaseAPIResponse<Array<UserType>>>(`/users/property/${property}`);
};

// Get all location
export const getAllLocationService = () => {
  return axios.get<BaseAPIResponse<Array<UserType>>>(`/locations`);
};

// Get all property
export const getAllPropertyService = () => {
  return axios.get<BaseAPIResponse<Array<UserType>>>(`/propertyList`);
};
