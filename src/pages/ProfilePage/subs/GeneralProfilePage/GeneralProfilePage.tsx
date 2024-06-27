/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, FormInstance, Space, Typography } from 'antd';
import { ProfileSection } from 'pages/ProfilePage/partials';

const { Text, Link, Title } = Typography;

export interface GeneralProfilePageProps {}

const Page: React.FC<GeneralProfilePageProps> = () => {
  const handleChangePassword = (form: FormInstance) => {
    form.validateFields().then(() => {
      const { your_password, new_password } = form.getFieldsValue();
      const payload = { password: your_password, new_password: new_password };
    });
  };

  return (
    <Space direction="vertical" className="w-full">
      <ProfileSection title="Change username" className="w-full mb-8">
        <Text>
          Changing your username can have <Link>unintended side effects</Link>
        </Text>
        <Button>Change username</Button>
        <Text type="secondary">
          Looking to manage account security settings? You can find them in the{' '}
          <Link>Password and authentication</Link> page
        </Text>
      </ProfileSection>
      <ProfileSection title="Export account data" className="w-full mb-8">
        <Text>
          Export all repositories and profile metadata for <Text strong>@anonymous</Text>. Exports
          will be available for 7 days.
        </Text>
        <Button>Start export</Button>
      </ProfileSection>
      <ProfileSection
        title={
          <Title level={3} type="danger">
            Delete account
          </Title>
        }
        className="w-full"
      >
        <Text>
          You must remove yourself, transfer ownership, or delete these organizations before you can
          delete your user.
        </Text>
        <Button danger>Delete your account</Button>
      </ProfileSection>
    </Space>
  );
};

export default Page;
