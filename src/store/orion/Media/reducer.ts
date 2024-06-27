/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';

import { getMediaDataAction } from './thunks';
import { MediaStrapiType } from 'services/@strapi/type';

interface MediaState {
  loading: boolean;
  error: string;
  data: MediaStrapiType[];
  dataFiltered: MediaStrapiType[];
  events: {
    search: string;
    filter: string;
  };
}
const initialState: MediaState = {
  loading: false,
  data: [],
  error: '',
  dataFiltered: [],
  events: {
    search: '',
    filter: 'all'
  }
};

const filterData = (
  dataArr: MediaStrapiType[],
  fields: (keyof MediaStrapiType)[],
  value: string
) => {
  const newArr = dataArr.filter((data) =>
    fields.some((field) => (data[field] as string)?.trim()?.toLowerCase().includes(value))
  );
  return newArr || [];
};

export const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    searchMedia: (state, action) => {
      let foundMedia;
      if (action.payload) {
        const cloneMedia = [...state.data];
        const searchValue = (action.payload as string).trim().toLowerCase();
        state.events.search = searchValue;

        foundMedia = filterData(cloneMedia, ['name', 'alternativeText', 'caption'], searchValue);
        if (state.events.filter !== 'all') {
          foundMedia = filterData(foundMedia, ['ext'], state.events.filter);
        }
        state.dataFiltered = foundMedia;
      } else {
        state.dataFiltered = state.data;
        state.events.search = '';
        foundMedia = state.data;
      }
      if (state.events.filter !== 'all') {
        state.dataFiltered = filterData(foundMedia, ['ext'], state.events.filter);
      }
    },
    filterTypeMedia(state, action) {
      let foundMedia;
      if (action.payload && action.payload !== 'all') {
        const cloneMedia = [...state.data];
        foundMedia = filterData(cloneMedia, ['ext'], action.payload);
        state.events.filter = action.payload;
        state.dataFiltered = foundMedia;
      } else {
        state.dataFiltered = state.data;
        state.events.filter = 'all';
        foundMedia = state.data;
      }

      if (state.events.search) {
        state.dataFiltered = filterData(
          foundMedia,
          ['name', 'alternativeText', 'caption'],
          state.events.search
        );
      }
    },
    resetFilterState: (state) => {
      state.events = {
        search: '',
        filter: 'all'
      };
      state.dataFiltered = state.data;
    }
  },

  extraReducers: (builder) => {
    builder.addCase(getMediaDataAction.pending, (state) => {
      state.loading = true;
      state.error = '';
    });
    builder.addCase(getMediaDataAction.fulfilled, (state, action: any) => {
      state.loading = false;
      state.data = action?.payload?.length ? action?.payload : [];
      state.dataFiltered = action?.payload?.length ? action?.payload : [];
      state.events = {
        search: '',
        filter: 'all'
      };
    });
    builder.addCase(getMediaDataAction.rejected, (state) => {
      state.loading = false;
      state.error = 'Have something wrong';
    });
  }
});

export const { searchMedia, filterTypeMedia, resetFilterState } = mediaSlice.actions;
