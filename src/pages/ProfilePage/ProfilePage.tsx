import { UserOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Space } from 'antd';
import { PlainLayout } from 'components/layout';
import { Menu } from 'components/shared';
import { MenuProps } from 'components/shared/Menu';
import { COPYRIGHT } from 'constant';
import { useHelmet } from 'hooks';
import { useLocation, useNavigate } from 'react-router-dom';

export interface ProfilePageProps {
  children?: React.ReactNode;
}

const Page: React.FC<ProfilePageProps> = (props) => {
  useHelmet({
    title: 'Orion - Profile'
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (url: string) => navigate(url);

  const menus: (MenuProps & { key: string })[] = [
    {
      key: 'general',
      items: [
        {
          key: '/profile/general',
          children: 'General',
          icon: <UserOutlined />,
          onClick: () => handleNavigate('general')
        },
        {
          key: '/profile/auth',
          children: 'Authentication',
          icon: <UserOutlined />,
          onClick: () => handleNavigate('auth')
        }
      ]
    }
  ];

  return (
    <PlainLayout
      className="bg-inherit"
      headerprops={{
        title: 'Profile'
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
