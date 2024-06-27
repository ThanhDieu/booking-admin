import { ThemeConfig } from 'antd/es/config-provider/context';
import { base, dark } from './collection';

export interface ThemeProps {
  [themeKey: string]: ThemeConfig;
}

const instance: ThemeProps = {
  default: base,
  dark
};

export default instance;
