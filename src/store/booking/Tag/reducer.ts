/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import { TagDetailAppType } from 'services/Tags/type';
import { getTagList } from './thunks';

interface TagState {
  loading: boolean;
  data?: DataResponseType<TagDetailAppType>;
}
const initialState: TagState = {
  loading: false,
  data: undefined
};

export const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTagList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTagList.fulfilled, (state, action: any) => {
      state.loading = false;
      state.data = action?.payload;
    });
    builder.addCase(getTagList.rejected, (state) => {
      state.loading = false;
      state.data = undefined;
    });
  }
});

export default tagSlice.actions;
