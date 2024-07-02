/* eslint-disable @typescript-eslint/no-explicit-any */
import { RoleType } from '@types';
import { Button, Form, Input, Modal, Select, SelectProps, Spin, Switch } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import RanderRoleLayout from 'components/layout/RoleLayout';
import ProtectedComponent from 'components/shared/ProtectedComponent';
import { RoleMode, ViewMode } from 'configs/const/auth';
import { FuncType } from 'configs/const/general';
import { languages } from 'constant';
import useView from 'hooks/useView';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPayload, UserType } from 'services/Users/types';
import { useAppSelector } from 'store';
import {
  formatObjectList,
  formatSelectOption,
  formatValueOption,
  revertValueOption
} from 'utils/format';
import { validateMessages } from 'utils/validationForm';

interface Props {
  openModal?: string;
  onChangeModal: () => void;
  roleList?: RoleType[];
  createUser: (payload: UserPayload) => Promise<any>;
  updateUser: (id: string, payload: UserPayload) => Promise<any>;
  loading: boolean;
  userDetail: UserType | undefined;
}
const ModalUpdateUser = ({
  openModal,
  roleList,
  onChangeModal,
  createUser,
  loading,
  userDetail,
  updateUser
}: Props) => {
  const { currentView, currentViewObj } = useView();
  const { t } = useTranslation(['common', 'user']);
  const [form] = useForm();
  const roles = useWatch('roles', form);
  const [reset, setReset] = useState<boolean>(false);
  const { profile } = useAppSelector((state) => state.booking.auth);

  const propertyItemForm = RanderRoleLayout.propertyItemForm(t('common:table.property'));

  const roleOptions: SelectProps['options'] = useMemo(() => {
    const checkRoles = profile?.roles?.[0]?.extendedData?.priority || RoleMode.HotelAdmin;
    const newRoleList =
      roleList?.filter(
        (item) => !item?.name?.includes('/') && checkRoles <= item?.extendedData?.priority
      ) || [];
    return formatSelectOption(newRoleList ?? [], 'name', 'roleId', undefined, undefined, {
      isFormatLabel: true
    });
  }, [roleList, profile?.roles]);

  const onsubmitForm = (formData: UserPayload) => {
    const payload = {
      ...formData,
      roles: formData?.roles ? [revertValueOption(formData?.roles as any)?.value] : [],
      language: formData?.language ? revertValueOption(formData?.language)?.value : ''
    };
    if (formData?.propertyId || currentView !== ViewMode.Account)
      payload.propertyId = formData?.propertyId
        ? revertValueOption(formData?.propertyId)?.value
        : currentView !== ViewMode.Account
          ? currentViewObj?.code
          : '';
    openModal === FuncType.CREATE
      ? createUser(payload)
      : userDetail?.userId && updateUser(userDetail.userId, payload);
  };
  const initialValueForm = {
    username: userDetail?.username ?? '',
    password: userDetail?.password ?? '',
    roles: userDetail?.roles?.[0]
      ? formatValueOption(userDetail?.roles?.[0], 'name', 'roleId')
      : '',
    enabled: userDetail?.enabled,
    name: userDetail?.name ?? '',
    language: userDetail?.language
      ? `${userDetail?.language}@${languages[userDetail?.language as keyof typeof languages]}`
      : '',
    propertyId: userDetail?.property
      ? formatValueOption(userDetail?.property, 'name', 'extId')
      : currentView !== ViewMode.Account
        ? currentView
        : ''
  };

  useEffect(() => {
    if (userDetail) form.setFieldsValue(initialValueForm);
  }, [userDetail]);

  return (
    <Modal
      title={openModal === FuncType.CREATE ? t('user:create_user') : t('user:update_user')}
      open={openModal === FuncType.CREATE || openModal === FuncType.UPDATE}
      onCancel={() => {
        onChangeModal();
        setReset(false);
      }}
      footer={false}
      centered
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          form={form}
          validateMessages={validateMessages}
          onFinish={onsubmitForm}
          initialValues={initialValueForm}
        >
          <Form.Item
            label={t('common:table.name')}
            name="name"
            rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('common:form.user_name')}
            name="username"
            rules={[
              {
                required: true,
                max: 64,
                whitespace: true,
                message: t('common:form.please_enter_this_field')
              },
              { pattern: /^[A-Za-z0-9.,#)(_-]*$/ }
            ]}
          >
            {/* <span className="!text-[red]"> */}
            <Input disabled={openModal === FuncType.UPDATE} />
            {/* </span> */}
          </Form.Item>
          <Form.Item
            label={t('common:table.roles')}
            name="roles"
            rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
          >
            <Select options={roleOptions} />
          </Form.Item>
          <ProtectedComponent
            renderIfTrue={() =>
              currentView === ViewMode.Account &&
              !roleOptions?.some(
                (role) =>
                  role?.extendedData?.priority <= 2 && (role?.value as string)?.includes(roles)
              )
            }
          >
            {propertyItemForm}
          </ProtectedComponent>
          <Form.Item>
            <Form.Item
              rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
              label={t('common:form.language')}
              name="language"
            >
              <Select options={formatObjectList(languages, '@')} showSearch />
            </Form.Item>
          </Form.Item>
          {openModal === FuncType.UPDATE && (
            <Form.Item label={t('common:button.enable')} name="enabled" valuePropName="checked">
              <Switch
                checkedChildren={t('common:button.yes').toUpperCase()}
                unCheckedChildren={t('common:button.no').toUpperCase()}
              />
            </Form.Item>
          )}

          {(openModal === FuncType.CREATE || reset) && (
            <Form.Item
              label={!reset ? t('common:form.password') : t('user:new_password')}
              name="password"
              help={t('user:valid_pass')}
              rules={[
                { required: true, message: t('common:form.please_enter_this_field') },
                {
                  pattern: /^.{6,}$/
                }
              ]}
            >
              <Input />
            </Form.Item>
          )}
          {openModal === FuncType.UPDATE && (
            <Button
              className="-ml-4 my-3"
              type="link"
              onClick={() => {
                setReset((prevState) => !prevState);
                form.resetFields(['password']);
              }}
            >
              {!reset ? t('user:reset_pass') : t('user:undo_password')}
            </Button>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="mr-3 mt-3">
              {t('common:button.save')}
            </Button>
            <Button
              onClick={() => {
                onChangeModal();
              }}
            >
              {t('common:button.close')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalUpdateUser;
