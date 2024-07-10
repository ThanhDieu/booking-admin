/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getLandscapesService } from 'services/Landscape';

export const getLandscapeList = createAsyncThunk<
  any,
  {
    query: string;
    signal?: AbortSignal;
  }
>('landscape/getLandscapeList', async (form) => {
  try {
    const res = await getLandscapesService(form.query, form.signal);
    if (res?.data?.data && res?.data?.data.length > 0) {
      return res?.data?.data[0];
    }
    return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Landcapses not found'));
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
