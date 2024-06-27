/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseLayout, { BaseChildLayoutProps } from './BaseChildLayout';

export type BaseLayoutProps<T extends unknown> = T & BaseChildLayoutProps;

function withBaseChildLayout<T>(Page: React.FC<T>): React.FC<T> {
  const RootPage: typeof Page = (props: T) => {
    return (
      <BaseLayout {...props}>
        <Page {...(props as any)} />
      </BaseLayout>
    );
  };

  return RootPage;
}

export default withBaseChildLayout;
