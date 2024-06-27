/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllBuildId, getBuildStatus, triggerBuild } from 'services/BuildProcess';

export const getAllBuildThunk = createAsyncThunk(
  'buildIbe/getBuildList',

  async () => {
    try {
      const res = await getAllBuildId();
      if (res?.data && (res?.data as any).length > 0) {
        return res.data;
      } else [];
    } catch (error) {
      console.error(error);
    }
  }
);

export const triggerBuildThunk = createAsyncThunk('buildIbe/triggerBuild', async () => {
  try {
    const res = await triggerBuild();
    return res.data;
  } catch (error) {
    console.error(error);
  }
});

export const getStatusLatestBuild = createAsyncThunk('buildIbe/statusLatestBuild', async () => {
  try {
    const res = await getBuildStatus();
    return res.data;
  } catch (error) {
    console.error(error);
  }
});
