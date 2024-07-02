/* eslint-disable @typescript-eslint/no-explicit-any */
import { PeriodTime } from '@types';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row, Select, Spin } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { useForm, useWatch } from 'antd/es/form/Form';
import { ViewMode } from 'configs/const/auth';
import { DATE_FORMAT_1, DATE_FORMAT_3, TIME_FORMAT } from 'configs/const/format';
import { A_THOUSAND } from 'configs/const/general';
import { bookingChannelOptions } from 'configs/const/options';
import { paths } from 'constant';
import dayjs, { Dayjs } from 'dayjs';
import useView from 'hooks/useView';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store';
import {
  StateAccommodation,
  changeState,
  removeReservation,
  updateExtraServices,
  updatePayloadSearch
} from 'store/booking/Booking';
import { isRequired } from 'utils/array';
import { formatSelectOption } from 'utils/format';
import { DateTimeSeparate } from '..';
import { ActionReservationDetailType } from '../../subs/TravelDatePage';

// Can not select days before
export const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current < dayjs().subtract(1, 'day').endOf('day');
};

type FormDataType = {
  adults: number;
  children: string;
  arrivalDate: Dayjs;
  arrivalTime: Dayjs;
  departureDate: Dayjs;
  departureTime: Dayjs;
  period: any;
  property: string;
  channelCode: string;
};

interface Props {
  loading?: boolean;
  status?: string[];
  data?: {
    period: PeriodTime;
  };
  isOffer?: boolean;
}

