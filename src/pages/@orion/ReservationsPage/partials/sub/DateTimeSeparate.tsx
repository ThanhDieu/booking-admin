/* eslint-disable @typescript-eslint/no-explicit-any */
import { PeriodTime } from '@types';
import { DatePicker, Form, TimePicker } from 'antd';
import { DATE_FORMAT_1 } from 'configs/const/format';
import { A_THOUSAND } from 'configs/const/general';
import { paths } from 'constant';
import dayjs, { Dayjs } from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { convertCameltoSnake } from 'utils/text';

type InputProps = {
  name: string;
  required: boolean;
  type?: 'date' | 'time';
  disabled?: boolean;
};
interface Props {
  inputs: InputProps[];
  onChange?: (current: Dayjs | null, type: string) => void;
  detail?: PeriodTime;
  watchHook?: {
    fromSelected: any;
    toSelected: any;
  };
  formType?: string;
}

const DateTimeSeparate: React.FC<Props> = ({
  inputs,
  onChange: handleChange,
  detail,
  watchHook,
  formType
}) => {
  const { t } = useTranslation(['reservation']);
  const PERIOD = useMemo(() => {
    return inputs.filter((item) => item.type !== 'time').map((item) => item.name) ?? ['from', 'to'];
  }, [inputs]);

  const formatDate = (value: string | number | undefined) => {
    if (!value) return;
    if (typeof value === 'number') {
      return value * A_THOUSAND;
    }
    return value;
  };

  const disabledDate = (current: Dayjs, type: string) => {
    const startDate =
      type === PERIOD[0]
        ? dayjs(dayjs(formatDate(detail?.from)).format(DATE_FORMAT_1))
        : dayjs(dayjs(formatDate(detail?.from)).add(1, 'day').format(DATE_FORMAT_1));
    const targetDate =
      type === PERIOD[1]
        ? dayjs(dayjs(formatDate(detail?.to)).format(DATE_FORMAT_1))
        : dayjs(dayjs(formatDate(detail?.to)).subtract(1, 'day').format(DATE_FORMAT_1));

    const isDisabled =
      dayjs(current.format(DATE_FORMAT_1)).isBefore(startDate) ||
      dayjs(current.format(DATE_FORMAT_1)).isBefore(dayjs().format(DATE_FORMAT_1)) ||
      (type === PERIOD[1] &&
        watchHook?.fromSelected &&
        dayjs(current.format(DATE_FORMAT_1)).isSameOrBefore(
          dayjs(watchHook?.fromSelected).format(DATE_FORMAT_1)
        )) ||
      (type === PERIOD[0] &&
        watchHook?.toSelected &&
        dayjs(current.format(DATE_FORMAT_1)).isSameOrAfter(
          dayjs(watchHook?.toSelected).format(DATE_FORMAT_1)
        ));
    if (formType === paths.travelDates) {
      return isDisabled;
    }
    return isDisabled || dayjs(current.format(DATE_FORMAT_1)).isAfter(targetDate);
  };
  const renderItemContent = (item: InputProps) => {
    const label = convertCameltoSnake(item.name);
    return (
      <Form.Item
        className="flex-1"
        label={t(`reservation:${label}`)}
        name={item.name}
        key={item.name}
      >
        {item.type === 'time' ? (
          <TimePicker
            placeholder={t('reservation:select_time')}
            use12Hours
            format="h:mm a"
            disabled={item?.disabled}
          />
        ) : (
          <DatePicker
            className="w-full"
            disabledDate={(currentDate) => disabledDate(currentDate, item.name)}
            onChange={(current) => handleChange && handleChange(current, '')}
            disabled={item?.disabled}
          />
        )}
      </Form.Item>
    );
  };

  return <div className="flex gap-5">{inputs.map((input) => renderItemContent(input))}</div>;
};

export default DateTimeSeparate;
