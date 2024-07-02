import React from 'react';
import { Typography, Card, Space, Col, Form, Row, Select } from 'antd';
import { calculationModeOptions } from 'configs/const/options';

const CalculationModeSection = () => {
  return (
    <Card style={{ width: 1200 }}>
      <Space size="middle" direction="vertical">
        <Space size="small" direction="vertical">
          <Typography.Title level={4}>Price calculation mode</Typography.Title>
          <Typography.Text>
            The calculation mode is used when calculating the adult&apos; s surcharges and derived
            rates. Example: for a rate of 125.99 and a surcharge of +10%, when Truncate is selected,
            the result would be 125.99 + 12 = 137.99. When Round is selected, the result would be
            125.99 + 12.60 = 138.59.
          </Typography.Text>
        </Space>
        <Row className="gap-8">
          <Col className="flex-1">
            <Form.Item
              label="Price calculation mode"
              name="calculationMode"
              rules={[{ required: true }]}
            >
              <Select options={calculationModeOptions} />
            </Form.Item>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default CalculationModeSection;
