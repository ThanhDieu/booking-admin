/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import { getRoleList } from '.';
import { RoleType } from '@types';

interface TagState {
  loading: boolean;
  data?: RoleType[];
}
const initialState: TagState = {
  loading: false,
  data: undefined
};

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getRoleList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRoleList.fulfilled, (state, action: any) => {
      state.loading = false;
      state.data = action?.payload?.length ? action?.payload : undefined;
    });
    builder.addCase(getRoleList.rejected, (state) => {
      state.loading = false;
      state.data = undefined;
    });
  }
});

export default roleSlice.actions;
