import './ListDetailLayout.style.less';
import { Col, ColProps, Row, RowProps } from 'antd';
import withBaseChildLayout from '../withBaseChildLayout';
import { BaseChildLayoutProps } from '../BaseChildLayout';
import clsx from 'clsx';

export interface ListDetailItemLayoutProps extends ColProps {}

export const List: React.FC<ListDetailItemLayoutProps> = (props) => {
  return (
    <Col
      span={6}
      {...props}
      className={clsx('list-detail-layout-content__item', props.className)}
    />
  );
};

export const Detail: React.FC<ListDetailItemLayoutProps> = (props) => {
  return (
    <Col
      span={18}
      {...props}
      className={clsx('list-detail-layout-content__item', props.className)}
    />
  );
};

export interface IBaseProps extends BaseChildLayoutProps, React.FC<RowProps> {}

export interface ListDetailLayoutProps extends React.FC<BaseChildLayoutProps & RowProps> {
  List: typeof List;
  Detail: typeof Detail;
}

const Layout: React.FC<BaseChildLayoutProps & RowProps> = (props) => {
  const { children } = props;

  return (
    <Row gutter={8} {...props} className={clsx('list-detail-layout-content', props.className)}>
      {children}
    </Row>
  );
};

const _layout = withBaseChildLayout<IBaseProps>(Layout) as ListDetailLayoutProps;

_layout.List = List;
_layout.Detail = Detail;

export default _layout;
