/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getServicesByPropertyService } from 'services/ServiceList';

export const getServiceList = createAsyncThunk<
  any,
  {
    query: string;
    signal?: AbortSignal;
  }
>('tag/getServiceList', async (form) => {
  try {
    const res = await getServicesByPropertyService(form.query, form.signal);
    if (res?.data?.data && res?.data?.data.length > 0) {
      return res?.data?.data;
    }
    return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Services not found'));
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
