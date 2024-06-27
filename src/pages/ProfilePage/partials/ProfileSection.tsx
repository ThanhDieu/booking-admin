import { Typography, Divider, Space } from 'antd';

const { Title } = Typography;

export interface ProfileSectionProps {
  title?: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

function ProfileSection(props: ProfileSectionProps) {
  const { title, children, className } = props;

  return (
    <Space direction="vertical" className={className}>
      {title && <Title level={3}>{title}</Title>}
      <Divider className="m-0" />
      {children}
    </Space>
  );
}

export default ProfileSection;
