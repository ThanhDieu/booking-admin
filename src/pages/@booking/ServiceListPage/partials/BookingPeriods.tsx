/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, DatePicker, Form, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
const { RangePicker } = DatePicker;

const BookingPeriods = () => {
  const { t } = useTranslation(['services'])
  return (
    <Card style={{ width: 1200 }}>
      <Space size="middle" direction="vertical">
        <Space size="small" direction="vertical">
          <Typography.Title level={4}>{t('services:booking_period')}</Typography.Title>
          <Typography.Text>
            {t('services:booking_period_desc')}
          </Typography.Text>
        </Space>
        <Form.Item label={t('services:booking_channels')} name="bookingPeriods" rules={[{ required: true }]}>
          <RangePicker />
        </Form.Item>
      </Space>
    </Card>
  );
};

export default BookingPeriods;