const SearchBookingBundle = ({ loading, status, data, isOffer = false }: Props) => {
  const { t } = useTranslation('reservation');
  const { currentViewObj } = useView();
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { payloadSearch, reservations, bundleSelected } = useAppSelector(
    (state) => state.booking.booking
  );
  const { bundleOfferSelected } = useAppSelector((state) => state.booking.offer);
  const { properties, loading: propertyLoading } = useAppSelector((state) => state.booking?.property);
  const propertiesOptions = formatSelectOption(properties?.data ?? [], 'name', 'extId');

  const onSubmitForm = (formData: FormDataType) => {
    const childrenArr = formData.children.length
      ? formData.children.includes(',')
        ? formData.children
          .trim()
          .split(',')
          .map((age) => age.trim())
        : [formData.children.trim()]
      : [];

    const payload: any = {
      adults: formData.adults,
      children: childrenArr,
      channelCode: formData?.channelCode,
      propertyId:
        currentViewObj.name === ViewMode.Account
          ? formData?.property?.split('@')[0]
          : currentViewObj?.code
    };
    if (data?.period) {
      const preArrival = `${dayjs(
        formData.arrivalDate || Number(data?.period?.from) * A_THOUSAND
      ).format(DATE_FORMAT_1)} ${dayjs(
        formData.arrivalTime || Number(data?.period?.from) * A_THOUSAND
      ).format(TIME_FORMAT)}`;
      const preDeparture = `${dayjs(
        formData.departureDate || Number(data?.period?.to) * A_THOUSAND
      ).format(DATE_FORMAT_1)} ${dayjs(
        formData.departureTime || Number(data?.period?.to) * A_THOUSAND
      ).format(TIME_FORMAT)}`;

      payload.arrival = dayjs(preArrival).unix();
      payload.departure = dayjs(preDeparture).unix();
    } else {
      payload.arrival = formData?.period[0].unix();
      payload.departure = formData?.period[1].unix();
    }

    dispatch(updatePayloadSearch(payload));
    dispatch(changeState(StateAccommodation.Select));
    dispatch(updateExtraServices([]));
  };
  const initialForm = {
    property: payloadSearch?.propertyId,
    period:
      payloadSearch?.arrival && payloadSearch?.departure
        ? [
          dayjs(dayjs(Number(payloadSearch?.arrival || 0) * A_THOUSAND), DATE_FORMAT_3),
          dayjs(dayjs(Number(payloadSearch?.departure || 0) * A_THOUSAND), DATE_FORMAT_3)
        ]
        : [],
    adults: payloadSearch?.adults || 1,
    children: payloadSearch?.children || [],
    channelCode: payloadSearch?.channelCode ? payloadSearch?.channelCode : 'AltoVita'
  };
  const initialForm2 = {
    ...initialForm,
    arrivalDate: dayjs(dayjs(Number(data?.period?.from || 0) * A_THOUSAND), DATE_FORMAT_3),
    departureDate: dayjs(dayjs(Number(data?.period?.to || 0) * A_THOUSAND), DATE_FORMAT_3),
    arrivalTime: dayjs(dayjs(Number(data?.period?.from || 0) * A_THOUSAND), TIME_FORMAT),
    departureTime: dayjs(dayjs(Number(data?.period?.to || 0) * A_THOUSAND), TIME_FORMAT)
  };

  return (
    <div className="flex flex-col gap-10">
      <Spin spinning={propertyLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmitForm}
          initialValues={data?.period ? initialForm2 : initialForm}
        >
          <Row gutter={10}>
            {currentViewObj.name === ViewMode.Account && propertiesOptions && !propertyLoading && (
              <Col span={5}>
                <Form.Item
                  label={t('filter_by_property')}
                  name="property"
                  rules={[{ required: true, message: t('error_message_property') }]}
                >
                  <Select
                    disabled={isOffer && bundleOfferSelected.length > 0}
                    options={propertiesOptions}
                    placeholder={t('pick_hotel_placeholder')}
                  />
                </Form.Item>{' '}
              </Col>
            )}
            {data?.period ? (
              <Col span={12}>
                <DateTimeSeparate
                  inputs={[
                    {
                      name: 'arrivalDate',
                      required: true,
                      disabled: isRequired(ActionReservationDetailType.AmendArrival, status)
                    },
                    {
                      name: 'arrivalTime',
                      required: false,
                      type: 'time',
                      disabled: isRequired(ActionReservationDetailType.AmendArrival, status)
                    },
                    {
                      name: 'departureDate',
                      required: true,
                      disabled: isRequired(ActionReservationDetailType.AmendDeparture, status)
                    },
                    {
                      name: 'departureTime',
                      required: false,
                      type: 'time',
                      disabled: isRequired(ActionReservationDetailType.AmendDeparture, status)
                    }
                  ]}
                  detail={data?.period}
                  watchHook={{
                    fromSelected: useWatch('arrivalDate', form),
                    toSelected: useWatch('departureDate', form)
                  }}
                  formType={paths.travelDates}
                />
              </Col>
            ) : (
              <Col span={5}>
                <Form.Item
                  label={`${t('arrival_date')} - ${t('departure_date')}`}
                  name="period"
                  rules={[{ required: true, message: t('error_message_period') }]}
                >
                  <DatePicker.RangePicker
                    disabledDate={disabledDate}
                    disabled={[
                      isRequired(ActionReservationDetailType.AmendArrival, status) ||
                      (isOffer && bundleOfferSelected.length > 0),
                      isRequired(ActionReservationDetailType.AmendDeparture, status) ||
                      (isOffer && bundleOfferSelected.length > 0)
                    ]}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={4}>
              <Form.Item
                label={t('adults')}
                name="adults"
                rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
              >
                <InputNumber addonAfter={t('per_unit')} min={1} />
              </Form.Item>
            </Col>{' '}
            <Col span={4}>
              <Form.Item
                help="from 0-17"
                label={t('children_age')}
                name="children"
                rules={[
                  {
                    validator(_, value) {
                      if (
                        /^\s*(0[0-9]|1[0-7]|[0-9])(\s*,\s*(0[0-9]|1[0-7]|[0-9]))*\s*$/.test(
                          value
                        ) === false &&
                        value.length
                      ) {
                        return Promise.reject(new Error('Separate age by a comma'));
                      }
                      if (!value) return Promise.resolve();
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input placeholder="Separate age by a comma" />
              </Form.Item>{' '}
            </Col>
          </Row>
          {!isOffer && (
            <Row gutter={10}>
              <Col>
                <Form.Item label={t('channel_code')} name="channelCode">
                  <Select options={bookingChannelOptions} />
                </Form.Item>
              </Col>
            </Row>
          )}
          <div className="flex gap-5">
            <Button type="primary" htmlType="submit" disabled={loading}>
              {t('search_bundles')}
            </Button>

            {bundleSelected ? (
              <Button
                onClick={() => {
                  dispatch(changeState(StateAccommodation.ExtraInfo));

                  dispatch(
                    removeReservation({
                      index: reservations.length - 1,
                      stateAcc: StateAccommodation.ExtraInfo
                    })
                  );
                }}
              >
                {t('cancel_adding')}
              </Button>
            ) : null}
          </div>
        </Form>
      </Spin>
    </div>
  );
};

export default SearchBookingBundle;
