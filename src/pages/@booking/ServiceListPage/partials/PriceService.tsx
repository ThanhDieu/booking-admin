import { Col, Form, InputNumber, Row, Select, Typography } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useTranslation } from 'react-i18next';
import { isRequired } from 'utils/array';

const { Title } = Typography;

interface PriceServiceProp {
  serviceUnitOptions?: DefaultOptionType[];
  vatOptions?: DefaultOptionType[];
  selectPriceOptionAfter?: JSX.Element;
  status: string[];
}

const PriceService = ({
  serviceUnitOptions,
  vatOptions,
  selectPriceOptionAfter,
  status
}: PriceServiceProp) => {
  const { t } = useTranslation(['common', 'services'])

  return (
    <Col span={24}>
      <Row gutter={24}>
        <Col span={24}>
          <Title level={4}>{t('common:table.price')}</Title>
        </Col>
        <Col span={8}>
          <Form.Item label={t('services:service_unit')} name="pricing_unit" rules={[{ required: true }]}>
            <Select options={serviceUnitOptions} disabled={isRequired('pricing_unit', status)} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('common:table.price')} name="amount" rules={[{ required: true }]}>
            <InputNumber
              addonAfter={selectPriceOptionAfter}
              className="w-full"
              disabled={isRequired('amount', status)}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={t('services:vat')} name="vat_type" rules={[{ required: true }]}>
            <Select options={vatOptions} disabled={isRequired('vat_type', status)} />
          </Form.Item>
        </Col>
      </Row>
    </Col>
  );
};

export default PriceService;
