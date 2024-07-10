/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import { BundleTaskType, TaskType } from 'services/Tasks/type';
import { getBundleTaskList, getTaskList } from './thunks';

interface TaskState {
  loading: boolean;
  tasks?: DataResponseType<TaskType>;
  bundleTasks?: DataResponseType<BundleTaskType>;
}
const initialState: TaskState = {
  loading: false,
  tasks: undefined,
  bundleTasks: undefined
};

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTaskList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTaskList.fulfilled, (state, action: any) => {
      state.loading = false;
      state.tasks = action?.payload?.length ? action?.payload[0] : undefined;
    });
    builder.addCase(getTaskList.rejected, (state) => {
      state.loading = false;
      state.tasks = undefined;
    });

    builder.addCase(getBundleTaskList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getBundleTaskList.fulfilled, (state, action: any) => {
      state.loading = false;
      state.bundleTasks = action?.payload?.length ? action?.payload[0] : undefined;
    });
    builder.addCase(getBundleTaskList.rejected, (state) => {
      state.loading = false;
      state.bundleTasks = undefined;
    });
  }
});

export default taskSlice.actions;
