/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import { getActivityList } from './thunks';
import { ActivityType } from 'services/Activity/type';

interface ActivityState {
  loading: boolean;
  data?: DataResponseType<ActivityType>;
}
const initialState: ActivityState = {
  loading: false,
  data: undefined
};

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getActivityList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getActivityList.fulfilled, (state, action: any) => {
      state.loading = false;
      state.data = action?.payload;
    });
    builder.addCase(getActivityList.rejected, (state) => {
      state.loading = false;
      state.data = undefined;
    });
  }
});

export default activitySlice.actions;
