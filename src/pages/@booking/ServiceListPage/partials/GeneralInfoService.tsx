import { Col, Form, Input, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useTranslation } from 'react-i18next';

interface GeneralInfoServiceProp {
  serviceTypesOption: DefaultOptionType[];
}

const GeneralInfoService = ({ serviceTypesOption }: GeneralInfoServiceProp) => {
  const { t } = useTranslation(['common', 'services'])
  return (
    <>
      <Col span={8}>
        <Form.Item
          label={t("common:table.code")}
          name="code"
          rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label={t("common:table.name")}
          name="name"
          rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label={t("services:service_type")}
          name="service_type"
          rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
        >
          <Select options={serviceTypesOption} />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label={t("common:table.description")}
          name="description"
          rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
        >
          <Input.TextArea maxLength={100} style={{ height: 100 }} />
        </Form.Item>
      </Col>
      <Col span={16}></Col>
    </>
  );
};

export default GeneralInfoService;
