/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Form, Row, Select, Typography } from 'antd';
import { guaranteeOptions } from 'configs/const/options';
import React from 'react';

const cancelationOptions = [
  { label: 'Flexible', value: 'Flexible' },
  { label: 'Non Refundable', value: 'Non Refundable' },
  { label: 'Strict', value: 'Strict' }
];
const noShowOptions = [
  { label: 'None', value: 'None' },
  { label: 'Non Refundable', value: 'Non Refundable' }
];

const PolicySection = () => {
  return (
    <Card style={{ width: 1200 }}>
      <Typography.Title level={4}>Policies</Typography.Title>
      <Row className="gap-8">
        <Col className="flex-1">
          <Form.Item
            label="Cancelation policy"
            name="cancelationPolicy"
            rules={[{ required: true }]}
          >
            <Select options={cancelationOptions} />
          </Form.Item>
        </Col>
        <Col className="flex-1">
          <Form.Item label="No-show policy" name="noshowPolicy">
            <Select options={noShowOptions} />
          </Form.Item>
        </Col>
        <Col className="flex-1">
          <Form.Item label="Minimum guarantee" name="minimumGuarantee" rules={[{ required: true }]}>
            <Select options={guaranteeOptions} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default PolicySection;
