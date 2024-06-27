import { createSlice } from '@reduxjs/toolkit';

type MetaProps = {
  name?: string;
  content?: string;
  charSet?: string;
};

type LinkProps = {
  rel?: string;
  href?: string;
};

export interface HelmetProps {
  title?: string;
  meta?: MetaProps[];
  link?: LinkProps[];
}

const initialState: HelmetProps = {
  title: 'Project Name'
};

const HelmetSlice = createSlice({
  name: 'helmet',
  initialState,
  reducers: {
    set: (state, { payload }) => {
      state.title = payload.title;
      state.link = payload.link;
      state.meta = payload.meta;
    }
  }
});

export const { set } = HelmetSlice.actions;

export default HelmetSlice.reducer;
