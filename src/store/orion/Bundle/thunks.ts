/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBundlesService, triggerSendNewsletterService } from 'services/Bundle';
import { SendNewsletterPayload } from 'services/Bundle/type';

export const getBundleListThunk = createAsyncThunk<any, { queries: string; signal?: AbortSignal }>(
  'bundle/getBundleListThunk',
  async (form) => {
    try {
      const res = await getBundlesService(form.queries, form.signal);
      if (res?.data?.data && res?.data?.data.length > 0) {
        return res?.data?.data;
      }

      return Promise.reject(new Error((res?.data?.errors as any)?.[0] || 'Bundles not found'));
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
);

export const triggerSendNewsletterThunk = createAsyncThunk<any, { payload: SendNewsletterPayload }>(
  'bundle/triggerSendNewsletter',
  async (form) => {
    try {
      const res = await triggerSendNewsletterService(form.payload);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }
);
