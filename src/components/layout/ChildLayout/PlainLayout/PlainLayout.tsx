import React from 'react';
import './PlainLayout.style.less';
import withBaseChildLayout from '../withBaseChildLayout';
import { BaseChildLayoutProps } from '../BaseChildLayout';
import { useAppSize } from 'hooks';
import { LAYOUT_HEADER_HEIGHT, PAGE_HEADER_HEIGHT } from 'constant/size';

export interface PlainLayoutProps
  extends React.FC<BaseChildLayoutProps & React.HTMLAttributes<HTMLDivElement>> {}

const Layout: PlainLayoutProps = (props) => {
  const { innerAppHeight } = useAppSize();
  const height = innerAppHeight - PAGE_HEADER_HEIGHT - LAYOUT_HEADER_HEIGHT;
  return (
    <div
      {...props}
      // className={clsx(selected === ThemeType.DEFAULT && 'bg-white', props.className)}
      style={{ height: height }}
    />
  );
};

export default withBaseChildLayout(Layout);
