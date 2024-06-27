/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserInfoByToken } from 'services/Users';

import { UserType } from 'services/Users/types';
import { loadAccessToken } from 'utils/storage';

export const initialUserSessionAction = createAsyncThunk<any, UserType>(
  'auth/initialUserSession',
  async () => {
    const accessToken = loadAccessToken();

    if (!accessToken) throw new Error('User session not found');

    const res = await getUserInfoByToken();
    if (res?.data?.data && res?.data?.data.length > 0) {
      return res?.data?.data;
    }
    return Promise.reject(new Error('User session not found'));
  }
);
