import {
  Col,
  Form,
  FormInstance,
  FormListFieldData,
  InputNumber,
  Select,
  Tabs,
  Typography
} from 'antd';
import { CommonPickerMethods, RangePickerRef } from 'antd/es/date-picker/generatePicker/interface';
import { useWatch } from 'antd/es/form/Form';
import clsx from 'clsx';
import { FuncType } from 'configs/const/general';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InitialBundleType } from '../../../types';
import PeriodItem from './PeriodItem';
import { bundleDayOption } from 'configs/const/select';
import debounce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';
import { countConsecutiveDaysFunc } from 'utils/dayjs';
import { useLocation } from 'react-router-dom';
import { paths } from 'constant';

const { Text } = Typography;
export type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

export interface PeriodsProps {
  pageAction: (typeof FuncType)[keyof typeof FuncType];
  form: FormInstance<InitialBundleType>;
  onSelectedPeriod: React.Dispatch<
    React.SetStateAction<
      | {
          start: number;
          end: number;
        }
      | undefined
    >
  >;
}

export default function Periods({
  pageAction,
  form,
  onSelectedPeriod: handleSelectedPeriod
}: PeriodsProps) {
  const { t } = useTranslation(['bundles']);
  const datePickerRef = useRef<unknown>(null);
  const periodsWatcher = useWatch<Dayjs[][]>('periods', form) || [];
  const dayOfWeekWatcher = useWatch<string[]>('days_of_week', form) || [];
  const [activeKey, setActiveKey] = useState<string>('0');

  const currentTypeBundle = useLocation().pathname.split('/')[3];

  const handleTabChange = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  useEffect(() => {
    const mappedPeriod = periodsWatcher?.find((value, index) => {
      if (value) return index === Number(activeKey);
    });

    if (mappedPeriod && mappedPeriod.length) {
      const [start_date, end_date] = mappedPeriod.map((value: Dayjs) => {
        return dayjs(value).unix();
      });

      handleSelectedPeriod({
        start: start_date,
        end: end_date
      });
    }
  }, [activeKey, periodsWatcher]);

  const countConsecutiveDay = useMemo(() => {
    const countMin = dayOfWeekWatcher.length ? countConsecutiveDaysFunc(dayOfWeekWatcher).min : 0;
    const countMax = dayOfWeekWatcher.length ? countConsecutiveDaysFunc(dayOfWeekWatcher).max : 0;

    return { countMin, countMax };
  }, [dayOfWeekWatcher]);

  return (
    <>
      <Col span={24}>
        <Text className="inline-block font-medium mb-2 label-period-valid">
          {currentTypeBundle === paths.bundlesNewsletter
            ? t('bundles:period')
            : t('bundles:periods')}
        </Text>
      </Col>

      {/* Multiple periods */}
      <Col span={24}>
        <Form.List name={'periods'}>
          {(fields, { add, remove }, { errors }) => {
            const hasEmptyPeriod = periodsWatcher?.some((value) => !value || !value.length);

            const handleAdd = debounce((value?: Dayjs[]) => {
              add(value);
              setActiveKey(`${fields.length}`);
            }, 100);

            const handleRemove = debounce((targetKey: TargetKey) => {
              //? Set active key
              const targetIndex = fields?.findIndex((pane) => pane.name === Number(targetKey));
              const filteredPanes = fields?.filter((pane) => pane.name !== Number(targetKey));
              if (filteredPanes.length && targetKey === activeKey) {
                const { name } =
                  filteredPanes[
                    targetIndex === filteredPanes.length ? targetIndex - 1 : targetIndex
                  ];
                setActiveKey(`${name}`);
              } else if (Number(activeKey) === filteredPanes.length) {
                setActiveKey(`${filteredPanes.length - 1}`);
              }

              //? Reset base
              const foundPeriod = periodsWatcher[Number(targetKey)];
              if (foundPeriod && foundPeriod.length)
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

              remove(Number(targetKey));
            }, 100);

            return (
              <>
                <Tabs
                  size="small"
                  type="editable-card"
                  className={clsx(`bundle-periods-tabs-custom`, {
                    ['hasError']: errors && errors.length
                  })}
                  onChange={handleTabChange}
                  activeKey={activeKey}
                  onEdit={(targetKey, action) => {
                    if (action === 'add') {
                      if (hasEmptyPeriod) (datePickerRef.current as CommonPickerMethods).focus();
                      else handleAdd();
                    } else handleRemove(targetKey);
                  }}
                  hideAdd={
                    pageAction === FuncType.UPDATE || currentTypeBundle === paths.bundlesNewsletter
                  }
                  tabBarGutter={12}
                  items={fields?.map((field: FormListFieldData) => {
                    return {
                      key: `${field.name}`,
                      closeIcon:
                        (!field.name && !(periodsWatcher.length > 1)) ||
                        pageAction === FuncType.UPDATE,
                      label: (
                        <PeriodItem
                          currentTypeBundle={currentTypeBundle}
                          datePickerRef={datePickerRef as RangePickerRef<Dayjs>}
                          form={form}
                          pageAction={pageAction}
                          field={field}
                          onActiveKey={(value: string) => setActiveKey(value)}
                          onRemove={handleRemove}
                        />
                      )
                    };
                  })}
                  destroyInactiveTabPane
                />
              </>
            );
          }}
        </Form.List>
      </Col>

      {currentTypeBundle !== paths.bundlesNewsletter && (
        <>
          {/* Day of week */}{' '}
          <Col span={12}>
            <Form.Item
              name="days_of_week"
              label={t('bundles:day_of_weeks')}
              rules={[
                {
                  validator(_, value) {
                    if (countConsecutiveDay.countMin < 1 || !value) {
                      return Promise.reject(new Error(t('bundles:please_choose_consecutive_days')));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Select
                mode="multiple"
                placeholder={t('bundles:please_select_special_day')}
                maxTagCount={'responsive'}
                options={bundleDayOption.map((day) => {
                  return { ...day, label: t('common:days_of_week.' + day.value.toLowerCase()) };
                })}
                removeIcon={pageAction !== FuncType.UPDATE && undefined}
                showSearch={pageAction !== FuncType.UPDATE}
                showArrow={pageAction !== FuncType.UPDATE && undefined}
                open={pageAction !== FuncType.UPDATE && undefined}
              />
            </Form.Item>
          </Col>
          <Col span={12}></Col>
          {/* Minimum stay */}
          <Col span={4}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.days_of_week !== currentValues.days_of_week
              }
            >
              {() => {
                return (
                  <Form.Item
                    id="stay"
                    name="minimum_stay"
                    label={t('bundles:minimum_stay')}
                    rules={[
                      { required: true, message: t('common:form.please_enter_this_field') },
                      {
                        type: 'number',
                        min: 1,
                        message: `${t('bundles:minimum_stay')} must be at least 1 night`
                      },
                      {
                        type: 'number',
                        max:
                          countConsecutiveDay.countMin < 7
                            ? countConsecutiveDay.countMin
                            : undefined,
                        message: `${t('bundles:minimum_stay')} must NOT be larger than ${
                          countConsecutiveDay.countMin
                        } nights`
                      }
                    ]}
                  >
                    <InputNumber
                      keyboard
                      className="w-full"
                      readOnly={pageAction === FuncType.UPDATE}
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </Col>
          {/* Maximum stay */}
          <Col span={4}>
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.minimum_stay !== currentValues.minimum_stay ||
                prevValues.days_of_week !== currentValues.days_of_week
              }
            >
              {({ getFieldValue }) => {
                return (
                  <Form.Item
                    id="stay"
                    name="maximum_stay"
                    label={t('bundles:maximum_stay')}
                    rules={[
                      { required: true, message: t('common:form.please_enter_this_field') },
                      {
                        type: 'number',
                        min: getFieldValue('minimum_stay'),
                        message: `${t(
                          'bundles:maximum_stay'
                        )} must be equal or larger than ${getFieldValue('minimum_stay')}`
                      },
                      {
                        type: 'number',
                        max:
                          countConsecutiveDay.countMax < 7
                            ? countConsecutiveDay.countMax
                            : undefined,
                        message: `${t('bundles:maximum_stay')} must NOT be larger than ${
                          countConsecutiveDay.countMax
                        } nights`
                      }
                    ]}
                  >
                    <InputNumber
                      keyboard
                      className="w-full"
                      readOnly={pageAction === FuncType.UPDATE}
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
          </Col>
        </>
      )}
    </>
  );
}
