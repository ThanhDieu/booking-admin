/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Space, Spin, Typography } from 'antd';
import { GeneralReservationInfo } from 'components/common';

import {
  BankOutlined,
  BorderOutlined,
  CalendarOutlined,
  FileOutlined,
  HistoryOutlined,
  ShoppingCartOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { GuestInfo } from '@types';
import dayjs from 'dayjs';
import { useAsyncAction, useDetailDisplay } from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getBookingByIdService } from 'services/Bookings';
import { BookingDetailAppType, BookingPayloadProps } from 'services/Bookings/type';
import { GetBundlePriceTypeV2 } from 'services/Bundle/type';
import { VoucherType } from 'services/Vouchers/type';
import { useAppDispatch, useAppSelector } from 'store';
import { StateAccommodation, addReservation, changeState } from 'store/booking/Booking';
import { dateFormat } from 'utils/dayjs';
import AddGuestComponent from './AddGuestComponent';
import TableDisplayServicePrice from './TableDisplayServicePrice';
import VoucherApplyComponent from './VoucherApplyComponent';

export interface ServiceSelectedType {
  count: number;
  serviceId: string;
}
interface Props {
  loading: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  currentCardRes: number | undefined;
  setCurrentCardRes: React.Dispatch<React.SetStateAction<number | undefined>>;
  createReservation: (bookingId: string, payload: BookingPayloadProps) => Promise<any>;
}

