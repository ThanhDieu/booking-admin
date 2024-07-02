/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, DatePicker, Form, Row, Typography } from 'antd';
import { TagFormItemComponent } from 'components/common';
import { tagType } from 'configs/const/general';
import useView from 'hooks/useView';
import { useTranslation } from 'react-i18next';
import { isRequired } from 'utils/array';

const { Title } = Typography;

interface Props {
  status?: string[];
  dataDetail?: any;
}

const AccountConfig = ({ status, dataDetail }: Props) => {
  const { currentViewObj } = useView();
  const { t } = useTranslation(['services'])
  return (
    <Col span={24}>
      <Row gutter={24}>
        <Col span={24}>
          <Title level={4}>{t('services:account_configuration')}</Title>
        </Col>
        <Col span={8}>
          <Form.Item label={t('services:effective_period_from')} name="valid_from">
            <DatePicker
              className="w-full"
              format="MM-DD-YYYY"
              disabled={isRequired('valid_from', status)}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <TagFormItemComponent
            initialTags={dataDetail?.tags ?? []}
            item={{
              isRequired: false,
              label: t('services:service_tags'),
              name: 'tagIds',
              disabled: isRequired('tagIds', status)
            }}
            tagType={tagType.SERVICE}
            propertyCode={currentViewObj?.code || ''}
          />
        </Col>
      </Row>
    </Col>
  );
};

export default AccountConfig;
