import { StoreProvider } from 'components/wrapper';

const withStoreProvider = (component: React.ReactElement) => {
  return <StoreProvider>{component}</StoreProvider>;
};

export default withStoreProvider;
