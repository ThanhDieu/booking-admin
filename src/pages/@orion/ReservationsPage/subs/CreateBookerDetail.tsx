/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Space, Typography } from 'antd';
import {
  AddressComponent,
  BookerDetailsComponent,
  IdentificationComponent
} from 'components/common';
import { countries } from 'constant';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import {
  StateAccommodation,
  changeState,
  updateBooker,
  updateBookerComment,
  updateExtraServices,
  updatePayloadSearch,
  updateBundleSelected
} from 'store/orion/Booking';
import { formatInitialValueGuest, formatPayloadUpdateGuest } from 'utils/payload';
import { ConfirmationResCard } from '../partials';
import { useTranslation } from 'react-i18next';

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setCurrentCardRes: React.Dispatch<React.SetStateAction<number | undefined>>;
  currentCardRes: number | undefined;
}

const CreateBookerDetail = ({ setCurrentStep, setCurrentCardRes, currentCardRes }: Props) => {
  const dispatch = useAppDispatch();
  const { reservations, booker } = useAppSelector((state) => state.orion.booking);
  const [autoFill, setAutoFill] = useState(false);
  const { t } = useTranslation(['common', 'reservation']);
  const [form] = Form.useForm();
  const firstGuest = reservations?.[0].guests?.[0];
  const initialForm = booker && formatInitialValueGuest(booker);

  const handleBack = () => {
    setCurrentStep(0);
    const index = reservations?.length > 0 ? reservations?.length - 1 : 0;
    if (!currentCardRes) setCurrentCardRes(index);
    dispatch(updateBundleSelected(reservations[index].bundleSelected));
    dispatch(updatePayloadSearch(reservations[index].payloadSearch));
    dispatch(updateExtraServices(reservations[index].extraServices));
  };
  useEffect(() => {
    if (reservations.length === 0) {
      dispatch(changeState(StateAccommodation.Search));
      setCurrentStep(0);
    }
  }, [reservations]);

  useEffect(() => {
    if (autoFill) {
      form.setFieldsValue({ ...initialForm, ...firstGuest });
    } else {
      const resetGuest = {
        title: '',
        firstName: '',
        lastName: '',
        email: ''
      };
      form.setFieldsValue({ ...initialForm, ...resetGuest });
    }
  }, [autoFill]);

  const onsubmitForm = (formData: any) => {
    const payload = formatPayloadUpdateGuest(formData);

    dispatch(updateBooker(payload));
    dispatch(updateBookerComment(formData?.bookerComment ? formData.bookerComment : ''));

    setCurrentStep(2);
  };

  return (
    <div className="flex">
      <Form onFinish={onsubmitForm} initialValues={initialForm} form={form}>
        <Space direction="vertical">
          <Typography.Title level={3}>{t('reservation:booker_detail')}</Typography.Title>
          <BookerDetailsComponent
            required={['lastName', 'title', 'firstName', 'email', 'phone']}
            autoFill={
              firstGuest
                ? (value) => {
                    setAutoFill(value);
                  }
                : undefined
            }
            form={form}
          />
          <Typography.Title level={3}>{t('reservation:address')}</Typography.Title>

          <AddressComponent
            countries={countries}
            required={['addressLine1', 'postalCode', 'countryCode', 'city']}
          />
          <Typography.Title level={3}>{t('reservation:identification')}</Typography.Title>

          <IdentificationComponent />
        </Space>
        <Space className="mt-5">
          <Button type="primary" htmlType="submit">
            {t('common:button.continue')}
          </Button>
          <Button type="default" onClick={handleBack}>
            {t('common:button.back')}
          </Button>
        </Space>
      </Form>
      {reservations.length > 0 && (
        <ConfirmationResCard
          setCurrentCardRes={setCurrentCardRes}
          setCurrentStep={setCurrentStep}
        />
      )}
    </div>
  );
};

export default CreateBookerDetail;
