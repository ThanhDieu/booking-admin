import { CreditCardOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useMemo } from 'react';
import { capitalize } from 'utils/text';
import { BookingDetailPageProps } from '../index.types';
import { useTranslation } from 'react-i18next';
dayjs.extend(utc);

const HeaderSection = ({ bookingDetail }: BookingDetailPageProps) => {
  const { t } = useTranslation(['common'])
  const paymentAccount = useMemo(() => bookingDetail?.data?.paymentAccount, [bookingDetail]);
  const totalGrossAmount = useMemo(() => {
    let amount = 0,
      balance = 0;
    bookingDetail?.data?.reservations?.map((reservation) => {
      if (reservation?.totalGrossAmount?.amount)
        amount += Number(reservation.totalGrossAmount.amount);
      if (reservation?.balance?.amount) balance += Number(reservation.balance.amount);
      return reservation;
    });
    return { amount, balance };
  }, [bookingDetail]);
  return (
    <Space className=" w-full justify-between mt-5">
      <div>
        <Typography.Title level={2}>
          {bookingDetail?.extId}
          {bookingDetail?.data?.booker && ', '}
          {bookingDetail?.data?.booker?.firstName} {bookingDetail?.data?.booker?.lastName}
        </Typography.Title>
      </div>
      <Space direction="vertical">
        <Space size="large">
          <Space direction="vertical" className="items-end" size={0}>
            <Typography.Text>{t('common:table.price').toUpperCase()}</Typography.Text>
            <Typography.Text className="text-3xl">
              {totalGrossAmount.amount.toFixed(2)}{' '}
              {bookingDetail?.data?.reservations?.length &&
                bookingDetail?.data?.reservations[0]?.totalGrossAmount?.currency}
            </Typography.Text>
          </Space>
          <Space direction="vertical" className="items-end " size={0}>
            <Typography.Text className=" text-red-600">{t('common:table.balance').toUpperCase()}</Typography.Text>
            <Typography.Text className=" text-red-600 text-3xl">
              {totalGrossAmount.balance.toFixed(2)}{' '}
              {bookingDetail?.data?.reservations?.length &&
                bookingDetail?.data?.reservations[0]?.totalGrossAmount?.currency}
            </Typography.Text>
          </Space>
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
