/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMediaListService } from 'services/@strapi/strapiService';
import { MediaStrapiType } from 'services/@strapi/type';

export const getMediaDataAction = createAsyncThunk('media/getMediaData', async () => {
  try {
    const res = await getMediaListService();
    if (res?.data && (res?.data as any).length > 0) {
      return (
        (res?.data as any).sort(
          (a: MediaStrapiType, b: MediaStrapiType) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ) || []
      );
    }
  } catch (error) {
    /* empty */
  }
});
