import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Typography, Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';

const ServicesSection = () => {
  const { t } = useTranslation(['reservation']);
  return (
    <Card style={{ width: 1200 }}>
      <Space size="middle" direction="vertical">
        <div>
          <Typography.Title level={4}>{t('reservation:service')}</Typography.Title>
          <Typography.Text>
            Specify the services that are sold with this rate plan. You can overwrite the standard
            prices and decide whether the price is included in the rate or is added to the rate.
          </Typography.Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} className="inlin inline-block">
          {t('reservation:add_service')}
        </Button>
      </Space>
    </Card>
  );
};

export default ServicesSection;
