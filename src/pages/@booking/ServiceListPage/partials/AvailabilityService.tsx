import { Col, Form, Row, Select, Typography } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useTranslation } from 'react-i18next';
import { isRequired } from 'utils/array';

const { Title } = Typography;

interface AvailabilityServiceProp {
  modeOption?: DefaultOptionType[];
  bundleDayOption?: DefaultOptionType[];
  status: string[];
}

const AvailabilityService = ({ modeOption, bundleDayOption, status }: AvailabilityServiceProp) => {
  const { t } = useTranslation(['common', 'services'])
  return (
    <Col span={24}>
      <Row gutter={24}>
        <Col span={24}>
          <Title level={4}>Availability</Title>
        </Col>
        <Col span={4}>
          <Form.Item label={t('common:table.when')} name="mode" rules={[{ required: true }]}>
            <Select options={modeOption} disabled={isRequired('mode', status)} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label={t('services:bundle_days')} name="day_of_week" rules={[{ required: true }]}>
            <Select
              options={bundleDayOption}
              mode="multiple"
              placeholder={t('services:placeholder_bundle_days')}
              allowClear
              disabled={isRequired('day_of_week', status)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Col>
  );
};

export default AvailabilityService;
