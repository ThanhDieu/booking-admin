/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import { getBundleListThunk, triggerSendNewsletterThunk } from './thunks';
import { BundleListType } from 'services/Bundle/type';

interface NewsletterResponse {
  status: string;
  message: string;
  bundle_id?: string;
}
interface TaskState {
  loading: boolean;
  bundlesList?: DataResponseType<BundleListType>;
  loadingSendNewsletter: boolean;
  statusSend?: NewsletterResponse;
}
const initialState: TaskState = {
  loading: false,
  bundlesList: undefined,
  loadingSendNewsletter: false,
  statusSend: undefined
};

export const bundleSlice = createSlice({
  name: 'bundle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBundleListThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getBundleListThunk.fulfilled, (state, action: any) => {
      state.loading = false;
      state.bundlesList = action?.payload?.length ? action?.payload[0] : undefined;
    });
    builder.addCase(getBundleListThunk.rejected, (state) => {
      state.loading = false;
      state.bundlesList = undefined;
    });

    //Newsletter
    builder.addCase(triggerSendNewsletterThunk.pending, (state) => {
      state.loadingSendNewsletter = true;
    });
    builder.addCase(triggerSendNewsletterThunk.fulfilled, (state, action) => {
      state.loadingSendNewsletter = false;
      state.statusSend = action?.payload;
    });
    builder.addCase(triggerSendNewsletterThunk.rejected, (state) => {
      state.loadingSendNewsletter = false;
    });
  }
});

export default bundleSlice.actions;
