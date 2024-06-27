import { createSlice } from '@reduxjs/toolkit';
import {
  createSample,
  getSampleDetail,
  getSampleList,
  removeSampleById,
  sampleAdapter,
  updateSample
} from './thunks';
import { Sample } from 'services/Sample/type';

interface IndicatorProps {
  create: boolean;
  update: boolean;
  list: boolean;
  delete: boolean;
  detail: boolean;
}

interface InitialStateType {
  // meta?: PaginationProps;
  indicator: IndicatorProps;
  detail?: Sample;
}

const initialState: InitialStateType = {
  indicator: {
    create: false,
    update: false,
    list: false,
    delete: false,
    detail: false
  }
};

export const sampleSlice = createSlice({
  name: 'Sample',
  initialState: sampleAdapter.getInitialState(initialState),
  reducers: {
    updateMeta: (state, payload) => {
      // state.meta = payload;
    }
  },
  extraReducers: (builder) => {
    // fetch detail catcher
    builder.addCase(getSampleDetail.pending, (state) => {
      state.indicator.detail = true;
    });
    builder.addCase(getSampleDetail.fulfilled, (state, { payload }) => {
      state.detail = payload;
      state.indicator.detail = false;
    });
    builder.addCase(getSampleDetail.rejected, (state) => {
      state.indicator.detail = false;
    });
    // fetch list catcher
    builder.addCase(getSampleList.pending, (state) => {
      state.indicator.list = true;
    });
    builder.addCase(getSampleList.fulfilled, (state, { payload }) => {
      payload && sampleAdapter.setAll(state, payload);
      state.indicator.list = false;
    });
    builder.addCase(getSampleList.rejected, (state) => {
      state.indicator.list = false;
    });
    // remove item by id catcher
    builder.addCase(removeSampleById.pending, (state) => {
      state.indicator.delete = true;
    });
    builder.addCase(removeSampleById.fulfilled, (state, { payload }) => {
      payload && sampleAdapter.removeMany(state, payload);
      state.indicator.delete = false;
    });
    builder.addCase(removeSampleById.rejected, (state) => {
      state.indicator.delete = false;
    });
    // create item catcher
    builder.addCase(createSample.pending, (state) => {
      state.indicator.create = true;
    });
    builder.addCase(createSample.fulfilled, (state, { payload }) => {
      payload && sampleAdapter.addOne(state, payload);
      state.indicator.create = false;
    });
    builder.addCase(createSample.rejected, (state) => {
      state.indicator.create = true;
    });
    // update item catcher
    builder.addCase(updateSample.pending, (state) => {
      state.indicator.update = true;
    });
    builder.addCase(updateSample.fulfilled, (state, { payload }) => {
      payload &&
        sampleAdapter.updateOne(state, {
          id: payload.id || '',
          changes: payload
        });
      state.indicator.update = false;
    });
    builder.addCase(updateSample.rejected, (state) => {
      state.indicator.update = true;
    });
  }
});

export const { updateMeta } = sampleSlice.actions;
