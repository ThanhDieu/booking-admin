/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { Button, Form, Popconfirm, Space, Spin } from 'antd';
import { PaymentAccountComponent } from 'components/common';
import { BookingPayloadProps } from 'services/Bookings/type';
import { useAppDispatch, useAppSelector } from 'store';
import { ServiceSelectedType } from '../partials/booking/FormCreateBooking';
import { useTranslation } from 'react-i18next';
import { resetAllState } from 'store/booking/Booking';

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  createBooking: (payload: BookingPayloadProps) => Promise<any>;
  loading: boolean;
}

const CreatePayment = ({ setCurrentStep, createBooking, loading }: Props) => {
  const { t } = useTranslation(['reservation']);

  const { booker, bookerComment, reservations } = useAppSelector((state) => state.booking.booking);
  const dispatch = useAppDispatch();

  const customReservation = useMemo(() => {
    const result = reservations?.map((res) => {
      const customSelectedService: ServiceSelectedType[] = res.extraServices?.map((service) => {
        return {
          count: service?.count || 1,
          serviceId: service?.extId ? service.extId : ''
        };
      });

      return {
        primaryGuest: res?.guests?.length ? res?.guests[0] : booker,
        additionalGuests:
          res?.guests?.length && res?.guests?.length > 1 ? res?.guests.slice(1) : [],
        services: customSelectedService,
        bundlePriceId: res?.bundleSelected?.bundlePriceId,
        arrival: res?.payloadSearch?.arrival,
        departure: res?.payloadSearch?.departure,
        adults: res?.payloadSearch?.adults,
        channelCode: res?.payloadSearch?.channelCode
      };
    });
    return result;
  }, [reservations]);

  const handleCreateBooking = () => {
    const voucherCodeList = reservations
      ?.map((res) => {
        return res?.vouchers && res?.vouchers ? res?.vouchers?.code : '';
      })
      .filter((el) => el !== '');
    const payload: BookingPayloadProps = {
      booker,
      bookerComment,
      reservations: customReservation
    };
    if (voucherCodeList?.length) payload.vouchers = voucherCodeList;
    createBooking(payload);
  };

  return (
    <>
      {loading ? (
        <Space className="w-full justify-center items-center">
          <Spin tip="Loading"></Spin>
        </Space>
      ) : (
        <Form>
          <PaymentAccountComponent />
          <Space>
            <Button type="primary" htmlType="submit" disabled>
              {t('reservation:verify')}
            </Button>
            <Button type="default" onClick={() => handleCreateBooking()}>
              {t('reservation:skip_payment_and_create_booking')}
            </Button>
            <Button type="default" onClick={() => setCurrentStep(1)}>
              {t('common:button.back')}
            </Button>
            <Popconfirm
              title="Cancel booking"
              description="Are you sure to cancel this booking?"
              onConfirm={() => {
                dispatch(resetAllState());
                setCurrentStep(0);
              }}
              okText="Yes"
              cancelText="No"
              placement="rightBottom"
            >
              {/* <Button type="default">{t('reservation:cancel_booking')}</Button> */}
            </Popconfirm>
          </Space>
        </Form>
      )}
    </>
  );
};

export default CreatePayment;
