/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs, TabsProps } from 'antd';
import { PlainLayout } from 'components/layout';
import { COPYRIGHT, paths } from 'constant';
import { useAsyncAction, useDetailDisplay, useDidMount } from 'hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getBookingByIdService } from 'services/Bookings';
import { BookingDetailAppType } from 'services/Bookings/type';
import HeaderSection from './partials/HeaderSection';
import { BookerPage, ReservationPage } from './subs';

const BookingDetailPage = () => {
  const { t } = useTranslation(['bookingDetail']);
  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams();
  const [activeKeyState, setActiveKeyState] = useState<string>(paths.reservations);
  const [detailState, setDetailState] = useState<BookingDetailAppType>();

  // services
  const [getBookingDetail, bookingDetailState] = useAsyncAction(getBookingByIdService);

  // data
  const bookingDetail = useDetailDisplay<BookingDetailAppType>(bookingDetailState);

  // FUNCTIONS
  const mergeDetail = (value: BookingDetailAppType) => {
    const newData: any = value.reservations?.map((item) => item?.data);

    const newDetail: BookingDetailAppType = {
      ...bookingDetail,
      data: {
        ...bookingDetail?.data,
        id: bookingDetail?.extId || '',
        reservations: newData
      }
    };

    setDetailState(newDetail);
  };

  useDidMount((controller) => {
    if (param.code && param.id) getBookingDetail(param?.id, controller?.signal);
    if (location) {
      const path = location.pathname.split('/');
      setActiveKeyState(path.length > 4 ? path[path.length - 1] : paths.reservations);
    }
  });

  // UI
  const items: TabsProps['items'] = [
    {
      key: `${paths.reservations}`,
      label: paths.reservations.toUpperCase(),
      children: (
        <ReservationPage
          bookingId={param.id || ''}
          onSetBookingDetail={mergeDetail}
          bookingDetail={bookingDetail}
          getBookingDetail={getBookingDetail}
        />
      )
    },
    {
      key: `${paths.booker}`,
      label: paths.booker.toUpperCase(),
      children: <BookerPage bookingDetail={bookingDetail} />
    }
    // TODO
    // {
    //   key: `${paths.payment}`,
    //   label: `${paths.payment} ${paths.account}`.toUpperCase(),
    //   children: <PaymentPage bookingDetail={bookingDetail} />
    // }
  ];

  return (
    <PlainLayout
      headerprops={{
        title: t('bookingDetail:booking_detail')
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
    >
      <>
        <HeaderSection bookingDetail={detailState || bookingDetail} />
        <Tabs
          activeKey={activeKeyState}
          items={items}
          onChange={(key: string) => {
            navigate(`${key}`);
            setActiveKeyState(key);
          }}
        />
      </>
    </PlainLayout>
  );
};

export default BookingDetailPage;
