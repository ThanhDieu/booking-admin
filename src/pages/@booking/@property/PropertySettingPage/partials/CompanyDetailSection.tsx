import { Card, Col, Form, Input, Row, Typography } from 'antd';
import { PropertyGeneralSectionProps } from '../index.types';
import { FuncType } from 'configs/const/general';
import { useTranslation } from 'react-i18next';

const CompanyDetailSection = ({ mode }: PropertyGeneralSectionProps) => {
  const { t } = useTranslation(['common', 'properties']);
  return (
    <Card>
      <Typography.Title level={4}>{t('properties:company_details')}</Typography.Title>
      <Row className="gap-8">
        <Col className="flex-1">
          <Form.Item
            label={t('common:form.company_name')}
            name="companyName"
            rules={[{ required: true }]}
          >
            <Input disabled={mode === FuncType.UPDATE} />
          </Form.Item>
        </Col>
      </Row>
      <Row className="gap-8">
        <Col>
          <Form.Item label={t('common:form.bank')} name="bank">
            <Input disabled={mode === FuncType.UPDATE} />
          </Form.Item>
        </Col>
        <Col className="flex-1">
          <Form.Item label="BIC" name="bic">
            <Input disabled={mode === FuncType.UPDATE} />
          </Form.Item>
        </Col>
        <Col className="flex-1">
          <Form.Item label="IBAN" name="iban">
            <Input disabled={mode === FuncType.UPDATE} />
          </Form.Item>
        </Col>
      </Row>
      <Row className="gap-8">
        <Col className="flex-1">
          <Form.Item
            label={t('common:form.commercial_register_entry')}
            name="commercialRegisterEntry"
            rules={[{ required: true }]}
          >
            <Input disabled={mode === FuncType.UPDATE} />
          </Form.Item>
        </Col>
        <Col className="flex-1">
          <Form.Item label={t('common:form.tax_id')} name="taxId" rules={[{ required: true }]}>
            <Input disabled={mode === FuncType.UPDATE} />
          </Form.Item>
        </Col>
        <Col className="flex-1">
          <Form.Item label={t('common:form.managing_directors')} name="managingDirectors">
            <Input disabled={mode === FuncType.UPDATE} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default CompanyDetailSection;
