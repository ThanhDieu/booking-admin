/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { getCampaignListThunk } from './thunks';
import { CampaignListType } from 'services/SendMail/type';

interface mailchimpState {
  campaignLoading: boolean;
  campaignList?: CampaignListType[];
}
const initialState: mailchimpState = {
  campaignLoading: false,
  campaignList: []
};

export const mailchimpSlice = createSlice({
  name: 'buildIbe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCampaignListThunk.pending, (state) => {
      state.campaignLoading = true;
    });
    builder.addCase(getCampaignListThunk.fulfilled, (state, action: any) => {
      state.campaignLoading = false;
      state.campaignList = action?.payload;
    });
    builder.addCase(getCampaignListThunk.rejected, (state) => {
      state.campaignLoading = false;
      state.campaignList = undefined;
    });
  }
});

export default mailchimpSlice.actions;
