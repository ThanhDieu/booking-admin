/* eslint-disable @typescript-eslint/no-empty-interface */
import { Select, Space, Typography } from 'antd';
import { SettingSection } from 'pages/SettingPage/partials';

const { Text } = Typography;

export interface LangSettingPageProps {}

const Page: React.FC<LangSettingPageProps> = () => {
  const handleChangeLanguage = (value: string) => {
    console.log('Language selected: ' + value);
  };

  return (
    <Space direction="vertical" className="w-full">
      <SettingSection title="Language" className="w-full mb-8">
        <Space direction="horizontal" className="w-full">
          <Text>Control your language</Text>
          <Select
            defaultValue="english"
            style={{ width: 120 }}
            onChange={handleChangeLanguage}
            options={[
              { value: 'english', label: 'English' },
              { value: 'germany', label: 'Germany' },
              { value: 'vietnam', label: 'Viet Nam' }
            ]}
          />
        </Space>
      </SettingSection>
    </Space>
  );
};

export default Page;
