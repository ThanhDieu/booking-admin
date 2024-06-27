import { Card, Col, Form, Input, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { isRequired } from 'utils/array';
import { formatObjectList } from 'utils/format';

interface Props {
  countries: {
    [key: string]: string;
  };
  required?: string[];
  status?: string[];
}
const IndexComponent: React.FC<Props> = ({ required, countries, status }) => {
  const { t } = useTranslation(['common']);
  return (
    <Card>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            label={t('common:form.address_line_1')}
            name="addressLine1"
            rules={[{ required: isRequired('addressLine1', required) }]}
          >
            <Input disabled={isRequired('addressLine1', status)} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={t('common:form.address_line_2')}
            name="addressLine2"
            rules={[{ required: isRequired('addressLine2', required) }]}
          >
            <Input disabled={isRequired('addressLine2', status)} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('common:form.postal_code')}
            name="postalCode"
            rules={[{ required: isRequired('postalCode', required) }]}
          >
            <Input disabled={isRequired('postalCode', status)} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('common:form.city')}
            name="city"
            rules={[{ required: isRequired('city', required) }]}
          >
            <Input disabled={isRequired('city', status)} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('common:form.country')}
            name="countryCode"
            rules={[{ required: isRequired('countryCode', required) }]}
          >
            <Select
              options={formatObjectList(countries, '@')}
              showSearch
              placeholder="Select country"
              disabled={isRequired('countryCode', status)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
export default IndexComponent;
