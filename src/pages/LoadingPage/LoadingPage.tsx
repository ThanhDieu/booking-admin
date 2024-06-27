import { Spin, Layout, theme } from 'antd';
const { useToken } = theme;
const { Content } = Layout;

const LoadingPage = () => {
  const { token } = useToken();
  return (
    <Layout
      style={{ backgroundColor: `${token.colorText}10` }}
      className="p-6 pb-0 flex w-full h-screen items-center justify-center"
    >
      <Content className="flex items-center justify-center">
        <Spin size="large" />
      </Content>
    </Layout>
  );
};

export default LoadingPage;
