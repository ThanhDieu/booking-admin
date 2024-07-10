/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getActivitiesService } from 'services/Activity';

export const getActivityList = createAsyncThunk<
  any,
  {
    query: string;
    signal?: AbortSignal;
  }
>('activity/getActivityList', async (form) => {
  try {
    const res = await getActivitiesService(form.query, form.signal);
    if (res?.data?.data && res?.data?.data.length > 0) {
      return res?.data?.data[0];
    }
    return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Activities not found'));
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
