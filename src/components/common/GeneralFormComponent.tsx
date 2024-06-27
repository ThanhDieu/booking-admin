import { Card, Col, Form, Input, Row } from 'antd';
import { FuncType } from 'configs/const/general';
import { useTranslation } from 'react-i18next';
import { isRequired } from 'utils/array';
import { capitalize } from 'utils/text';

const { TextArea } = Input;
interface Props {
  title?: string;
  typeEvent?: string;
  status?: string[];
  span?: number;
}

const GeneralFormComponent: React.FC<Props> = ({ title, typeEvent, status = [], span = 14 }) => {
  const { t } = useTranslation(['common'])
  const renderFromItem = () => {
    return (
      <>
        <Form.Item
          label={title ? capitalize(title) : t('common:table.name')}
          name={title || 'name'}
          rules={[
            { required: true, max: 254, whitespace: true },
            { pattern: /^[A-Za-z0-9.,#)(_ -]*$/ }
          ]}
        >
          <Input disabled={status?.length > 0 && isRequired('name', status)} />
        </Form.Item>
        <Form.Item
          label={t('common:table.description')}
          name="description"
          // rules={[{ required: true }]}
          className="mb-0"
        >
          <TextArea
            rows={4}
            autoSize
            disabled={status?.length > 0 && isRequired('description', status)}
          />
        </Form.Item>
      </>
    );
  };
  if (typeEvent === FuncType.CREATE) return renderFromItem();
  return (
    <Row gutter={[24, 24]}>
      <Col span={span} className="mb-3">
        <Card title="">{renderFromItem()}</Card>
      </Col>
    </Row>
  );
};
export default GeneralFormComponent;
