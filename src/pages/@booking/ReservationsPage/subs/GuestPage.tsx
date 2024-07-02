/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Form, Space, Spin, Typography } from 'antd';
import { ModalUpdateGuestDetail } from 'components/common';
import GuestInfoComponent from 'components/common/GuestInfoComponent';
import { useAsyncAction } from 'hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { updateReservationService } from 'services/Reservation';
import { ReservationDetailAppType } from 'services/Reservation/type';
import { AddGuestComponent } from '../partials';
import { languages } from 'constant';
import Card from 'antd/es/card/Card';

interface Props {
  reservationDetail: ReservationDetailAppType;
  onChangeDetail: () => void;
  getReservationDetail: (controller?: AbortController) => void;
}
const GuestPage = ({ reservationDetail, onChangeDetail, getReservationDetail }: Props) => {
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const { message } = App.useApp();
  const { t } = useTranslation(['common', 'reservation']);
  const [form] = Form.useForm();

  const guestInfo = reservationDetail?.data?.primaryGuest;

  const itemsRenderInfo = [
    {
      title: t('reservation:birthday'),
      content: guestInfo?.birthDate ?? ''
    },
    {
      title: t('reservation:gender'),
      content: guestInfo?.gender ?? ''
    },
    {
      title: t('reservation:preferred_language'),
      content: guestInfo?.preferredLanguage
        ? languages[guestInfo?.preferredLanguage as keyof typeof languages]
        : ''
    },
    {
      title: t('reservation:travel_purpose'),
      content: reservationDetail?.data?.travelPurpose ?? ''
    },
    {
      title: t('reservation:nationality'),
      content: guestInfo?.nationalityCountryCode ?? ''
    },
    {
      title: t('reservation:place_of_birth'),
      content: guestInfo?.birthPlace ?? ''
    },
    {
      title: t('reservation:passport_number'),
      content: guestInfo?.identificationNumber ?? ''
    }
  ];

  const [updateGuest, stateUpdatePrimaryGuest] = useAsyncAction(updateReservationService, {
    onSuccess: () => {
      onChangeDetail();
      setOpenModalEdit(false);
      getReservationDetail();
      form.resetFields();
      message.success('Updated!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const onUpdateAdditionalGuest = (payload: any) => {
    reservationDetail?.extId && updateGuest(reservationDetail?.extId, payload);
  };

  return (
    <Spin spinning={stateUpdatePrimaryGuest.loading}>
      <Space direction="vertical" className="w-full">
        <Space size="large">
          <Button type="primary" className="text-base " onClick={() => setOpenModalEdit(true)}>
            {t('common:button.edit')}
          </Button>
        </Space>
        <Card>
          <div>
            <Typography.Title level={3} className="mb-0">
              {guestInfo?.title} {guestInfo?.firstName} {guestInfo?.middleInitial}{' '}
              {guestInfo?.lastName}
            </Typography.Title>
            <Typography.Text className="text-sm">{t('reservation:main_guest')}</Typography.Text>
          </div>
          <div className="flex gap-10">
            <Space direction="vertical" size={0} className="min-w-[200px]">
              <Typography.Text className="text-base">
                {guestInfo?.company?.name} {guestInfo?.company?.taxId}
              </Typography.Text>
              <Typography.Text className="text-base">{guestInfo?.email}</Typography.Text>
              <Typography.Text className="text-base">{guestInfo?.phone}</Typography.Text>
              <Typography.Text className="text-base">
                {guestInfo?.address?.addressLine1} {guestInfo?.address?.addressLine2}{' '}
                {guestInfo?.address?.city} {guestInfo?.address?.countryCode}
              </Typography.Text>
            </Space>
            <GuestInfoComponent items={itemsRenderInfo} />
          </div>
        </Card>

        {reservationDetail?.data?.guestComment && (
          <Space direction="vertical" size="small">
            <Typography.Title level={5} className="mb-0">
              {t('reservation:guest_comment')}:
            </Typography.Title>
            <Typography.Text className="pl-[15px] pb-4">
              {reservationDetail?.data?.guestComment}
            </Typography.Text>
          </Space>
        )}
        {reservationDetail?.data?.additionalGuests && (
          <div className="mt-5">
            <Typography.Title level={3}>{t('reservation:additional_guests')}</Typography.Title>
            <AddGuestComponent
              updateGuest={onUpdateAdditionalGuest}
              dataGuest={reservationDetail?.data?.additionalGuests ?? []}
              isShowResult
            />
          </div>
        )}
        <ModalUpdateGuestDetail
          form={form}
          open={openModalEdit}
          onClose={() => setOpenModalEdit(false)}
          reservationDetail={reservationDetail}
          updateGuestPrimary={updateGuest}
          loading={stateUpdatePrimaryGuest?.loading}
        />
      </Space>
    </Spin>
  );
};

export default GuestPage;
