import { CreditCardOutlined } from '@ant-design/icons';

import { Space, Typography } from 'antd';
import GeneralResvationInfo, {
  GeneralReservationInfoProps
} from 'components/common/GeneralReservationInfo';
import XIcon from 'components/shared/Icon';
import { DATE_TIME_FORMAT_1 } from 'configs/const/format';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPriceByLocales } from 'utils/format';
import { addSpaceInString, capitalize } from 'utils/text';
import { ReservationDetailPageProps } from '../index.types';
dayjs.extend(utc);
dayjs.extend(tz);

const HeaderSection = ({ reservationDetail }: ReservationDetailPageProps) => {
  const { t } = useTranslation(['common', 'reservation']);
  const unit = useMemo(() => reservationDetail?.data?.unit, [reservationDetail?.data?.unit]);
  const paymentAccount = useMemo(
    () => reservationDetail?.data?.paymentAccount,
    [reservationDetail?.data?.paymentAccount]
  );

  const renderItemShortenInfo: GeneralReservationInfoProps[] = [
    {
      icon: <XIcon name="arrival" className=" text-xl" />,
      value: reservationDetail?.data?.arrival
        ? dayjs(reservationDetail?.data?.arrival).format(DATE_TIME_FORMAT_1)
        : ''
    },
    {
      icon: <XIcon name="departure" className=" text-xl" />,
      value: reservationDetail?.data?.departure
        ? dayjs(reservationDetail?.data?.departure).format(DATE_TIME_FORMAT_1)
        : ''
    },
    {
      icon: <XIcon name="info" className=" text-xl" />,
      value: addSpaceInString(reservationDetail?.data?.status || '')
    },
    {
      icon: <XIcon name="bed" className=" text-xl" />,
      value:
        (unit?.name ? unit?.name + ', ' : '') +
        (reservationDetail?.data?.unitGroup?.name || '') +
        (unit?.status?.condition ? ', ' + unit?.status.condition : '')
    },
    {
      icon: <XIcon name="tagRoom" className=" text-xl" />,
      value: reservationDetail?.extId
    }
  ];

  const price = formatPriceByLocales(
    reservationDetail?.data?.totalGrossAmount?.amount,
    reservationDetail?.data?.totalGrossAmount?.currency
  );
  const balance = formatPriceByLocales(
    reservationDetail?.data?.balance?.amount,
    reservationDetail?.data?.totalGrossAmount?.currency
  );

  return (
    <Space className=" w-full justify-between mt-5">
      <div>
        <Typography.Title level={2}>
          {reservationDetail?.extId}, {reservationDetail?.data?.primaryGuest?.firstName}{' '}
          {reservationDetail?.data?.primaryGuest?.lastName}
        </Typography.Title>
        <GeneralResvationInfo items={renderItemShortenInfo} />
      </div>
      <Space direction="vertical">
        <Space size="large">
          <Space direction="vertical" className="items-end" size={0}>
            <Typography.Text>{t('reservation:price').toUpperCase()}</Typography.Text>
            <Typography.Text className="text-3xl">
              {price} {reservationDetail?.data?.totalGrossAmount?.currency}
            </Typography.Text>
          </Space>
          {reservationDetail?.data?.balance?.amount !== 0 ? (
            <Space direction="vertical" className="items-end " size={0}>
              <Typography.Text type="danger">{t('common:table.balance')}</Typography.Text>
              <Typography.Text type="danger" className="text-3xl">
                {balance} {reservationDetail?.data?.totalGrossAmount?.currency}
              </Typography.Text>
            </Space>
          ) : (
            <Space direction="vertical" className="items-end " size={0}>
              <Typography.Text>{t('common:table.balance')}</Typography.Text>
              <Typography.Text className="text-3xl">
                {balance} {reservationDetail?.data?.totalGrossAmount?.currency}
              </Typography.Text>
            </Space>
          )}
        </Space>
        {paymentAccount && (
          <Typography.Text>
            <CreditCardOutlined />
            {'  '}
            {capitalize(paymentAccount?.paymentMethod)}, **** **** ****{' '}
            {paymentAccount?.accountNumber}, {paymentAccount?.expiryMonth}/
            {paymentAccount?.expiryYear}
          </Typography.Text>
        )}
      </Space>
    </Space>
  );
};

export default HeaderSection;
