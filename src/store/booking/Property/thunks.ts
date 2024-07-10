/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiPropertyDetailService, propertyListServiceV2 } from 'services/Properties';

export const getPropertyDetails = createAsyncThunk<
  any,
  {
    id: string;
    signal?: AbortSignal;
  }
>('property/getDetails', async (form) => {
  if (!form) throw new Error('Property not found');
  const res = await apiPropertyDetailService(form.id, form.signal);

  if (res?.data?.data && res?.data?.data.length > 0) {
    return res?.data?.data;
  }
  return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Property not found'));
});

export const getPropertyList = createAsyncThunk<
  any,
  {
    query: string;
    signal?: AbortSignal;
  }
>('property/getPropertyList', async (form) => {
  if (!form) throw new Error('Property not found');
  const res = await propertyListServiceV2(form.query, form.signal);

  if (res?.data?.data && res?.data?.data.length > 0) {
    return res?.data?.data;
  }
  return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Property not found'));
});
