import { Col, Form, Input, Row, Typography } from 'antd';
import { GeneralFormComponent } from 'components/common';
import { FuncType } from 'configs/const/general';
import { PropertyGeneralSectionProps } from '../index.types';
import { useTranslation } from 'react-i18next';

const PropertyGeneralSection = ({ mode }: PropertyGeneralSectionProps) => {
  const { t } = useTranslation(['common', 'properties'])
  return (
    <>
      <Typography.Title level={4}>{t('common:general.general')}</Typography.Title>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item
            label={t("properties:property_code")}
            name="code"
            rules={[{ required: true, max: 10 }, { pattern: /^[A-Za-z0-9_-]*$/ }]}
          >
            <Input disabled={mode === FuncType.UPDATE} />
          </Form.Item>
        </Col>
      </Row>
      <GeneralFormComponent
        span={24}
        status={mode === FuncType.UPDATE ? ['name', 'description'] : []}
      />
    </>
  );
};
export default PropertyGeneralSection;
