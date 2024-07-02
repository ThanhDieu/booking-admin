import React, { useState } from 'react';
import { Typography, Card, Space, Switch, Col, Form, Row, InputNumber } from 'antd';

const DistributionSection = () => {
  const [openDistribute, setOpenDistribute] = useState<{
    minimum: boolean;
    maximum: boolean;
    lateBooking: boolean;
  }>({
    minimum: true,
    maximum: true,
    lateBooking: false
  });
  const onChangeMinimum = () => {
    setOpenDistribute({
      ...openDistribute,
      minimum: !openDistribute.minimum
    });
  };
  const onChangeMaximum = () => {
    setOpenDistribute({
      ...openDistribute,
      maximum: !openDistribute.maximum
    });
  };

  return (
    <Card style={{ width: 1200 }}>
      <Space size="large" direction="vertical">
        <Space size="small" direction="vertical">
          <Typography.Title level={4}>Distribution</Typography.Title>
          <Typography.Text>
            Minimum and maximum advanced booking let you specify, when this rate plan can be booked.
            Use this to model early-booking or last-minute discounted rates, or as a general
            restriction. With the late booking until time you can restrict until when you want to
            receive bookings on the day of arrival. The specified time has to be between the
            check-in and check-out times of the time slice definition for the rate plan. You can
            either specify the min. advance restriction, or the late booking time restriction. Not
            both.
          </Typography.Text>
        </Space>
        <Space size="middle" direction="vertical">
          <Space size="small">
            <Switch defaultChecked={openDistribute.minimum} onChange={onChangeMinimum} />
            <Typography.Text>Minimum advanced booking</Typography.Text>
          </Space>
          {openDistribute.minimum && (
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="Moths" name="monthMinimum">
                  <InputNumber className="w-[250px]" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Days" name="daysMinimum">
                  <InputNumber className="w-[250px]" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Hours" name="hourMinimum">
                  <InputNumber className="w-[250px]" />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Space>
        <Space size="middle" direction="vertical">
          <Space size="small">
            <Switch defaultChecked={openDistribute.minimum} onChange={onChangeMaximum} />
            <Typography.Text>Maximum advanced booking</Typography.Text>
          </Space>
          {openDistribute.maximum && (
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label="Moths" name="monthMaximum">
                  <InputNumber className="w-[250px]" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Days" name="daysMaximum">
                  <InputNumber className="w-[250px]" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Hours" name="hourMaximum">
                  <InputNumber className="w-[250px]" />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Space>
        <Space size="small">
          <Switch checked={false} />
          <Typography.Text>Late booking until</Typography.Text>
        </Space>
      </Space>
    </Card>
  );
};

export default DistributionSection;
