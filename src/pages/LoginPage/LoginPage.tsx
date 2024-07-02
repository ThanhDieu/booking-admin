/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Divider, Form, Input, Layout, Space, Typography } from 'antd';
import logo from 'assets/images/logo-sonnenhotels.png';
import XIcon from 'components/shared/Icon';
import { paths } from 'constant';
import { useAsyncAction, useHelmet } from 'hooks';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { loginService } from 'services/Auth';
import { LoginPayload } from 'services/Auth/types';
import { useAppDispatch } from 'store';
import { initialUserSessionAction } from 'store/booking/Auth';
import { saveAccessToken, saveRefreshToken } from 'utils/storage';
import { capitalize } from 'utils/text';
import { validateMessages } from 'utils/validationForm';


const { Content } = Layout;
const { Text } = Typography;

function DefaultLoginForm() {
  const { i18n, t } = useTranslation(['common', 'sidebar']);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const [login] = useAsyncAction(loginService, {
    onSuccess: ({ data }) => {
      const convertData = data.data[0];
      saveAccessToken(convertData.token);
      saveRefreshToken(convertData?.refreshToken);

      dispatch(initialUserSessionAction(convertData)).then((data) => {
        const userLang = data.payload[0].language;
        const customUserLang = userLang === 'de' || userLang === 'en' ? userLang : 'en';
        i18n.changeLanguage(customUserLang);
        localStorage.removeItem('i18nextLng');
        localStorage.setItem('i18nextLng', customUserLang);
      }).catch(() => null);
      navigate(paths.default);
    },
    onFailed: (error: any) => {
      if (error) message.error(capitalize(error?.message), 2);
    }
  });

  const handleLogin = (formData: LoginPayload) => {
    login(formData);
  };

  return (
    <Form
      layout="vertical"
      name="normal_login"
      className="login-form"
      onFinish={handleLogin}
      validateMessages={validateMessages}
    >
      <Form.Item
        label={<label style={{ color: '#0E1013' }}>{t('common:form.user_name')}</label>}
        // label={t('common:form.user_name')}
        name="username"
        rules={[
          {
            required: true
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<label style={{ color: '#0E1013' }}>{t('common:form.password')}</label>}
        // label={t('common:form.password')}
        name="password"
        rules={[
          {
            required: true
          }
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-butto w-full">
          <div className="flex items-center justify-center gap-2">
            {t('sidebar:user_box.logIn')}
            <XIcon name="arrowRight" />
          </div>
        </Button>
      </Form.Item>
    </Form>
  );
}

export interface LoginPageProps { }

const Page: React.FC<LoginPageProps> = () => {
  useHelmet({
    title: `Login Page`
  });

  return (
    <Layout className="flex items-center h-screen w-full justify-center ">
      <Content className="flex items-center">
        <Space direction="vertical" className="bg-[white] p-8 rounded-md">
          <div className="logo text-center w-[320px]">
            <img src={logo} alt="avatar" style={{ width: '100%' }} />
          </div>
          <Divider className="my-0">
            <Text type="secondary" className="text-center" style={{ color: '#0E1013' }}>
              The greatest hotel management platform in the world
            </Text>
          </Divider>
          <DefaultLoginForm />
        </Space>
      </Content>
    </Layout>
  );
};

export default Page;
