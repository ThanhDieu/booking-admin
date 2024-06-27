/* eslint-disable @typescript-eslint/no-unused-vars */
import { DATE_FORMAT_1 } from 'configs/const/format';
import { A_THOUSAND } from 'configs/const/general';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { ReservationDetailAppType } from 'services/Reservation/type';
import { useAppSelector } from 'store';
import { ExtraService } from '..';
import { useTranslation } from 'react-i18next';

interface Props {
  reservationDetail: ReservationDetailAppType;
}
// type modeService = 'Departure' | 'Daily' | 'Arrival'
interface FormatServiceType {
  name: string;
  serviceId: string;
  originalPrice: number;
  overwritePrice: number;
  mode: string;
  description?: string;
  from: number;
  to: number;
}

const RatePlanExtras: React.FC<Props> = ({ reservationDetail }) => {
  const { detail: propertyDetail } = useAppSelector((state) => state.orion.property);
  const { t } = useTranslation("bundles")
  // groups
  const groupedServices = (dataList: FormatServiceType[]) => {
    if (!dataList) return [];

    const groupedTasksMap = new Map();
    const quantity = reservationDetail.data?.adults || 0;

    dataList.forEach((data: FormatServiceType) => {
      const key = `${data.serviceId}`;
      const date = {
        amount: {
          currency: propertyDetail?.currency || 'EUR',
          grossAmount: data.overwritePrice * quantity
        },
        count: quantity,
        serviceDate:
          data.mode === 'Arrival'
            ? dayjs(data.from * A_THOUSAND).format(DATE_FORMAT_1)
            : data.mode === 'Departure'
              ? dayjs(data.to * A_THOUSAND).format(DATE_FORMAT_1)
              : dayjs(data.from * A_THOUSAND).format(DATE_FORMAT_1)
      };

      const service = {
        description: data.description || '',
        id: data.serviceId,
        name: data.name,
        mode: data.mode,
        code: data.serviceId
      };

      const totalAmount = {
        currency: propertyDetail?.currency || 'EUR',
        grossAmount: data.overwritePrice * quantity
      };

      if (groupedTasksMap.has(key)) {
        const existingGroup = groupedTasksMap.get(key);
        if (existingGroup) {
          existingGroup.dates.push(date);
          existingGroup.totalAmount.grossAmount += data.overwritePrice * quantity;
        }
      } else {
        groupedTasksMap.set(key, {
          service,
          dates: [date],
          totalAmount
        });
      }
    });
    const groupedTasksArray = Array.from(groupedTasksMap.values());

    return groupedTasksArray;
  };

  const formatTimeSlices = useMemo(() => {
    const newServices = reservationDetail?.timeSliceDefinitions?.length
      ? reservationDetail.timeSliceDefinitions.map((timeSlices) =>
        timeSlices?.includedServices?.length
          ? timeSlices.includedServices.map((included) => {
            const { from, to, ...rest } = timeSlices;
            return {
              ...included,
              from,
              to
            };
          })
          : []
      )
      : [];
    const newServices2 = newServices?.length ? groupedServices(newServices.flat()) : [];

    return newServices2;
  }, [reservationDetail?.timeSliceDefinitions]);

  return (
    <ExtraService
      services={formatTimeSlices}
      reservationDetail={reservationDetail}
      content={{
        title: t('bundle_service'),
        description: t('des_extra_service'),
        subDescription: '',
        hideAction: true
      }}
    />
  );
};

export default RatePlanExtras;
