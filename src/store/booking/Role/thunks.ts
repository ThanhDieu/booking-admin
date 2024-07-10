/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllRoleService } from 'services/Users';

export const getRoleList = createAsyncThunk<
  any,
  {
    signal?: AbortSignal;
  }
>('roles', async (form) => {
  try {
    const res = await getAllRoleService(form?.signal);
    if (res?.data?.data && res?.data?.data.length > 0) {
      return res?.data?.data;
    }
    return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Services not found'));
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
