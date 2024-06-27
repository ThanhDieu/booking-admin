/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { trigerGetCampaignList, triggerSendCampaign } from 'services/SendMail';
import { CampaignSendPayload } from 'services/SendMail/type';

export const getCampaignListThunk = createAsyncThunk('mailchimp/getCampaignList', async () => {
  try {
    const res = await trigerGetCampaignList();
    if (res?.data && (res?.data as any).length > 0) {
      return res.data;
    } else[];
  } catch (error: any) {
    // console.error(error?.message);
    return Promise.reject(new Error(error?.message || ''))
  }
});

export const triggerSendCampaignThunk = createAsyncThunk<any, { formData: CampaignSendPayload }>(
  'mailchimp/triggerSendCampaign',
  async (payload) => {
    try {
      const res = await triggerSendCampaign(payload.formData);
      return res.data;
    } catch (error: any) {
      // console.error(error);
      return Promise.reject(new Error(error?.message || ''))
    }
  }
);
