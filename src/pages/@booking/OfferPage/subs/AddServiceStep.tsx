import {
  BankOutlined,
  CalendarOutlined,
  HistoryOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { GeneralReservationInfo } from 'components/common';
import { TableDisplayServicePrice } from 'pages/@booking/ReservationsPage/partials';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';
import { dateFormat } from 'utils/dayjs';
import OverviewBundleOfferCard from '../partials/OverviewBundleOfferCard';
import { calculateTotal } from 'utils/calculate';

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  summaryBundle: {
    [x: string]: number;
  };
  summaryService: number;
  numberOfNight: number;
}

const FormCreateOffer = ({
  setCurrentStep,
  summaryBundle,
  summaryService,
  numberOfNight
}: Props) => {
  const { t } = useTranslation(['reservation', 'common', 'offer', 'sidebar']);

  const { payloadSearch } = useAppSelector((state) => state.booking.booking);
  const { bundleOfferSelected } = useAppSelector((state) => state.booking.offer);
  //RENDER UI
  const arrival = payloadSearch?.arrival && dateFormat(payloadSearch.arrival, 'MMM DD,YYYY');
  const departure = payloadSearch?.departure && dateFormat(payloadSearch.departure, 'MMM DD,YYYY');

  const summaryGuest = calculateTotal(bundleOfferSelected, ['adults', 'children']);

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
      value: `${summaryGuest.adults ?? 0} ${t('reservation:adults').toLowerCase()},
              ${summaryGuest.children ?? 0} ${t('reservation:children').toLowerCase()}`
    }
  ];

  return (
    <Space direction="vertical" className="w-full">
      <div className="flex flex-col justify-center gap-12">
        {/* PROPERTY & TRAVEL DATE */}
        <Space direction="vertical" size={5}>
          <Typography.Title level={4}>
            {t('reservation:property_and_travel_dates')}{' '}
          </Typography.Title>
          <GeneralReservationInfo items={renderItemTravelInfo} />
        </Space>
        <div className="flex flex-col min-[1200px]:flex-row gap-5">
          <div className="basis-2/3">
            {/* EXTRAS & SERVICES */}
            <Space direction="vertical" size={5} className="w-full">
              <Typography.Title level={4}>Extras & services</Typography.Title>
              <TableDisplayServicePrice numberOfNight={numberOfNight} isOffer />
            </Space>
          </div>
          <div className="basis-1/3 ">
            {/* OVERVIEW INFO */}
            <Space direction="vertical" size={5} className="w-full">
              <Typography.Title level={4}>{t('sidebar:sidebar.overview')}</Typography.Title>
              <OverviewBundleOfferCard
                summaryBundle={summaryBundle.totalPrice}
                summaryService={summaryService}
                numberOfNight={numberOfNight}
              />
            </Space>
          </div>
        </div>

        <Space className="mt-5">
          <Button onClick={() => setCurrentStep(2)} type={'primary'}>
            {t('common:button.continue')}
          </Button>
          <Button onClick={() => setCurrentStep(0)}> {t('common:button.back')}</Button>
        </Space>
      </div>
    </Space>
  );
};

export default FormCreateOffer;
