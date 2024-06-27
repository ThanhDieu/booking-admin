import { Button, Form, FormInstance, Input, Space, Typography } from 'antd';
import { ProfileSection } from 'pages/ProfilePage/partials';

const { Text } = Typography;

export interface AuthProfilePageProps {}

const Page: React.FC<AuthProfilePageProps> = () => {
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: {
      span: 19
    }
  };

  const handleChangePassword = (form: FormInstance) => {
    form.validateFields().then(() => {
      const { your_password, new_password } = form.getFieldsValue();
      const payload = { password: your_password, new_password: new_password };
      console.log(payload);
    });
  };

  return (
    <Space direction="vertical" className="w-full">
      <ProfileSection title="Account" className="w-full mb-8">
        <Space direction="horizontal" className="w-full justify-between">
          <Text>Control your accounts password</Text>
          <Button
            onClick={() => {
              handleChangePassword && handleChangePassword(form);
            }}
          >
            Confirm
          </Button>
        </Space>
      </ProfileSection>
      <Form form={form} {...formItemLayout}>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please enter password!'
            }
          ]}
          label="Your Password"
          name="your_password"
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="new_password"
          rules={[
            {
              required: true,
              message: 'Please enter new password!'
            }
          ]}
          hasFeedback
        >
          <Input.Password placeholder="New password" />
        </Form.Item>
        <Form.Item
          label="Confirm new Password"
          name="confirm_password"
          dependencies={['new_password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('new_password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              }
            })
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>
      </Form>
    </Space>
  );
};

export default Page;
