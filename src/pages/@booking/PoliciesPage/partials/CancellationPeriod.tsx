import { Col, Form, InputNumber, Row, Select, Typography } from 'antd';
import { periodReferenceOption } from 'configs/const/select';
import { useTranslation } from 'react-i18next';

const CancellationPeriod = () => {
  const { t } = useTranslation(['common', 'policies'])
  return (
    <Col span={24}>
      <Row gutter={24}>
        <Col span={24}>
          <Typography.Title
            level={3}
            className="inline-block"
            style={{ marginBottom: 8, fontWeight: 500 }}
          >
            {t('policies:cancellation_period')}
          </Typography.Title>
        </Col>
        <Col span={2}>
          <Form.Item label={t('policies:months')} name="months">
            <InputNumber disabled className='w-full' />
          </Form.Item>
        </Col>
        <Col span={2}>
          <Form.Item label={t('policies:days')} name="days">
            <InputNumber disabled className='w-full' />
          </Form.Item>
        </Col>
        <Col span={2}>
          <Form.Item label={t('policies:hours')} name="hours">
            <InputNumber disabled className='w-full' />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={t('policies:reference')}
            name="reference"
            rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
          >
            <Select options={periodReferenceOption} disabled />
          </Form.Item>
        </Col>
      </Row>
    </Col>
  );
};

export default CancellationPeriod;
