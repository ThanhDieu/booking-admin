/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { LandscapeType } from 'services/Landscape/type';
import { getLandscapeList } from './thunks';

interface LandscapeState {
  loading: boolean;
  data?: DataResponseType<LandscapeType>;
}
const initialState: LandscapeState = {
  loading: false,
  data: undefined
};

export const landscapeSlice = createSlice({
  name: 'landscape',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLandscapeList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLandscapeList.fulfilled, (state, action: any) => {
      state.loading = false;
      state.data = action?.payload;
    });
    builder.addCase(getLandscapeList.rejected, (state) => {
      state.loading = false;
      state.data = undefined;
    });
  }
});

export default landscapeSlice.actions;
