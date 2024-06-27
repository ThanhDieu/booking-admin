/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllLanguageSetting } from 'services/SettingLanguage';

export const getAllSettingLanguage = createAsyncThunk<
  any,
  {
    signal?: AbortSignal;
  }
>('settings/getAllLanguages', async (form) => {
  const res = await getAllLanguageSetting(form.signal);

  if ((res?.data as any)?.languages && (res?.data as any).languages.length > 0) {
    return (res?.data as any)?.languages;
  }
  return Promise.reject(new Error('Languages not found'));
});
