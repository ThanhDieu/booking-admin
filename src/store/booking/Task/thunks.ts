/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBundleHasTasksService, getTasksService } from 'services/Tasks';

export const getTaskList = createAsyncThunk<
  any,
  {
    query: string;
    signal?: AbortSignal;
  }
>('task/getTaskList', async (form) => {
  try {
    const res = await getTasksService(form.query, form.signal);
    if (res?.data?.data && res?.data?.data.length > 0) {
      return res?.data?.data;
    }
    return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Tasks not found'));
  } catch (error) {
    throw new Error((error as Error).message);
  }
});

export const getBundleTaskList = createAsyncThunk<
  any,
  {
    query: string;
    signal?: AbortSignal;
  }
>('task/getBundleHasTasks', async (form) => {
  try {
    const res = await getBundleHasTasksService(form.query, form.signal);
    if (res?.data?.data && res?.data?.data.length > 0) {
      return res?.data?.data;
    }
    return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Tasks not found'));
  } catch (error) {
    throw new Error((error as Error).message);
  }
});
