/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getTagsListService } from 'services/Tags';

export const getTagList = createAsyncThunk<
  any,
  {
    query: string;
    signal?: AbortSignal;
  }
>('tag/getTagList', async (form) => {
  try {
    const res = await getTagsListService(form.query, form.signal);
    if (res?.data?.data && res?.data?.data.length > 0) {
      return res?.data?.data[0];
    }
    return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Tasks not found'));
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
