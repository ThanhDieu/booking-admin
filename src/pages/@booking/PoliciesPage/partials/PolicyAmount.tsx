import { Col, Form, Input, InputNumber, Row, Select, Switch, Typography } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { vatOptions } from 'configs/const/select';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CancellationPolicyAppType, NoShowPolicyAppType } from 'services/Policies/type';

interface Props {
  dataDetail: CancellationPolicyAppType | NoShowPolicyAppType;
  serviceOptions: DefaultOptionType[] | undefined;
}
const PolicyAmount = ({ dataDetail, serviceOptions }: Props) => {
  const { t } = useTranslation(['common', 'policies'])
  const [fixedFee, setFixedFee] = useState<boolean>(false);
  const [percentFee, setPercentFee] = useState<boolean>(false);

  useEffect(() => {
    dataDetail?.data?.fee?.fixedValue && setFixedFee(true);
    dataDetail?.data?.fee?.percentValue && setPercentFee(true);
  }, [dataDetail]);

  return (
    <div>
      <Col span={24}>
        <Row gutter={24}>
          <Col span={24}>
            <Typography.Title
              level={3}
              className="inline-block"
              style={{ marginBottom: 8, fontWeight: 500 }}
            >
              {t('common:table.amount')}
            </Typography.Title>
          </Col>
          <Col span={6}>
            <div className="flex items-center gap-2 mb-2">
              <Switch
                disabled
                size="small"
                checked={fixedFee}
                onChange={() => {
                  setFixedFee(!fixedFee);
                }}
              />
              <span>Fixed fee</span>
            </div>
            {fixedFee ? (
              <Form.Item
                label={t('common:table.amount')}
                name="amount"
                rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
              >
                <InputNumber disabled />
              </Form.Item>
            ) : null}
          </Col>
          <Col span={18}></Col>
          <Col span={24}>
            <div className="flex items-center gap-2 mb-2">
              <Switch
                disabled
                size="small"
                checked={percentFee}
                onChange={() => {
                  setPercentFee(!percentFee);
                }}
              />
              <span>{t('policies:percent_fee')}</span>
            </div>
            {percentFee ? (
              <Row gutter={24}>
                <Col span={2}>
                  <Form.Item
                    label={t('policies:percent')}
                    name="percent"
                    rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
                  >
                    <InputNumber disabled className='w-full' />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label={t('policies:include_services')} name="includeServiceIds">
                    <Select options={serviceOptions} mode="multiple" disabled />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label={t('policies:limit_to')}
                    name="limit"
                    rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
                  >
                    <Input addonAfter={t('common:general.nights')} disabled />
                  </Form.Item>
                </Col>
              </Row>
            ) : null}
          </Col>
          <Col span={6}>
            <Form.Item label={t('policies:vat')} name="vatType" rules={[{ required: true }]}>
              <Select options={vatOptions} disabled />
            </Form.Item>
          </Col>
        </Row>
      </Col>
    </div>
  );
};

export default PolicyAmount;
