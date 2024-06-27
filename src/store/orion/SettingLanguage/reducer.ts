/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import { LanguageSettingType } from 'services/SettingLanguage/type';
import { getAllSettingLanguage } from './thunks';

interface AuthState {
  loading: boolean;
  languages?: LanguageSettingType[];
}
const initialState: AuthState = {
  loading: false,
  languages: undefined
};

export const languageSettingSlice = createSlice({
  name: 'languageSetting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSettingLanguage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllSettingLanguage.fulfilled, (state, action: any) => {
      state.loading = false;
      state.languages = action?.payload?.length ? action?.payload : undefined;
    });
    builder.addCase(getAllSettingLanguage.rejected, (state) => {
      state.loading = false;
    });
  }
});

export default languageSettingSlice.actions;
