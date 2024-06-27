/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import { getServiceList } from '.';
import { ServicesAppType } from 'services/ServiceList/type';

interface TagState {
  loading: boolean;
  data?: DataResponseType<ServicesAppType>;
}
const initialState: TagState = {
  loading: false,
  data: undefined
};

export const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getServiceList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getServiceList.fulfilled, (state, action: any) => {
      state.loading = false;
      state.data = action?.payload?.length ? action?.payload[0] : undefined;
    });
    builder.addCase(getServiceList.rejected, (state) => {
      state.loading = false;
      state.data = undefined;
    });
  }
});

export default serviceSlice.actions;
