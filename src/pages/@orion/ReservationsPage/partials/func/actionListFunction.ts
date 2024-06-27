import { DATE_FORMAT_1 } from 'configs/const/format';
import { actionReservationType, statusReservationType } from 'configs/const/general';
import dayjs from 'dayjs';
import { ReservationDetailAppType } from 'services/Reservation/type';

const actionListFunction = (record: ReservationDetailAppType) => {
  const newActions = record?.data?.actions?.filter((item) => {
    const isCheckDateStart = dayjs(dayjs().format(DATE_FORMAT_1)).isSameOrAfter(
      dayjs(dayjs(record?.data?.arrival).format(DATE_FORMAT_1))
    );

    return (
      Object.values(actionReservationType).some(
        (value) => item.action === value && item.isAllowed
      ) ||
      (record.data?.status === statusReservationType.Confirmed &&
        isCheckDateStart &&
        item.action === actionReservationType.CheckIn) ||
      (record.data?.status === statusReservationType.InHouse &&
        isCheckDateStart &&
        item.action === actionReservationType.CheckOut)
    );
  });
  return newActions;
};
export default actionListFunction;
