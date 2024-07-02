/* eslint-disable @typescript-eslint/no-explicit-any */
import { DatePicker, Form } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { DATE_FORMAT_1 } from 'configs/const/format';
import { whenList } from 'configs/const/general';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { ReservationDetailAppType } from 'services/Reservation/type';

interface Props {
  form: any;
  detail?: ReservationDetailAppType;
  disabled?: boolean;
  rangeAvailableDates?: string[];
}
const DatePickerWhen: React.FC<Props> = ({ detail, form, disabled, rangeAvailableDates = [] }) => {
  const serviceSelected = useWatch('serviceId', form);
  const whenSelected = useWatch('when', form);
  const dateService = useMemo(() => {
    return detail?.data?.services?.length
      ? detail?.data?.services.find((service) => service.service.id === serviceSelected)?.dates
      : [];
  }, [serviceSelected]);

  const isExcludedDate = (current: any) => {
    const formattedDate = current.format(DATE_FORMAT_1);
    return dateService?.map((item) => item?.serviceDate).includes(formattedDate);
  };

  const disabledDate = (current: any) => {
    const date = dayjs(current);
    const currentDate = dayjs(dayjs(detail?.data?.arrival).format(DATE_FORMAT_1));
    const targetDate = dayjs(dayjs(detail?.data?.departure).format(DATE_FORMAT_1));
    return (
      (rangeAvailableDates.includes(date.format(DATE_FORMAT_1)) && isExcludedDate(date)) ||
      dayjs(current.format(DATE_FORMAT_1)).isBefore(currentDate) ||
      dayjs(current.format(DATE_FORMAT_1)).isBefore(dayjs().format(DATE_FORMAT_1)) ||
      dayjs(current.format(DATE_FORMAT_1)).isAfter(targetDate)
    );
  };

  const renderFormItemByWhen = () => {
    switch (whenSelected) {
      case whenList[1]:
        return (
          <Form.Item label="Date" name="date" rules={[{ required: true }]}>
            <DatePicker
              className="w-full"
              disabledDate={disabledDate}
              disabled={disabled}
              defaultPickerValue={dayjs(detail?.data?.arrival)}
            />
          </Form.Item>
        );

      case whenList[2]:
        return (
          <Form.Item
            label="Start date - End date"
            name="period"
            rules={[{ required: true, message: 'Please pick a period' }]}
          >
            <DatePicker.RangePicker
              disabledDate={disabledDate}
              className="w-full"
              defaultPickerValue={[dayjs(detail?.data?.arrival), dayjs(detail?.data?.departure)]}
            />
          </Form.Item>
        );
      default:
        return <></>;
    }
  };

  return renderFormItemByWhen();
};

export default DatePickerWhen;
