import { Card, Col, Form, Input, Row, Typography } from 'antd';
import React from 'react';

const TimeSliceSection = () => {
  return (
    <Card style={{ width: 1200 }}>
      <Typography.Title level={4}>Unit group and time slices</Typography.Title>
      <Row className="gap-8">
        <Col className="flex-1">
          <Form.Item label="Unit group" name="unitGroup">
            <Input disabled />
          </Form.Item>
        </Col>
        <Col className="flex-1">
          <Form.Item label="Time slice definition" name="timeSliceDefinition">
            <Input disabled />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default TimeSliceSection;
