/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Card, Form, Space, Spin, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import {
  AddressComponent,
  BookerDetailsComponent,
  IdentificationComponent
} from 'components/common';
import { countries } from 'constant';
import { useAsyncAction } from 'hooks';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { updateBookingService } from 'services/Bookings';
import { BookingDetailAppType } from 'services/Bookings/type';
import { formatInitialValueGuest, formatPayloadUpdateGuest } from 'utils/payload';
import { validateMessages } from 'utils/validationForm';

interface Props {
  bookingDetail?: BookingDetailAppType;
}

const BookerPage: React.FC<Props> = ({ bookingDetail }) => {
  const { t } = useTranslation(['common', 'bookingDetail']);
  const [form] = useForm();
  const { message } = App.useApp();

  const [updateBooker, stateUpdateBooker] = useAsyncAction(updateBookingService, {
    onSuccess: () => {
      message.success('Update success!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const bookerDetail = useMemo(() => bookingDetail?.data?.booker, [bookingDetail]);
  const initFormValue = bookerDetail && formatInitialValueGuest(bookerDetail);

  // FUNCTIONS
  const onSubmitForm = (formData: any) => {
    const payload = formData && formatPayloadUpdateGuest(formData, 'booker');

    bookingDetail?.extId && updateBooker(bookingDetail?.extId, payload);
  };
  const onReset = () => {
    form.resetFields();
  };

  useEffect(() => {
    if (bookerDetail) {
      form.setFieldsValue(initFormValue);
    }
  }, [bookerDetail]);

  return (
    <Form
      layout="vertical"
      initialValues={initFormValue}
      onFinish={onSubmitForm}
      form={form}
      validateMessages={validateMessages}
    >
      <Spin spinning={stateUpdateBooker?.loading}>
        <Space direction="vertical" size="large" className="w-full ">
          <Card>
            <Typography.Title level={4}>{t('bookingDetail:booker_detail')}</Typography.Title>
            <BookerDetailsComponent
              required={['lastName', 'title', 'firstName', 'email', 'phone']}
            />
          </Card>
          <Card>
            <Typography.Title level={4}>{t('common:form.address')}</Typography.Title>
            <AddressComponent
              countries={countries}
              required={['addressLine1', 'postalCode', 'countryCode', 'city']}
            />
          </Card>
          <Card>
            <Typography.Title level={4}>{t('common:form.identification')}</Typography.Title>
            <IdentificationComponent />
          </Card>
          <div className="flex gap-5 mt-5">
            <Button htmlType="submit" type="primary">
              {t('common:button.save')}
            </Button>
            <Button onClick={onReset}>Cancel</Button>
          </div>
        </Space>
      </Spin>
    </Form>
  );
};

export default BookerPage;