export const FormCreateBooking = ({
  loading,
  setCurrentStep,
  currentCardRes,
  setCurrentCardRes,
  createReservation
}: Props) => {
  const { t } = useTranslation(['reservation']);
  const [dataGuest, setDataGuest] = useState<GuestInfo[]>([]);
  const location = useLocation();
  const bookingId = useMemo(() => {
    return location?.search !== '' ? location?.search?.split('=')[1] : undefined;
  }, [location]);
  const [allVoucherApplied, setAllVoucherApplied] = useState<VoucherType>();

  //HOOK
  const [openTabelService, setOpenTableService] = useState<boolean>(false);

  //SERVICE
  const [getBookingById, stateGetBooking] = useAsyncAction(getBookingByIdService);
  const dispatch = useAppDispatch();
  const { payloadSearch, bundleSelected, extraServices, reservations, guests } = useAppSelector(
    (state) => state.booking.booking
  );
  const existedBooking = useDetailDisplay<BookingDetailAppType>(stateGetBooking);
  const booker = existedBooking && existedBooking?.data?.booker;

  useEffect(() => {
    if (bookingId) getBookingById(bookingId);
  }, [bookingId && bookingId]);

  //RENDER UI
  const arrival = payloadSearch?.arrival && dateFormat(payloadSearch.arrival, 'MMM DD,YYYY');
  const departure = payloadSearch?.departure && dateFormat(payloadSearch.departure, 'MMM DD,YYYY');

  const numberOfNight = dayjs(departure).diff(dayjs(arrival), 'day');

  const renderItemTravelInfo = [
    {
      icon: <BankOutlined />,
      value: payloadSearch?.propertyId
    },
    {
      icon: <HistoryOutlined />,
      value: numberOfNight >= 1 ? 'Over night' : 'Day use'
    },
    {
      icon: <CalendarOutlined />,
      value: arrival + ' - ' + departure + ', ' + numberOfNight + ' nights'
    },
    {
      icon: <UsergroupAddOutlined />,
      value: payloadSearch?.adults
    }
  ];

  const renderItemOfferInfo = [
    {
      icon: <BorderOutlined />,
      value: bundleSelected?.unitGroup?.name
    },
    {
      icon: <FileOutlined />,
      value: bundleSelected?.bundleName
    },
    {
      icon: <ShoppingCartOutlined />,
      value: bundleSelected
        ? (bundleSelected as GetBundlePriceTypeV2)?.totalPrice +
        ' ' +
        (bundleSelected?.currency ?? '')
        : ''
    }
  ];

  //EVENT
  const handleAddMore = () => {
    dispatch(
      addReservation({
        res: {
          guests: dataGuest,
          extraServices,
          payloadSearch,
          bundleSelected,
          vouchers: allVoucherApplied
        },
        idx: currentCardRes
      })
    );
    dispatch(changeState(StateAccommodation.Search));
    setCurrentCardRes(undefined);
  };

  const handleContinue = async () => {
    const newReservation = dispatch(
      addReservation({
        res: {
          extraServices,
          payloadSearch,
          bundleSelected,
          guests: guests,
          vouchers: allVoucherApplied
        },
        idx: currentCardRes
      })
    ).payload?.res;

    if (bookingId) {
      const customReservation = [...reservations, newReservation]?.map((res) => {
        const customSelectedService: ServiceSelectedType[] = res.extraServices?.map((service) => {
          return {
            count: service?.count || 1,
            serviceId: service?.extId ? service.extId : ''
          };
        });

        return {
          primaryGuest: res?.guests?.length ? res?.guests[0] : booker,
          additionalGuests:
            res?.guests?.length && res?.guests?.length > 0 ? [...(res?.guests.slice(1) ?? [])] : [],
          services: customSelectedService,
          bundlePriceId: res?.bundleSelected?.bundlePriceId,
          arrival: res?.payloadSearch?.arrival,
          departure: res?.payloadSearch?.departure,
          adults: res?.payloadSearch?.adults,
          channelCode: res?.payloadSearch?.channelCode
        };
      });
      createReservation(bookingId, {
        reservations: [...customReservation]
      });
    } else {
      setCurrentStep(1);
      setCurrentCardRes(undefined);
    }
  };

  return (
    <>
      <Space direction="vertical" className="w-full">
        <div className="flex justify-start items-center gap-12">
          {/* PROPERTY & TRAVEL DATE */}
          <Space direction="vertical" size={5}>
            <Typography.Title level={3}>
              {t('reservation:property_and_travel_dates')}{' '}
            </Typography.Title>
            <GeneralReservationInfo items={renderItemTravelInfo} />
          </Space>
          {/* BUNDLES INFO */}
          <Space direction="vertical" size={5}>
            <Typography.Title level={3}>Bundles</Typography.Title>
            <GeneralReservationInfo items={renderItemOfferInfo} />
          </Space>
        </div>

        {/* VOUCHER */}
        {!bookingId && (
          <Space direction="vertical" size={5} className="w-full">
            <Typography.Title level={3}>Vouchers</Typography.Title>
            <VoucherApplyComponent
              currentCardRes={currentCardRes}
              allVoucherApplied={allVoucherApplied}
              setAllVoucherApplied={setAllVoucherApplied}
            />
          </Space>
        )}

        {/* EXTRAS & SERVICES */}
        <Space direction="vertical" size={5} className="w-full">
          <Typography.Title level={3}>Extras & services</Typography.Title>
          <TableDisplayServicePrice
            numberOfNight={numberOfNight}
            openTabelService={openTabelService}
            setOpenTableService={setOpenTableService}
            currentCardRes={currentCardRes}
          />
        </Space>
        {/* GUEST */}
        <AddGuestComponent
          currentCardRes={currentCardRes}
          dataGuest={dataGuest}
          setDataGuest={setDataGuest}
        />
        {!openTabelService && (
          <Space className="mt-5">
            <Button type={loading ? 'default' : 'primary'} onClick={handleContinue}>
              {loading ? (
                <Spin tip="loading"></Spin>
              ) : (
                `${bookingId ? t('common:button.create') : t('common:button.continue')}`
              )}
            </Button>
            <Button onClick={handleAddMore}> {t('common:button.add_more_res')}</Button>
          </Space>
        )}
      </Space>
    </>
  );
};

export default FormCreateBooking;
