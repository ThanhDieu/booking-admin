/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, StepProps, Steps } from 'antd';
import { PlainLayout } from 'components/layout';
import { COPYRIGHT, paths } from 'constant';
import { useAsyncAction } from 'hooks';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createBookingService } from 'services/Bookings';
import { useAppDispatch, useAppSelector } from 'store';
import { resetAllState } from 'store/booking/Booking';
import { CreateAccommodation, CreateBookerDetail, CreatePayment } from './subs';

const CreateBooking = () => {
  const { t } = useTranslation(['common', 'reservation']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { payloadSearch, reservations } = useAppSelector((state) => state.booking.booking);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentCardRes, setCurrentCardRes] = useState<number | undefined>(
    reservations.length > 0 ? reservations.length - 1 : undefined
  );

  const [createBooking, stateCreateBK] = useAsyncAction(createBookingService, {
    onSuccess: (res: any) => {
      const bookingId = res?.data?.data[0]?.id;
      const propertyId = payloadSearch?.propertyId;
      navigate(`/${propertyId}/${paths.bookings}/${bookingId}`);
      dispatch(resetAllState());
      message.success('Success!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  useEffect(() => {
    return () => {
      dispatch(resetAllState());
    };
  }, []);

  const items: StepProps[] = [
    {
      title: t('reservation:accommodation').toUpperCase()
    },
    {
      title: t('reservation:booker_detail').toUpperCase()
    },
    {
      title: t('reservation:payment').toUpperCase()
    }
  ];
  return (
    <PlainLayout
      headerprops={{
        title: t('common:button.new_pageName', { pageName: t('reservation:booking').toLowerCase() })
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <Steps items={items} current={currentStep} className="w-[900px]" />
      <div className="pt-8">
        {currentStep === 0 ? (
          <CreateAccommodation
            setCurrentStep={setCurrentStep}
            currentCardRes={currentCardRes}
            setCurrentCardRes={setCurrentCardRes}
          />
        ) : currentStep === 1 ? (
          <CreateBookerDetail
            setCurrentStep={setCurrentStep}
            setCurrentCardRes={setCurrentCardRes}
            currentCardRes={currentCardRes}
          />
        ) : (
          <CreatePayment
            setCurrentStep={setCurrentStep}
            createBooking={createBooking}
            loading={stateCreateBK.loading}
          />
        )}
      </div>
    </PlainLayout>
  );
};

export default CreateBooking;
