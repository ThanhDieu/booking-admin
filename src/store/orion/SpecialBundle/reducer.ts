/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import { getSpecialBundleListThunk } from './thunks';
import { SpecialBundleType } from 'services/Bundle/type';

interface SpecialBundleState {
  loading: boolean;
  data?: DataResponseType<SpecialBundleType>;
}
const initialState: SpecialBundleState = {
  loading: false,
  data: undefined
};

export const specialBundleSlice = createSlice({
  name: 'specialBundle',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSpecialBundleListThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSpecialBundleListThunk.fulfilled, (state, action: any) => {
      state.loading = false;
      state.data = action?.payload;
    });
    builder.addCase(getSpecialBundleListThunk.rejected, (state) => {
      state.loading = false;
      state.data = undefined;
    });
  }
});

export default specialBundleSlice.actions;
