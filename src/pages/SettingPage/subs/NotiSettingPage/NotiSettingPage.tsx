import { Space } from 'antd';
import { SettingSection } from 'pages/SettingPage/partials';

export interface NotiSettingPageProps {}

const Page: React.FC<NotiSettingPageProps> = () => {
  return (
    <Space direction="vertical" className="w-full">
      <SettingSection title="Notification" className="w-full mb-8">
        <Space direction="horizontal" className="w-full justify-between"></Space>
      </SettingSection>
    </Space>
  );
};

export default Page;
