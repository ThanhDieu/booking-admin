import { Card, Col, DatePicker, Form, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const UnavailableBookingOnlineSection = () => {
  const { t } = useTranslation(['common', 'properties'])
  return (
    <Card size="small">
      <Typography.Title level={4}>{t('properties:unavailable_booking_online')}</Typography.Title>

      <Row className="gap-8">
        <Col span={12}>
          <Form.Item label={t('properties:date_range')} name="unavailableBookingOnline">
            <DatePicker.RangePicker
              className="w-full"
              format={'MM/DD/YYYY'}
              presets={[
                { label: `${t('common:general.next')} 7 Days`, value: [dayjs().add(1, 'd'), dayjs().add(7, 'd')] },
                { label: `${t('common:general.next')} 14 Days`, value: [dayjs().add(1, 'd'), dayjs().add(14, 'd')] },
                { label: `${t('common:general.next')} 30 Days`, value: [dayjs().add(1, 'd'), dayjs().add(30, 'd')] },
                { label: `${t('common:general.next')} 90 Days`, value: [dayjs().add(1, 'd'), dayjs().add(90, 'd')] }
              ]}
              disabledDate={(current) => current && current < dayjs().endOf('date')}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default UnavailableBookingOnlineSection;
