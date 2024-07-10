/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getRoomCategoryService } from 'services/RoomCategory';

export const getSpecialBundleListThunk = createAsyncThunk<
  any,
  {
    query: string;
    signal?: AbortSignal;
  }
>('specialBundle/getSpecialBundleList', async (form) => {
  try {
    const res = await getRoomCategoryService(form.query, form.signal);
    if (res?.data?.data && res?.data?.data.length > 0) {
      return res?.data?.data[0];
    }
    return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Bundles not found'));
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
