import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import { FuncType } from 'configs/const/general';
import { useTranslation } from 'react-i18next';
import { VoucherCreatePayload } from 'services/Vouchers/type';
import { currencyParser } from 'utils/currency';
import { validateMessages } from 'utils/validationForm';

interface Props {
  openModal?: string;
  onChangeModal: () => void;
  onSubmitForm: (formData: VoucherCreatePayload) => void;
}

const ModalCreateVoucher = ({ openModal, onChangeModal, onSubmitForm }: Props) => {
  const { t } = useTranslation(['common', 'vouchers']);

  return (
    <Modal
      title={t('vouchers:create_voucher')}
      open={openModal === FuncType.CREATE}
      onCancel={() => onChangeModal()}
      footer={false}
      centered
      width={600}
    >
      <Form
        layout="vertical"
        onFinish={(values) => {
          onSubmitForm({ ...values, currency: 'EUR' });
        }}
        validateMessages={validateMessages}
      >
        <Row gutter={32}>
          <Col span={12}>
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
          <Col span={12}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: t('common:error.required_message', { content: t('common:table.email') })
                },
                { type: 'email' }
              ]}
              label={t('common:table.email')}
              name="email"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: t('common:error.required_message', { content: t('common:table.amount') })
                },
                { type: 'number', max: 9999, message: 'Maximum 9999' }
              ]}
              label={t('common:table.amount')}
              name="value"
            >
              <InputNumber min={0} className="w-full" addonAfter="EUR" parser={currencyParser} />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex gap-2 justify-end mt-4">
          <Button onClick={() => onChangeModal()}>{t('common:button.close')}</Button>
          <Button type="primary" htmlType="submit">
            {t('common:button.submit')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCreateVoucher;
