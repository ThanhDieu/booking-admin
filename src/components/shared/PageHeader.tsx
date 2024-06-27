import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageHeader, PageHeaderProps } from '@ant-design/pro-components';
import { Typography } from 'antd';

const { Text, Title } = Typography;

function XPageHeader(props: PageHeaderProps) {
  return (
    <PageHeader
      {...props}
      title={
        <Title level={4} className="mb-0">
          {props.title}
        </Title>
      }
      subTitle={<Text type="secondary">{props.subTitle}</Text>}
      backIcon={<ArrowLeftOutlined color={'#fff'} />}
    />
  );
}

export default XPageHeader;
