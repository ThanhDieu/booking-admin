/* eslint-disable @typescript-eslint/no-explicit-any */
import { RoleType } from '@types';
import { Col, Form, FormInstance, FormListFieldData, Select, SelectProps } from 'antd';
import { RoleMode } from 'configs/const/auth';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PropertyType } from 'services/Users/types';

// ĐANG Loi, chưa dùng nên chưa sửa

type FormData = {
  propertiesData: PropertyType[];
  rolesData: RoleType[];
};

interface FormListItemProps {
  form: FormInstance<any>;
  field: FormListFieldData;
  data: FormData;
}

function FormListItem({ form, field, data }: FormListItemProps) {
  const { t } = useTranslation(['common'])
  const { key, name, ...restField } = field;
  const { propertiesData, rolesData } = data;
  const propertiesFieldList = Form.useWatch('properties', form);

  const propertiesOption: SelectProps['options'] = useMemo(() => {
    const options = propertiesData.filter((property) =>
      propertiesFieldList?.every((field: any) => field?.property !== property.code)
    );

    return options.map((option) => ({
      label: option.name,
      value: option.code
    }));
  }, [propertiesFieldList]);

  const rolesOption: SelectProps['options'] = useMemo(() => {
    const hasProperty =
      propertiesFieldList && propertiesFieldList[key]?.roles?.includes(RoleMode.HotelAdmin);

    // TODO authorization user role
    const disabledOption = (itemId: any) => {
      if (propertiesFieldList?.every((field: any) => field?.roles?.length)) {
        return hasProperty ? itemId !== RoleMode.HotelAdmin : itemId === RoleMode.HotelAdmin;
      } else return false;
    };

    return rolesData
      // .filter((item) => item.id !== RoleMode.Admin)
      .map((item) => ({
        label: item.name,
        value: item.id,
        disabled: disabledOption(item.id)
      }));
  }, [propertiesFieldList]);

  return (
    <>
      <Col span={8}>
        <Form.Item
          {...restField}
          name={[name, 'property']}
          rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
          label={t('common:table.property')}
        >
          <Select options={propertiesOption} showSearch />
        </Form.Item>
      </Col>

      {propertiesFieldList && propertiesFieldList[key]?.property ? (
        <Col span={8}>
          <Form.Item
            {...restField}
            name={[name, 'roles']}
            rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
            label={t('common:table.roles')}
          >
            <Select options={rolesOption} mode="multiple" />
          </Form.Item>
        </Col>
      ) : null}
    </>
  );
}

export default FormListItem;
