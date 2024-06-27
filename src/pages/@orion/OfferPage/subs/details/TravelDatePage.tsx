/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimeSliceBookingType, TimeSliceType } from '@types';
import { Space, Typography } from 'antd';
import { GeneralReservationInfo } from 'components/common';
import { GeneralReservationInfoProps } from 'components/common/GeneralReservationInfo';
import XIcon from 'components/shared/Icon';
import { DATE_FORMAT_2 } from 'configs/const/format';
import { A_THOUSAND } from 'configs/const/general';
import dayjs from 'dayjs';
import { CurrentPeriodCard } from 'pages/@orion/ReservationsPage/partials';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatStringByLocale } from 'utils/format';
import { OfferDetailProps } from '../../index.types';
import { paths } from 'constant';
import { SPECIAL_NUMBER_DEFAULT } from 'constant/size';


const formatDay = (day: number | string | undefined) => {
  return day ? dayjs(Number(day) * A_THOUSAND).format(DATE_FORMAT_2) : '';
};

const TravelDatePage: React.FC<OfferDetailProps> = ({
  offerDetail
}) => {
  const { t, i18n } = useTranslation(['reservation', 'common']);

  const numberOfNights = useMemo(
    () => dayjs(offerDetail?.departure * A_THOUSAND).diff(offerDetail?.arrival * A_THOUSAND, 'day'),
    [offerDetail?.arrival, offerDetail?.departure]
  );
  const arrivalFormat = useMemo(
    () => formatDay(offerDetail?.arrival),
    [offerDetail?.arrival]
  );
  const departureFormat = useMemo(
    () => formatDay(offerDetail?.departure),
    [offerDetail?.departure]
  );

  const guest = useMemo(
    () => offerDetail?.offerBundleUpgrades?.reduce((total, current) => Number(total) + (Number(current?.count || 1) * (Number(current?.adults || 1) + Number(current?.children?.length || 0))), 0),
    [offerDetail?.offerBundleUpgrades]
  );

  const newSlices = useMemo(
    () => {
      return offerDetail?.offerBundleUpgrades?.length ? offerDetail?.offerBundleUpgrades?.map((offerBundle) => {
        return {
          to: offerDetail?.departure * A_THOUSAND,
          from: offerDetail?.arrival * A_THOUSAND,
          ratePlan: {
            name: formatStringByLocale(offerBundle?.bundleUpgrade?.bundle?.title, offerBundle?.bundleUpgrade?.bundle?.extendedData?.title, i18n?.language),
            extendedData: {
              link: `/${offerDetail?.property?.extId}/${paths.bundles}/${offerBundle?.bundleUpgrade?.bundle?.isNewsletter ? paths.bundlesNewsletter : paths.bundlesOverview
                }/${offerBundle?.bundleUpgrade?.bundle?.bundleId
                }`,
              rooms: offerBundle?.count || 1,
              guest: {
                adults: offerBundle?.adults || 1,
                children: offerBundle?.children?.length || 0
              }
            }
          },
          unit: {
            name: ''
          },
          unitGroup: {
            name: formatStringByLocale(offerBundle?.bundleUpgrade?.unitGroup?.name, offerBundle?.bundleUpgrade?.unitGroup?.extendedData?.name, i18n?.language)
          },
          totalGrossAmount: {
            amount: offerBundle?.bundleUpgrade?.initialPrice || 0,
            currency: offerDetail?.property?.currency
          }

        }
      }) as any : []
    },
    [offerDetail?.offerBundleUpgrades, offerDetail?.property, i18n?.language]
  );

  const itemsResShortInfo = useMemo(() => {

    return [
      {
        icon: <XIcon name="hotel" className=" text-xl" />,
        value: offerDetail?.property?.extId
      },
      {
        icon: <XIcon name="info" className=" text-xl" />,
        value: numberOfNights && numberOfNights >= 1 ? 'Over night' : 'Day use'
      },
      {
        icon: <XIcon name="userGroup" className=" text-xl" />,
        value: guest || 1
      },
      {
        icon: <XIcon name="calendar" className=" text-xl" />,
        value:
          arrivalFormat +
          ' - ' +
          departureFormat +
          ', ' +
          numberOfNights +
          ` ${t('common:general.nights')}`
      }
    ] as GeneralReservationInfoProps[];
  }, [offerDetail]);

  return (
    <Space direction="vertical" className="w-full">

      <section className="flex flex-col">
        <Typography.Title level={3}>{t('reservation:travel_information')}</Typography.Title>
        {itemsResShortInfo && <GeneralReservationInfo items={itemsResShortInfo} />}

        <Typography.Title className="mt-8" level={3}>
          {t('reservation:bundle_list')}
        </Typography.Title>

        <div className="grid grid-cols-4 ">
          {newSlices?.map((slice: TimeSliceType | TimeSliceBookingType, idx: number) => (
            <CurrentPeriodCard key={idx} slice={slice as TimeSliceType} idx={SPECIAL_NUMBER_DEFAULT} />
          ))}
        </div>
      </section>

    </Space>
  );
};

export default TravelDatePage;
