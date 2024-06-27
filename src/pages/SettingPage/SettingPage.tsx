import { NotificationOutlined, TranslationOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Space } from 'antd';
import { PlainLayout } from 'components/layout';
import { Menu } from 'components/shared';
import { MenuProps } from 'components/shared/Menu';
import { COPYRIGHT } from 'constant';
import { useHelmet } from 'hooks';
import { useLocation, useNavigate } from 'react-router-dom';

export interface SettingPageProps {
  children?: React.ReactNode;
}

const Page: React.FC<SettingPageProps> = (props) => {
  useHelmet({
    title: 'Orion - Setting'
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (url: string) => navigate(url);

  const menus: (MenuProps & { key: string })[] = [
    {
      key: 'general',
      items: [
        {
          key: '/settings/notification',
          children: 'Notification',
          icon: <NotificationOutlined />,
          onClick: () => handleNavigate('notification')
        },
        {
          key: '/settings/lang',
          children: 'Language',
          icon: <TranslationOutlined />,
          onClick: () => handleNavigate('lang')
        }
      ]
    }
  ];

  return (
    <PlainLayout
      className="bg-inherit"
      headerprops={{
        title: 'Settings'
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
    >
      <Row gutter={[8, 8]}>
        <Col span={4}>
          <Space direction="vertical" className="w-full">
            {menus.map((value, index) => {
              const isLastElement = index === menus.length - 1;

              if (isLastElement) {
                // eslint-disable-next-line react/jsx-key
                return <Menu selected={location.pathname} {...value} />;
              }

              return (
                <>
                  <Menu selected={location.pathname} {...value} />
                  <Divider className="m-0" />
                </>
              );
            })}
          </Space>
        </Col>
        <Col span={20}>
          <div className="w-full max-w-[768px]">{props.children}</div>
        </Col>
      </Row>
    </PlainLayout>
  );
};

export default Page;
