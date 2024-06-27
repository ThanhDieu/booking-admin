import { createSlice } from '@reduxjs/toolkit';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { ThemeType } from 'configs/const/general';
import { colorScheme } from 'configs/themes/collection';
import { loadTheme } from 'utils/storage';

export interface ThemeProps {
  selected: string;
  colorPrimary: string;
  space?: { size?: number | SizeType };
  direction?: 'ltr' | 'rtl';
  componentSize?: SizeType;
}

const { primaryColor } = colorScheme;

const initialState: ThemeProps = {
  selected: loadTheme() ?? ThemeType.DEFAULT,
  colorPrimary: primaryColor,
  space: {
    size: 'middle'
  },
  direction: 'ltr',
  componentSize: 'middle'
};

const ThemeSlice = createSlice({
  name: 'Theme',
  initialState,
  reducers: {
    selectTheme: (state, { payload }) => {
      state.selected = payload;
    },
    selectSpace: (state, { payload }) => {
      state.space = payload;
    },
    selectAccentColor: (state, { payload }) => {
      state.colorPrimary = payload;
    },
    selectDirection: (state, { payload }) => {
      state.direction = payload;
    },
    selectComponentSize: (state, { payload }) => {
      state.componentSize = payload;
    }
  }
});

export const { selectTheme, selectSpace, selectDirection, selectAccentColor, selectComponentSize } =
  ThemeSlice.actions;

export default ThemeSlice.reducer;
