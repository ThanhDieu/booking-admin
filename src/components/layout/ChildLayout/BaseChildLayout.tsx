/**
 * Base Layout for nested components
 * # Usages:
 *
 * <Layout
 *  headerprops={{
 *    title: 'Page Title'
 *  }}
 *  footerprops={{
 *    children: 'All copyright cozde'
 *  }}
 * >
 *  Content goes here
 * </Layout>
 */
import { PageHeaderProps } from '@ant-design/pro-layout';
import { Layout } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { PageHeader } from 'components/shared';
import { useAppSize } from 'hooks';

const { Footer } = Layout;

export interface BaseChildLayoutProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Ref for headerprops: https://ant.design/components/page-header/#header
   */
  headerprops?: PageHeaderProps;
  /**
   * Ref for footerprops: N/A
   */
  footerprops?: React.HTMLAttributes<HTMLElement>;
}

const XLayout: React.FC<BaseChildLayoutProps> = (props) => {
  const { children, headerprops, footerprops } = props;
  const { innerAppHeight } = useAppSize();
  return (
    <>
      {headerprops && (
        <PageHeader {...headerprops} className={clsx(headerprops.className, 'px-0')} />
      )}
      <div
        className="overflow-x-hidden overflow-y-auto h-full max-w-[1600px] "
        style={{ maxHeight: innerAppHeight }}
      >
        {children}
      </div>
      {footerprops && <Footer {...footerprops} />}
    </>
  );
};

export default XLayout;
