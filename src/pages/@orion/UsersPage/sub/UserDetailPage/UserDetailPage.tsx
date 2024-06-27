/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MailOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { AddressType, RoleType } from '@types';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  FormListFieldData,
  Input,
  Row,
  Select,
  SelectProps,
  Space,
  Switch,
  Typography
} from 'antd';
import { PlainLayout } from 'components/layout';
import { ViewMode } from 'configs/const/auth';
import { useAsyncAction, useDataDisplay, useDetailDisplay, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { propertyListService } from 'services/Properties';
import {
  getAllLocationService,
  getAllRoleService,
  getUserByIdService,
  updateUserService
} from 'services/Users';
import { PropertyType, UserPayload, UserType } from 'services/Users/types';
import FormListItem from './partials/FormListItem';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
export interface UserDetailPageProps { }

function UserDetailPage() {
  // const { t } = useTranslation(['common', 'user'])
  // const userId = useParams().id;
  // const { currentView } = useView();

  // const [fetchUser, stateUser, setStateUser] = useAsyncAction(getUserByIdService);
  // const [fetchRoles, stateRoles] = useAsyncAction(getAllRoleService);
  // const [fetchLocations, stateLocations] = useAsyncAction(getAllLocationService);
  // const [fetchProperties, stateProperties] = useAsyncAction(propertyListService);

  // const [updateUser] = useAsyncAction(updateUserService, {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   onSuccess(res: any) {
  //     setStateUser(stateUser, res.data.data, 'update', 'id');
  //   }
  // });

  // const user: UserType = useDetailDisplay(stateUser);
  // const rolesData: RoleType[] = useDataDisplay(stateRoles);
  // const locationsData: AddressType[] = useDataDisplay(stateLocations);
  // const propertiesData: PropertyType[] = useDataDisplay(stateProperties);

  // const [form] = Form.useForm();

  // const initialValue = {
  //   name: '',
  //   username: '',
  //   email: '',
  //   location: '',
  //   is_admin: false,
  //   properties: []
  // };

  // const locationsOption: SelectProps['options'] = locationsData.map((location) => ({
  //   label: `${location?.addressLine1} ${location?.addressLine2}`,
  //   value: `${location?.addressLine1} ${location?.addressLine2}`
  // }));

  // const handleUpdateUser = (formData: UserPayload) => {
  //   updateUser(user.id, formData);
  // };

  // useDidMount(() => {
  //   userId && fetchUser(userId);
  //   fetchRoles();
  //   fetchLocations();
  //   fetchProperties();
  // });

  // const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // useEffect(() => {
  //   if (user) {
  //     user.is_admin && setIsAdmin(user.is_admin);

  //     form.setFieldsValue({
  //       id: user.id,
  //       name: user.name,
  //       username: user.username,
  //       email: user.email,
  //       location: `${user.location?.addressLine1} ${user?.location?.addressLine2}`,
  //       is_admin: user?.is_admin,
  //       properties: user.properties?.map((item) => ({
  //         property: item.property.code,
  //         roles: item.roles.map((role) => role.id)
  //       }))
  //     });
  //   }
  // }, [user]);

  // useHelmet({
  //   title: `${t('user:user')} - ${user?.name}`
  // });

  return (
    <PlainLayout
    // headerprops={{
    //   title: t('user:edit_user')
    //   // onBack: () => navigate(`/${paths.account}/${paths.users}`, { replace: true }),
    // }}
    // className={`bg-inherit`}
    >
      {/* <div className="flex flex-col gap-1 mb-4">
        <Title style={{ margin: 0 }}>{user?.name}</Title>
        <Text type="secondary">
          <MailOutlined className="mr-2" />
          {user?.email}
        </Text>
      </div>

      <Card>
        <Form
          name="user-detail-form"
          layout="vertical"
          form={form}
          onFinish={handleUpdateUser}
          initialValues={initialValue}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item
                name='name'
                label={t('common:table.name')}
                rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
              >
                <Input value={user?.name} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="username"
                label={t('common:form.user_name')}
                rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
              >
                <Input value={user?.username} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="email"
                label={t('common:form.email')}
                rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
              >
                <Input value={user?.email} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="location"
                rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
                label={t('common:form.location')}
              >
                <Select options={locationsOption} showSearch />
              </Form.Item>
            </Col>

            {currentView === ViewMode.Account ? (
              <>
                <Col span={8}>
                  <Form.Item name="is_admin" label={t('user:is_admin')} valuePropName="checked">
                    <Switch
                      onChange={(value: boolean) => {
                        setIsAdmin(!isAdmin);
                        if (!value && user.is_admin) {
                          form.setFieldValue('properties', [
                            {
                              property: ''
                            }
                          ]);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}></Col>
              </>
            ) : null}

            {!isAdmin ? (
              <Form.List name={'properties'}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field: FormListFieldData) => (
                      <div className="w-full flex" key={field.key}>
                        <FormListItem
                          form={form}
                          field={field}
                          data={{ propertiesData: [...propertiesData], rolesData: [...rolesData] }}
                        />

                        {fields.length > 1 ? (
                          <Col span={8}>
                            <MinusCircleOutlined
                              className="absolute left-0 top-1/2 -translate-y-1/2"
                              onClick={() => remove(field.name)}
                            />
                          </Col>
                        ) : null}
                      </div>
                    ))}
                    <div className="w-full">
                      <Col span={8}>
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            {t('user:add_field')}
                          </Button>
                        </Form.Item>
                      </Col>
                    </div>
                  </>
                )}
              </Form.List>
            ) : (
              <Col span={8}>
                <Form.Item>
                  <Alert
                    message={t("user:message_alert")}
                    type="info"
                    showIcon
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common:button.submit')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card> */}
    </PlainLayout>
  );
}

export default UserDetailPage;
