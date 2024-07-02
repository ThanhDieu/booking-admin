import React from 'react';
import { Card, Col, Form, Row, Select, Space, Typography } from 'antd';
import { bookingChannelOptions } from 'configs/const/options';

const BookingChannels = () => {
  return (
    <Card style={{ width: 1200 }}>
      <Space size="middle" direction="vertical">
        <Space size="small" direction="vertical">
          <Typography.Title level={4}>Booking channels</Typography.Title>
          <Typography.Text>
            Set booking periods to define when this rate plan is open for sale. Outside of the
            defined booking periods, this rate plan will not be visible to bookers.
          </Typography.Text>
        </Space>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="Booking channels" name="bookingChannels" rules={[{ required: true }]}>
              <Select options={bookingChannelOptions} mode="multiple" showSearch allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default BookingChannels;
