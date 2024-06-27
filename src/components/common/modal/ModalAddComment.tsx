/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Modal, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'utils/text';

interface Props {
  title: string;
  modalOpen: boolean;
  onChangeOpenModal: (value: string) => void;
  loading?: boolean;
  id: string;
  comment: string | undefined;
  onUpdate: (id: string, payload: any) => Promise<any>;
}
const ModalAddComment: React.FC<Props> = ({
  onChangeOpenModal,
  title,
  modalOpen,
  loading,
  id,
  comment,
  onUpdate
}) => {
  const { t } = useTranslation(['common']);
  const [form] = useForm();
  const onSave = (formData: any) => {
    onUpdate(id, formData);
    form.resetFields();
  };

  const initialValue = {
    comment: comment
  };

  useEffect(() => {
    comment && modalOpen && form.setFieldsValue(initialValue);
  }, [comment]);

  return (
    <Modal
      title={t('common:modal.title', { content: title })}
      centered
      open={modalOpen}
      footer={null}
      closable={false}
      onCancel={() => onChangeOpenModal('')}
    >
      <Spin spinning={loading}>
        <Form
          initialValues={initialValue}
          name="basic"
          layout="vertical"
          onFinish={onSave}
          autoComplete="off"
          form={form}
        >
          <Form.Item label={capitalize(title)} name="comment" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder={capitalize(title)} />
          </Form.Item>

          <Form.Item className="flex justify-end mb-0">
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => onChangeOpenModal('')}
              disabled={loading}
              className="mr-3"
            >
              {t('common:button.save')}
            </Button>
            <Button onClick={() => onChangeOpenModal('')} disabled={loading}>
              {t('common:button.close')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
export default ModalAddComment;
