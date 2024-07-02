/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Col, DatePicker, Form, Input, Row, Space, Typography } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { AddressComponent, BookerDetailsComponent } from 'components/common';
import { A_THOUSAND } from 'configs/const/general';
import { countries } from 'constant';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store';
import { updateBookerOffer } from 'store/booking/Offer';
import { formatInitialValueGuest, formatPayloadUpdateGuest } from 'utils/payload';
import { OfferDiscountComponent } from '../partials';

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  summaryBundle: number;
  summaryService: number;
}

const BookerOffer = ({ setCurrentStep, summaryBundle, summaryService }: Props) => {
  const { t } = useTranslation(['common', 'reservation', 'bundles']);
  const [form] = Form.useForm();

  const { offerInfo } = useAppSelector((state) => state.booking.offer);
  const { payloadSearch } = useAppSelector((state) => state.booking.booking);
  const dispatch = useAppDispatch();

  const handleChangeValueDiscount = (value?: number | null) => {
    const calculatedValue = (form.getFieldValue(['totalPrice']) || 0) - (value ?? 0);

    form.setFieldValue('finalPrice', calculatedValue);
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    const beforeArrival = dayjs.unix(payloadSearch?.arrival).subtract(1, 'day');
    return current.isAfter(beforeArrival, 'day');
  };

  const subTotal = summaryBundle + summaryService;
  const grandTotal = subTotal - (offerInfo?.discount ?? 0);

  const initialForm = offerInfo
    ? {
      ...formatInitialValueGuest(offerInfo),
      validity: dayjs(dayjs(Number(offerInfo?.validity || 0) * A_THOUSAND)),
      discount: offerInfo?.discount ?? 0,
      name: offerInfo.name,
      totalPrice: subTotal,
      finalPrice: grandTotal
    }
    : {
      totalPrice: subTotal,
      finalPrice: grandTotal
    };

  const onsubmitForm = (formData: any) => {
    const payload = {
      ...formatPayloadUpdateGuest(formData),
      discount: formData?.discount ?? 0,
      price: formData?.totalPrice,
      name: formData?.name ?? '',
      validity: dayjs(formData.validity).unix()
    };
    dispatch(updateBookerOffer(payload));
    setCurrentStep(3);
  };

  useEffect(() => {
    offerInfo?.discount && handleChangeValueDiscount(offerInfo?.discount);
    form.setFieldsValue(initialForm);
  }, []);

  return (
    <Form onFinish={onsubmitForm} form={form} layout="vertical" initialValues={initialForm}>
      <div className="flex flex-col">
        {/* Title & Discount & Validity*/}
        <Space direction="vertical" className="mb-10">
          <Typography.Title level={3}>Title & Discount</Typography.Title>
          <Card>
            <Row gutter={20}>
              <Col span={6}>
                <Form.Item rules={[{ required: true }]} label={t('offer:offer_name')} name="name">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item rules={[{ required: true }]} label={t('offer:validity')} name="validity">
                  <DatePicker disabledDate={disabledDate} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <OfferDiscountComponent
                handleChangeValueDiscount={handleChangeValueDiscount}
                form={form}
              />
            </Row>
          </Card>
        </Space>
        {/* Booker infor */}
        <Space direction="vertical">
          <Typography.Title level={3}>{t('reservation:booker_detail')}</Typography.Title>
          <BookerDetailsComponent
            required={['lastName', 'title', 'firstName', 'email', 'phone']}
            shorten
            isOffer
          />
          <Typography.Title level={3}>{t('reservation:address')}</Typography.Title>

          <AddressComponent
            countries={countries}
            required={['addressLine1', 'postalCode', 'countryCode', 'city']}
          />
        </Space>
        <Space className="mt-5">
          <Button type="primary" htmlType="submit">
            {t('common:button.continue')}
          </Button>
          <Button
            type="default"
            onClick={() => {
              setCurrentStep(1);
            }}
          >
            {t('common:button.back')}
          </Button>
        </Space>
      </div>
    </Form>
  );
};

export default BookerOffer;
