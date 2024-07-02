import { SwapRightOutlined } from '@ant-design/icons';
import { DatePicker, Form, FormInstance, FormListFieldData, Typography } from 'antd';
import { RangePickerRef } from 'antd/es/date-picker/generatePicker/interface';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InitialBundleType } from '../../../types';
import { TargetKey } from '.';
import { FuncType } from 'configs/const/general';
import { paths } from 'constant';
const { Text } = Typography;

export interface PeriodItemProps {
  datePickerRef: RangePickerRef<dayjs.Dayjs>;
  pageAction: (typeof FuncType)[keyof typeof FuncType];
  form: FormInstance<InitialBundleType>;
  field: FormListFieldData;
  onActiveKey: (value: string) => void;
  onRemove: (targetKey: TargetKey) => void;
  currentTypeBundle: string;
}

export default function PeriodItem({
  datePickerRef,
  form,
  field,
  currentTypeBundle,
  onActiveKey: handleActiveKey,
  onRemove: handleRemove,
  pageAction
}: PeriodItemProps) {
  const { t } = useTranslation(['common']);
  const [isChoosing, setIsChoosing] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const periodsWatcher = Form.useWatch('periods', form);
  const currentPeriod = useMemo(() => {
    if (periodsWatcher && periodsWatcher.length) {
      return periodsWatcher[field.name];
    }
  }, [periodsWatcher]);

  //* Handle interface
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (periodsWatcher?.length && periodsWatcher?.length > 1 && !currentPeriod && !isChoosing) {
      timeoutId = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      if (countdown === 0) {
        handleRemove(`${field.name}`);
      }
    }

    return () => {
      clearInterval(timeoutId);
    };
  }, [periodsWatcher, currentPeriod, isChoosing, countdown]);

  const handleOpenChange = (open: boolean) => {
    setIsChoosing(open);

    if (!open && currentPeriod && periodsWatcher && periodsWatcher.length) {
      const [currentStart, currentEnd] = currentPeriod;

      const handleFilterPeriods = (sPoint: dayjs.Dayjs, ePoint: dayjs.Dayjs) => {
        const result = periodsWatcher?.filter((periodItem) => {
          if (periodItem && periodItem.length) {
            const [start, itemEnd] = periodItem;
            return !(
              start?.isSameOrAfter(sPoint, 'date') && itemEnd?.isSameOrBefore(ePoint, 'date')
            );
          }
        });

        form.setFieldValue('periods', [...result, [sPoint, ePoint]]);
        handleActiveKey(`${form.getFieldValue('periods').length - 1}`);
      };

      const periodFilteredSameOrBetween = periodsWatcher?.filter((period) => {
        if (period && period.length) {
          const [start, end] = period;

          return (
            start?.isSameOrBefore(currentStart, 'date') && end?.isSameOrAfter(currentEnd, 'date')
          );
        }
      });

      if (periodFilteredSameOrBetween.length > 1) {
        // Current period have the same time or belong completely
        handleRemove(`${field.name}`);
      } else {
        periodsWatcher?.forEach((period, index) => {
          /**
           * A = start period
           * B = end period
           * C = current start period
           * D = current end period
           */

          if (period && period.length) {
            const [start, end] = period;
            // C -- (A - B) -- D
            if (start?.isAfter(currentStart, 'date') && end?.isBefore(currentEnd, 'date'))
              handleRemove(index.toString());
            // C = A &  D > B
            else if (start?.isSame(currentStart, 'date') && end?.isBefore(currentEnd, 'date'))
              handleRemove(index.toString());
            // A > C &  B = D
            else if (start?.isAfter(currentStart, 'date') && end?.isSame(currentEnd, 'date'))
              handleRemove(index.toString());
            // A > C & B > D
            else if (start?.isBefore(currentEnd, 'date') && start?.isAfter(currentStart, 'date'))
              handleFilterPeriods(currentStart, end);
            // C > A & D > B
            else if (end?.isBefore(currentEnd, 'date') && end?.isAfter(currentStart, 'date'))
              handleFilterPeriods(start, currentEnd);
          }
        });

        //? Reset base
        form.setFieldValue('base', [
          {
            unit_group: undefined,
            rate_plan: '',
            standard: 0,
            overwrite: 0,
            discount: 0,
            price: 0
          }
        ]);
      }
    }
  };

  const renderCountdown = useMemo(() => {
    if (periodsWatcher && periodsWatcher.length && periodsWatcher.length > 1) {
      if (field.name === periodsWatcher.length - 1 && !periodsWatcher[field.name] && !isChoosing) {
        return <span className="absolute right-8 text-[#faad14]">{countdown}</span>;
      }
    }
  }, [periodsWatcher, isChoosing, countdown]);
  //* End handle interface

  const renderPeriodString = useMemo(() => {
    if (currentPeriod && currentPeriod.length) {
      return (
        <div className={'date-range-text-value w-[13rem]'}>
          <Text>{dayjs(currentPeriod[0])?.format('MM/DD/YYYY')}</Text>
          <SwapRightOutlined className="px-2 mr-0 text-base text-[rgba(0,0,0,0.25)]" />
          <Text>{dayjs(currentPeriod[1])?.format('MM/DD/YYYY')}</Text>
        </div>
      );
    }
  }, [currentPeriod]);

  return (
    <>
      <Form.Item noStyle name={field?.name} rules={[{ required: true }]}>
        <DatePicker.RangePicker
          ref={datePickerRef}
          className={clsx('w-[13rem]', {
            ['hidden']:
              currentPeriod &&
              currentPeriod.length &&
              (currentTypeBundle !== paths.bundlesNewsletter || pageAction === FuncType.UPDATE)
          })}
          onChange={() => form.validateFields(['periods'])}
          onOpenChange={handleOpenChange}
          presets={[
            {
              label: `${t('common:general.next')} 7 Days`,
              value: [dayjs().add(1, 'd'), dayjs().add(7, 'd')]
            },
            {
              label: `${t('common:general.next')} 14 Days`,
              value: [dayjs().add(1, 'd'), dayjs().add(14, 'd')]
            },
            {
              label: `${t('common:general.next')} 30 Days`,
              value: [dayjs().add(1, 'd'), dayjs().add(30, 'd')]
            },
            {
              label: `${t('common:general.next')} 90 Days`,
              value: [dayjs().add(1, 'd'), dayjs().add(90, 'd')]
            },
            {
              label: `${t('common:general.next')} 180 Days`,
              value: [dayjs().add(1, 'd'), dayjs().add(180, 'd')]
            },
            {
              label: `${t('common:general.next')} 1 Years`,
              value: [dayjs().add(1, 'd'), dayjs().add(1, 'y')]
            }
          ]}
          disabledDate={(current) => current && current < dayjs().endOf('date')}
          format={'MM/DD/YYYY'}
          size="small"
          clearIcon={false}
          bordered={false}
          suffixIcon={false}
          allowClear
          placeholder={
            currentTypeBundle === paths.bundlesNewsletter
              ? ['Arrival', 'Departure']
              : ['Start date', 'End date']
          }
        />
      </Form.Item>

      {renderCountdown}
      {(currentTypeBundle !== paths.bundlesNewsletter || pageAction === FuncType.UPDATE) &&
        renderPeriodString}
    </>
  );
}
