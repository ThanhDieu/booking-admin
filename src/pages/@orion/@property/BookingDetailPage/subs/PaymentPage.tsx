import { PaymentAccountType } from '@types';
import { Alert, Button, Card, Form, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { PaymentAccountComponent } from 'components/common';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookingDetailAppType } from 'services/Bookings/type';
import { validateMessages } from 'utils/validationForm';

interface Props {
  bookingDetail: BookingDetailAppType;
}

const PaymentPage: React.FC<Props> = ({ bookingDetail }) => {
  const { t } = useTranslation(['common', 'bookingDetail'])
  const [form] = useForm();
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);

  // data
  const paymentAccountDetail = useMemo(() => bookingDetail?.data?.paymentAccount, [bookingDetail]);

  useEffect(() => {
    form.setFieldsValue({
      ...paymentAccountDetail
    });
  }, [paymentAccountDetail]);

  const onSubmitForm = (formData: PaymentAccountType) => {
    console.log(formData);
  };

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [values]);

  return (
    <Form
      layout="vertical"
      // initialValues={initFormValue}
      onFinish={onSubmitForm}
      form={form}
      validateMessages={validateMessages}
      className="max-w-[50%]"
    >
      <Card>
        <Typography.Title level={4}>{t('bookingDetail:payment_account')}</Typography.Title>
        <Alert
          description={t('bookingDetail:alert_desc')}
          type="info"
          showIcon
          className="p-2 mb-2"
        />
        <PaymentAccountComponent
          required={['accountHolder', 'accountNumber', 'expiryMonth', 'expiryYear']}
        />
        <Button htmlType="submit" type="primary" disabled={!submittable}>
          {t('common:button.save')}
        </Button>
      </Card>
    </Form>
  );
};

export default PaymentPage;
