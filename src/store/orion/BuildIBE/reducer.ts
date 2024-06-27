/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { getAllBuildThunk, getStatusLatestBuild, triggerBuildThunk } from './thunks';
import { BuildProcessType, StatusTrigger } from 'services/BuildProcess/type';

interface buildIbeState {
  loading: boolean;
  buildList?: BuildProcessType[];
  statusTrigger?: StatusTrigger;
  latestBuildData?: BuildProcessType;
}
const initialState: buildIbeState = {
  loading: false,
  buildList: [],
  latestBuildData: undefined,
  statusTrigger: undefined
};

export const buildIBESlice = createSlice({
  name: 'buildIbe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllBuildThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllBuildThunk.fulfilled, (state, action: any) => {
      state.loading = false;
      state.buildList = action?.payload;
    });
    builder.addCase(getAllBuildThunk.rejected, (state) => {
      state.loading = false;
      state.buildList = undefined;
    });

    builder.addCase(triggerBuildThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(triggerBuildThunk.fulfilled, (state, action: any) => {
      state.loading = false;
      state.statusTrigger = action?.payload;
    });
    builder.addCase(triggerBuildThunk.rejected, (state) => {
      state.loading = false;
      state.statusTrigger = undefined;
    });

    builder.addCase(getStatusLatestBuild.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getStatusLatestBuild.fulfilled, (state, action: any) => {
      state.loading = false;
      state.latestBuildData = action?.payload;
    });
    builder.addCase(getStatusLatestBuild.rejected, (state) => {
      state.loading = false;
      state.latestBuildData = undefined;
    });
  }
});

export default buildIBESlice.actions;
