/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Typography, DatePicker } from 'antd';
import React from 'react';
import {
  DoubleLeftOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface Props {
  dateFormat: string;
  startDate: dayjs.Dayjs;
  setStartDate: (value: React.SetStateAction<dayjs.Dayjs>) => void;
  className?: string;
}

const DatePickerComponent = ({ startDate, setStartDate, dateFormat, className }: Props) => {
  const { t } = useTranslation(['common'])
  return (
    <div className={clsx('flex items-center justify-end gap-4', className)}>
      <Button type="primary" onClick={() => setStartDate(dayjs())}>
        {t('common:general.today')}
      </Button>
      <div className="flex items-center gap-2">
        <Typography.Text>{t('common:table.from')}:</Typography.Text>
        <DoubleLeftOutlined onClick={() => setStartDate((prev: any) => prev.subtract(9, 'day'))} />
        <LeftOutlined onClick={() => setStartDate((prev: any) => prev.subtract(1, 'day'))} />
        <DatePicker
          defaultValue={startDate}
          format={dateFormat}
          value={startDate}
          onChange={(date: any) => setStartDate(date)}
          placeholder={`${t('common:general.placeholder_select_start_date')}:`}
          className="w-[160px]"
        />
        <RightOutlined onClick={() => setStartDate((prev: any) => prev.add(1, 'day'))} />
        <DoubleRightOutlined onClick={() => setStartDate((prev: any) => prev.add(9, 'day'))} />
      </div>
    </div>
  );
};

export default DatePickerComponent;
