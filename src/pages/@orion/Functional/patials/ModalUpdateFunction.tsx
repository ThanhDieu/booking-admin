/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Form, FormInstance, Input, Modal, ModalProps, Row, Switch } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FunctionType } from 'services/Functional/type';
import { validateMessages } from 'utils/validationForm';
import { EditorObjectProps } from '..';
import EditorFunction from './Editor';

interface ModalUpdateFunction extends ModalProps {
  onSubmitForm: (formData: any) => void;
  form: FormInstance<any>;
  intialValue: FunctionType;
  editorObj: EditorObjectProps;
  setEditorObject: React.Dispatch<React.SetStateAction<EditorObjectProps>>;
  onCancelModal: () => void;
}

const ModalUpdateFunction = ({
  title,
  open,
  onSubmitForm,
  form,
  intialValue,
  setEditorObject,
  editorObj,
  onCancelModal
}: ModalUpdateFunction) => {
  const { t } = useTranslation(['common']);

  function onChangMonaco(valueChange?: string) {
    form.validateFields(['data']);
    setEditorObject({ ...editorObj, value: valueChange ? valueChange : '' });
  }

  return (
    <Modal title={title} centered width={900} open={open} footer={false} onCancel={onCancelModal}>
      <Form
        layout="vertical"
        onFinish={onSubmitForm}
        form={form}
        initialValues={intialValue}
        validateMessages={validateMessages}
      >
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              label={t('common:table.name')}
              name="name"
              rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label={t('common:button.disable')} name="disabled" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={6}>
            <Form.Item label={t('common:table.method')} name="method">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={t('common:table.method_type')} name="methodType">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label={t('common:table.comment')} name="comment">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t('common:table.data')}
          name="data"
          required
          rules={[
            {
              required: editorObj?.value.trim() === '',
              message: t('common:form.please_enter_this_field')
            }
          ]}
        >
          <EditorFunction onChangMonaco={onChangMonaco} editorObj={editorObj} />
        </Form.Item>

        <Form.Item className="flex justify-end mb-0">
          <Button type="primary" htmlType="submit" className="mr-3">
            {t('common:button.save')}
          </Button>
          <Button onClick={onCancelModal}>{t('common:button.close')}</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUpdateFunction;
