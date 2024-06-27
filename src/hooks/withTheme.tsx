import { ConfigProvider } from 'components/wrapper';

const withTheme = (component: React.ReactElement) => {
  return <ConfigProvider>{component}</ConfigProvider>;
};

export default withTheme;
