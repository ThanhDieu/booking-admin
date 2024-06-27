import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { isRequired } from 'utils/array';

interface Props {
  required?: string[];
}

const Month_Array = Array.from({ length: 12 }, (_, index) => {
  return {
    label: index < 9 ? `0${index + 1}` : index + 1,
    value: index + 1
  };
});

const Year_Array = Array.from({ length: 20 }, (_, index) => {
  const year = new Date().getFullYear() + index;
  return {
    label: year,
    value: year
  };
});

const IndexComponent: React.FC<Props> = ({ required }) => {
  const { t } = useTranslation(['payment']);
  return (
    <Row gutter={24}>
      <Col span={24}>
        <Form.Item
          label={t('payment:card_holder_name')}
          name="accountHolder"
          rules={[{ required: isRequired('accountHolder', required) }]}
        >
          <Input disabled />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label={t('payment:card_number')}
          name="accountNumber"
          rules={[{ required: isRequired('accountNumber', required) }]}
        >
          <InputNumber className="w-full" disabled />
        </Form.Item>
      </Col>

      <Col span={8}>
        <Form.Item
          label={t('payment:expiry_month')}
          name="expiryMonth"
          rules={[{ required: isRequired('expiryMonth', required) }]}
        >
          <Select options={Month_Array} showSearch placeholder="Select month" disabled />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label={t('payment:expiry_year')}
          name="expiryYear"
          rules={[{ required: isRequired('expiryYear', required) }]}
        >
          <Select options={Year_Array} showSearch placeholder="Select year" disabled />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item label="CVV" name="cvv" rules={[{ required: isRequired('cvv') }]}>
          <Input disabled />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          label={t('payment:payer_email')}
          name="payerEmail"
          rules={[{ required: isRequired('payerEmail', required) }]}
        >
          <Input disabled />
        </Form.Item>
      </Col>
    </Row>
  );
};
export default IndexComponent;
