/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import { PropertyDetailAppType } from 'services/Properties/type';
import { getPropertyDetails, getPropertyList } from './thunks';
import errors from 'configs/const/errors';
import { loadWhiteList, saveWhiteList } from 'utils/storage';

interface AuthState {
  loading: boolean;
  detail?: PropertyDetailAppType;
  properties?: DataResponseType<PropertyDetailAppType>;
}
const initialState: AuthState = {
  loading: false,
  detail: undefined,
  properties: undefined
};

export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPropertyDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPropertyDetails.fulfilled, (state, action: any) => {
      state.loading = false;

      state.detail = action?.payload?.length ? action?.payload[0] : undefined;
    });
    builder.addCase(getPropertyDetails.rejected, (state, action: any) => {
      state.loading = false;
      if (action?.error?.name?.toLowerCase() === errors.ERR && action?.error?.message?.toLowerCase() === errors.RECORD_NOTFOUND) {
        state.detail = {
          disabled: true
        }
      } else {
        state.detail = undefined
      }

    });

    /// list
    builder.addCase(getPropertyList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getPropertyList.fulfilled, (state, action: any) => {
      state.loading = false;
      state.properties = action?.payload?.length ? action?.payload[0] : undefined;
      const whiteList = loadWhiteList()
      saveWhiteList({ ...whiteList, properties: state.properties })
    });
    builder.addCase(getPropertyList.rejected, (state) => {
      state.loading = false;
      const whiteList = loadWhiteList()
      state.properties = whiteList?.properties || undefined;
    });
  }
});

export default propertySlice.actions;
