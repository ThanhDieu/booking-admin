import { Col, Form, Input, Row } from 'antd';
import { TextEditor } from 'components/common';
import { ThemeType } from 'configs/const/general';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';

const NewsletterTextForm = () => {
  const { t } = useTranslation(['newsletter', 'reservation', 'common']);

  const { selected } = useAppSelector((state) => state.app.theme);

  return (
    <>
      <Row>
        <Col span={6}>
          <Form.Item
            rules={[
              {
                required: true,
                message: t('common:error.required_message', { content: t('common:table.name') })
              }
            ]}
            label={t('common:table.name')}
            name="name"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={56}>
        <Col>
          <Form.Item label={t('newsletter:intro_content')} name="intro">
            <TextEditor
              className="bundle-text-editor"
              style={{ backgroundColor: selected === ThemeType.DARK ? '#000' : '#fff' }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label={t('newsletter:outro_content')} name="outro">
            <TextEditor
              className="bundle-text-editor"
              style={{ backgroundColor: selected === ThemeType.DARK ? '#000' : '#fff' }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default NewsletterTextForm;
