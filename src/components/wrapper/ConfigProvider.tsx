import { App, ConfigProvider } from 'antd';
import { useAppSelector } from 'store';
import { themes } from 'configs';
import { useMemo } from 'react';
import { Global } from '@emotion/react';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

export interface XConfigProviderProps {
  children?: React.ReactNode;
}

const XConfigProvider = (props: XConfigProviderProps) => {
  dayjs.extend(updateLocale);
  dayjs.updateLocale('en', {
    weekStart: 1
  });

  const {
    selected: selectedThemeKey,
    colorPrimary,
    ...restConfigProps
  } = useAppSelector((state) => state.app.theme);

  const selectedTheme = useMemo(
    () => ({
      ...themes[selectedThemeKey],
      token: {
        ...themes[selectedThemeKey]?.token,
        colorPrimary
      }
    }),
    [selectedThemeKey, colorPrimary]
  );

  return (
    <>
      <Global
        styles={{
          '.ant-layout-sider-trigger': {
            backgroundColor: selectedTheme && selectedTheme.components?.Layout?.colorBgTrigger
          }
        }}
      />
      <ConfigProvider {...restConfigProps} theme={selectedTheme}>
        <App>{props.children}</App>
      </ConfigProvider>
    </>
  );
};

export default XConfigProvider;
