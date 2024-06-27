/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Form, FormInstance, Modal, Space, Spin, Typography } from 'antd';
import BookerDetailsComponent from '../BookerDetailsComponent';
import { countries } from 'constant';
import AddressComponent from '../AddressComponent';
import IdentificationComponent from '../IdentificationComponent';
import { ReservationDetailAppType } from 'services/Reservation/type';
import { formatInitialValueGuest, formatPayloadUpdateGuest } from 'utils/payload';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  open: boolean;
  onClose: () => void;
  reservationDetail: ReservationDetailAppType;
  updateGuestPrimary: (reservationId: string, payload: any) => Promise<any>;
  loading: boolean;
  form?: FormInstance<any>;
}

const ModalUpdateGuestDetail = ({
  open,
  onClose,
  reservationDetail,
  loading,
  updateGuestPrimary,
  form
}: Props) => {
  const { t } = useTranslation(['common']);
  const guestInfo = useMemo(() => {
    return {
      ...reservationDetail?.data?.primaryGuest,
      guestComment: reservationDetail?.data?.guestComment
    };
  }, [reservationDetail?.data]);

  const initialForm = guestInfo && formatInitialValueGuest(guestInfo);
  useEffect(() => {
    if (guestInfo && form) form.setFieldsValue(initialForm);
  }, [guestInfo]);

  const onSubmitForm = (formData: any) => {
    const payload = formData && formatPayloadUpdateGuest(formData, 'primaryGuest');
    reservationDetail?.extId && updateGuestPrimary(reservationDetail?.extId, payload);
  };

  return (
    <Modal
      footer={false}
      title={<Typography.Title level={4}>Guest details</Typography.Title>}
      open={open}
      onCancel={onClose}
      width={900}
    >
      <Spin spinning={loading}>
        <Form form={form} layout="vertical" onFinish={onSubmitForm} initialValues={initialForm}>
          <div className="overflow-y-scroll overflow-x-hidden h-[600px] pr-3">
            <BookerDetailsComponent
              required={['lastName', 'title', 'firstName', 'email', 'phone']}
            />
            <Card className="my-5">
              <Typography.Title level={4}>{t('common:form.address')}</Typography.Title>
              <AddressComponent
                countries={countries}
                required={['addressLine1', 'postalCode', 'countryCode', 'city']}
              />
            </Card>
            <Card>
              <Typography.Title level={4}>Identification</Typography.Title>
              <IdentificationComponent />
            </Card>
          </div>
          <Space className="my-5 flex justify-end ">
            <Button type="primary" htmlType="submit">
              {t('common:button.save')}
            </Button>
            <Button onClick={onClose}>{t('common:button.close')}</Button>
          </Space>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalUpdateGuestDetail;
