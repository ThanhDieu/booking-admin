/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import {
  clearAccessToken,
  clearRefreshToken,
  clearViewMode,
  clearWhiteList,
  loadWhiteList,
  saveViewMode,
  saveWhiteList
} from 'utils/storage';

import { AuthStatus, ViewMode } from 'configs/const/auth';
import { UserType } from 'services/Users/types';
import { initialUserSessionAction } from './thunks';

interface AuthState {
  loading: boolean;
  status: AuthStatus.Auth | AuthStatus.Unauth;
  profile?: UserType;
  view?: string;
}
const initialState: AuthState = {
  loading: false,
  status: AuthStatus.Unauth,
  profile: undefined,
  // TODO
  view: ViewMode.Account
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.status = AuthStatus.Unauth;
      state.profile = undefined;
      state.view = '';
      clearAccessToken();
      clearViewMode();
      clearRefreshToken()
      clearWhiteList();
    },
    updateView: (state, action) => {
      state.view = action.payload;
      saveViewMode(action.payload);
      state.status = AuthStatus.Auth;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(initialUserSessionAction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(initialUserSessionAction.fulfilled, (state, action: any) => {
      const profilePayload = action?.payload[0];
      if (!profilePayload) return;

      const whiteList = loadWhiteList()
      saveWhiteList({ ...whiteList, user: profilePayload })
      state.loading = false;
      state.status = AuthStatus.Auth;
      state.profile = profilePayload;
    });
    builder.addCase(initialUserSessionAction.rejected, (state) => {
      state.loading = false;
      const whiteList = loadWhiteList()

      // state.status = AuthStatus.Unauth;
      state.profile = whiteList?.user || undefined;
      // clearAccessToken();
      // clearRefreshToken()
      // clearViewMode();
      // clearAccountStatus();
    });
  }
});

export const { logout, updateView } = authSlice.actions;
