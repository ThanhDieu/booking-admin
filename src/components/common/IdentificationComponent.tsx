import { Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { identificationOptions } from 'configs/const/options';
import { countries } from 'constant';
import { useTranslation } from 'react-i18next';
import { isRequired } from 'utils/array';
import { formatObjectList } from 'utils/format';

interface Props {
  required?: string[];
}
const IndexComponent: React.FC<Props> = ({ required }) => {
  const { t } = useTranslation(['common']);

  return (
    <Card>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            label={t('common:form.nationality')}
            name="nationalityCountryCode"
            rules={[{ required: isRequired('nationalityCountryCode', required) }]}
          >
            <Select
              options={formatObjectList(countries, '@')}
              showSearch
              placeholder="Select nationality (country)"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('common:form.place_of_birth')}
            name="birthPlace"
            rules={[{ required: isRequired('birthPlace', required) }]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            label={t('common:form.identification_type')}
            name="identificationType"
            rules={[{ required: isRequired('identificationType', required) }]}
          >
            <Select
              options={identificationOptions}
              showSearch
              placeholder="Select identification type"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('common:form.identification_number')}
            name="identificationNumber"
            rules={[{ required: isRequired('identificationNumber', required) }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={t('common:form.issued_on')}
            name="identificationIssueDate"
            rules={[{ required: isRequired('identificationIssueDate', required) }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};
export default IndexComponent;
