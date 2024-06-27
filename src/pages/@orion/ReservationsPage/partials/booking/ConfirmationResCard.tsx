/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined, EllipsisOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Card, Popover, Space, Typography } from 'antd';
import clsx from 'clsx';
import { ViewMode } from 'configs/const/auth';
import dayjs from 'dayjs';
import useView from 'hooks/useView';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceDetailAppType } from 'services/ServiceList/type';
import { useAppDispatch, useAppSelector } from 'store';
import {
  ReservationCreateType,
  removeReservation,
  updateBundleSelected,
  updateExtraServices,
  updatePayloadSearch
} from 'store/orion/Booking';
import { currencyFormatter, getCurrencySymbol } from 'utils/currency';
import { countingNights, dateFormat } from 'utils/dayjs';
import i18n from 'i18n';
interface Props {
  setCurrentCardRes: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}
const totalFunc = (
  exrtaService: ServiceDetailAppType[],
  voucher: number,
  numberOfNight: number
) => {
  const totalService = exrtaService?.reduce(
    (acc, cur) => acc + cur?.price * (cur?.count ?? 1) * numberOfNight,
    0
  );
  const totalVoucher = voucher;
  return {
    totalService,
    totalVoucher
  };
};
const ConfirmationResCard = ({ setCurrentCardRes, setCurrentStep }: Props) => {
  const { t } = useTranslation(['reservation', 'common']);
  const { currentView } = useView();
  const dispatch = useAppDispatch();
  const { reservations } = useAppSelector((state) => state.orion.booking);
  const currentLanguage = i18n.language;

  const sumaryCalculate = useMemo(() => {
    const amount = reservations?.map((res) => {
      const numberNights = countingNights(
        res?.payloadSearch?.arrival ?? 0,
        res?.payloadSearch?.departure ?? 0
      );
      const total = totalFunc(
        res?.extraServices,
        res?.vouchers?.voucherData?.value ?? 0,
        numberNights
      );
      return {
        totalVoucher: total.totalVoucher,
        totalRatePlan: res?.bundleSelected?.totalPrice,
        totalExtraService: total.totalService
      };
    });
    const amountBundle = amount.reduce((acc: any, cur: any) => {
      return acc + (cur.totalRatePlan + cur.totalExtraService);
    }, 0);
    const amountVoucher = amount.reduce((acc, cur) => acc + cur.totalVoucher, 0);
    const totalSumary = amountBundle - amountVoucher >= 0 ? amountBundle - amountVoucher : 0;

    return {
      amountBundle: amountBundle.toFixed(2),
      amountVoucher: amountVoucher.toFixed(2),
      totalSumary: totalSumary.toFixed(2)
    };
  }, [reservations]);

  const handleClickCard = (idx: number) => {
    setCurrentCardRes(idx);
    setCurrentStep(0);

    dispatch(updateBundleSelected(reservations[idx].bundleSelected));
    dispatch(updatePayloadSearch(reservations[idx].payloadSearch));
    dispatch(updateExtraServices(reservations[idx].extraServices));
  };
  const currencyInfo = useMemo(() => {
    return getCurrencySymbol('EUR');
  }, []);

  return (
    <div className="min-w-[300px] p-6 border border-l-gray-100 ">
      <div className=" px-2 ">
        <Typography.Title level={3}>{t('reservation:reservations')}</Typography.Title>
      </div>
      {reservations?.map((res: ReservationCreateType, idx) => {
        const arrival =
          res?.payloadSearch?.arrival && dateFormat(res.payloadSearch.arrival, 'MMM DD,YYYY');
        const departure =
          res?.payloadSearch?.departure && dateFormat(res.payloadSearch.departure, 'MMM DD,YYYY');
        const numberOfNight = dayjs(departure).diff(dayjs(arrival), 'day');
        const totalCard = currencyFormatter(
          (res?.bundleSelected?.totalPrice ?? 0) +
            totalFunc(res.extraServices, 0, numberOfNight).totalService,
          currencyInfo?.iso || 'EUR'
        );

        return (
          <Card className={clsx('flex flex-col px-2 py-4  mb-3')} key={idx}>
            <Space className="justify-between items-start">
              <Space direction="vertical">
                <Typography.Text className=" text-green-600">
                  {arrival} - {departure}
                </Typography.Text>
                <Typography.Text>
                  {currentView === ViewMode.Account ? `${res?.payloadSearch?.propertyId} / ` : ''}
                  {res?.bundleSelected?.name} / {numberOfNight} nights /{' '}
                  {res?.guests?.length ? res?.guests[0]?.firstName : ''}{' '}
                  {res?.guests?.length ? res?.guests[0]?.lastName : ''}{' '}
                  {`/ ${res?.extraServices?.map((i) => i?.extendedData?.name[currentLanguage])}`}
                </Typography.Text>
              </Space>
              <Popover
                placement="bottom"
                trigger="click"
                content={
                  <div className="flex flex-col gap-2 items-start">
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => {
                        handleClickCard(idx);
                      }}
                    >
                      {t('common:button.edit')}
                    </Button>
                    <Button
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => {
                        dispatch(removeReservation({ index: idx }));
                      }}
                    >
                      {t('common:button.remove')}
                    </Button>
                  </div>
                }
              >
                <div
                  className="w-5 h-5 cursor-pointer"
                  onClick={(event) => event.stopPropagation()}
                >
                  <EllipsisOutlined className=" rotate-90" />
                </div>
              </Popover>
            </Space>

            <Typography.Title level={5} className="text-right">
              {totalCard} {reservations[0]?.bundleSelected?.currency}
            </Typography.Title>
          </Card>
        );
      })}

      <Card className={clsx('px-2 ')}>
        <Typography.Title level={5}>Summary</Typography.Title>
        <div className="flex justify-between">
          <Typography.Text>Bundles & services</Typography.Text>
          <Typography.Text>
            {currencyFormatter(sumaryCalculate.amountBundle, currencyInfo?.iso || 'EUR')}
          </Typography.Text>
        </div>

        <div className="flex justify-between">
          <Typography.Text>Voucher</Typography.Text>
          <Typography.Text>
            - {currencyFormatter(sumaryCalculate.amountVoucher, currencyInfo?.iso || 'EUR')}
          </Typography.Text>
        </div>

        <div className="flex justify-between">
          <Typography.Title level={5}>Total</Typography.Title>
          <Typography.Text strong className="m-0">
            {currencyFormatter(sumaryCalculate.totalSumary, currencyInfo?.iso || 'EUR')}{' '}
            {reservations[0]?.bundleSelected?.currency}
          </Typography.Text>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmationResCard;
