/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoadingOutlined } from '@ant-design/icons';
import { Col, Form, FormListFieldData, InputNumber, Select, SelectProps, Spin } from 'antd';
import { FuncType } from 'configs/const/general';
import { useAsyncAction, useDetailDisplay } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRateByDayService } from 'services/RatePlan';
import { RateByDayType } from 'services/RatePlan/type';
import { UnitGroupDetailAppType } from 'services/UnitGroups/type';
import { currencyFormatter, currencyParser, getCurrencySymbol } from 'utils/currency';
import { CalculationPartialProps } from '..';
import { calculatePrice } from '../../../helper';
import { InitBaseType } from '../../../types';
import { MAXIMUM_DISCOUNT_DEFAULT } from 'constant/size';

function UnitGroupItem({
  variant,
  pageAction,
  form,
  field,
  fields,
  watchHook = [],
  dependence = [],
  data: unitGroups,
  loading
}: CalculationPartialProps<UnitGroupDetailAppType[]>) {
  const { t, i18n } = useTranslation(['bundles', 'common']);
  const currentLanguage = i18n.language;

  //* Declare variable global
  const { name } = field as FormListFieldData;
  const [itemSelected] = watchHook as InitBaseType[][];
  const [period, baseRank, upgradeRank] = dependence;
  const baseWatcher = Form.useWatch<InitBaseType[]>('base', form);
  const currencyWatcher = Form.useWatch('currency', form);
  const currencyInfo = useMemo(() => {
    return getCurrencySymbol(currencyWatcher);
  }, [currencyWatcher]);

  const { start_date } = useMemo(() => {
    const start_date = period?.start || '';
    const end_date = period?.end || '';

    return {
      start_date: start_date,
      end_date: end_date
    };
  }, [period]);

  //* End declare variable global

  //* Handle api service
  // Action
  /**
   * @param ratePlanIds
   * @param propertyId
   * @param from
   * @param to
   */
  const [fetchRates, stateRates] = useAsyncAction(getRateByDayService);
  const rateData = useDetailDisplay<RateByDayType>(stateRates);
  useEffect(() => {
    if (itemSelected && itemSelected.length && itemSelected[name]?.rate_plan) {
      fetchRates(`${itemSelected[name]?.rate_plan}`, start_date);
    }
  }, [start_date, itemSelected && itemSelected.length && itemSelected[name]?.rate_plan]);
  //* End handle api service

  //* Handle component
  const handleChangeCategory = (value?: number) => {
    form.setFieldValue([variant, name, 'category'], value);
  };
  const [limit, setLimit] = useState<{ minimumPrice: number; maximumDiscount: number }>({
    minimumPrice: 0,
    maximumDiscount: 0
  });
  const handleChangeUnitGroup = (value: string) => {
    const foundUnitGroup = unitGroups?.find((item) => item?.extId === value);
    if (foundUnitGroup) {
      form.setFieldValue([variant, name, 'unit_group'], value);
      form.setFieldValue([variant, name, 'rate_plan'], foundUnitGroup?.ratePlans[0]?.extId);

      setLimit({
        minimumPrice: foundUnitGroup.minimumPrice || 0,
        maximumDiscount: foundUnitGroup.maximumDiscount ?? 0
      });
      if (variant === 'base') {
        form.setFieldValue('upgrade', undefined);
      }
    }
  };
  const handleChangeRatePlan = (name: string) => {
    form.setFieldValue([variant, name, 'rate_plan'], name);
  };
  const handleChangeValueOverwrite = (value?: any) => {
    if (value) {
      const calculatedValue = calculatePrice(
        form.getFieldValue([variant, name, 'standard']) || 0,
        value
      );
      form.setFieldValue([variant, name, 'discount'], calculatedValue);
      form.setFieldValue([variant, name, 'price'], value);
    }
  };

  const handleChangeValueDiscount = (value?: number | null) => {
    const calculatedValue = calculatePrice(
      form.getFieldValue([variant, name, 'standard']) || 0,
      undefined,
      value ?? 0
    );
    form.setFieldValue([variant, name, 'overwrite'], calculatedValue);
    form.setFieldValue([variant, name, 'price'], calculatedValue);
  };
  //* End handle component

  //*  Handle form
  const checkUniCategory = (value: number) => {
    if (value) {
      const unique = itemSelected?.filter((item: any) => item?.category === value);
      if (unique?.length === 1) {
        return Promise.resolve();
      }
      return Promise.reject(new Error(t('bundles:category_same')));
    }
    return Promise.reject(new Error(t('common:form.please_enter_this_field')));
  };

  useEffect(() => {
    if (rateData && variant && pageAction !== FuncType.UPDATE) {
      form.setFieldValue('currency', rateData.currency);
      form.setFieldValue([variant, name], {
        ...form.getFieldValue([variant, name]),
        standard: rateData.price,
        overwrite: rateData.price,
        discount: 0,
        price: rateData.price
      });
    }
  }, [rateData, variant, pageAction]);
  //* End handle form

  //* Handle interface
  // Declare options
  const unitGroupsOptions: SelectProps['options'] = useMemo(() => {
    if (itemSelected && unitGroups && baseWatcher) {
      const options =
        variant === 'base'
          ? unitGroups
          : unitGroups?.filter(
              (unitGroup) =>
                baseWatcher &&
                unitGroup?.extId !== baseWatcher[0]?.unit_group &&
                unitGroup?.rank &&
                unitGroup?.rank >= baseRank
            );

      return options
        ?.sort((a, b) => (a.rank || 0) - (b.rank || 0))
        ?.map((value) => ({
          label: value?.extendedData?.name[currentLanguage] ?? value?.name,
          value: value?.extId,
          disabled:
            variant === 'upgrade' &&
            (itemSelected?.some((item: InitBaseType) => item?.unit_group === value?.extId) ||
              upgradeRank?.some((i: number) => value?.rank && i >= value?.rank))
        }));
    }
  }, [itemSelected, unitGroups, baseRank, baseWatcher, currentLanguage]);

  const ratePlansOptions: SelectProps['options'] = useMemo(() => {
    if (itemSelected && unitGroups) {
      const unitGroupSelectedData = unitGroups?.find(
        (unit_group) => unit_group?.extId === itemSelected[name]?.unit_group
      );

      return unitGroupSelectedData?.ratePlans?.map((value) => ({
        label: value?.extendedData?.name[currentLanguage] ?? value?.name,
        value: value?.extId
      }));
    }
  }, [itemSelected, unitGroups]);
  //* End handle interface

  const disableSelectionCondition =
    pageAction !== FuncType.UPDATE && pageAction !== FuncType.READ && undefined;

  const minimumPrice =
    limit?.minimumPrice !== 0
      ? limit?.minimumPrice
      : Number(form.getFieldValue(variant)[name]?.standard || 0) * 0.3; //minimum price default will be 70% discount
  const maximumDiscount =
    limit?.maximumDiscount !== 0 ? limit?.maximumDiscount : MAXIMUM_DISCOUNT_DEFAULT;
  if (variant === 'services_include') return <></>;
  return (
    <>
      {variant === 'upgrade' ? (
        <Col span={4}>
          <Form.Item
            label={t('bundles:category')}
            name={[name, 'category']}
            rules={[{ validator: (_, value) => checkUniCategory(value) }]}
            dependencies={fields?.map((item) => [variant, item.name, 'category'])}
          >
            <InputNumber
              className="w-auto"
              min={1}
              maxLength={1}
              onChange={(value) => handleChangeCategory(value || undefined)}
              readOnly
            />
          </Form.Item>
        </Col>
      ) : null}
      <Col span={8}>
        <Form.Item
          label={t('bundles:unit_group')}
          name={[name, 'unit_group']}
          rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
        >
          <Select
            loading={loading}
            options={unitGroupsOptions}
            placeholder={t('bundles:placeholder_unit_group')}
            showSearch={disableSelectionCondition}
            showArrow={disableSelectionCondition}
            allowClear={disableSelectionCondition}
            open={disableSelectionCondition}
            onChange={handleChangeUnitGroup}
          />
        </Form.Item>
      </Col>
      <Col span={12}></Col>
      <Col span={8}>
        <Form.Item
          label={t('bundles:rate_plan')}
          name={[name, 'rate_plan']}
          rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
        >
          <Select
            options={ratePlansOptions}
            onChange={handleChangeRatePlan}
            showSearch={disableSelectionCondition}
            showArrow={disableSelectionCondition}
            open={disableSelectionCondition}
          />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item label={t('bundles:standard')} name={[name, 'standard']} className={'item-pricing'}>
          <InputNumber
            className="w-auto"
            addonAfter={
              stateRates.loading ? (
                <Spin indicator={<LoadingOutlined className="text-[8px]" spin />} />
              ) : (
                currencyInfo?.symbol || '€'
              )
            }
            controls={false}
            min={0}
            maxLength={8}
            formatter={(value) => value && currencyFormatter(value, currencyInfo?.iso || 'EUR')}
            parser={currencyParser}
            readOnly
          />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.discount !== currentValues.discount
          }
        >
          {() => (
            <Form.Item
              label={t('bundles:overwrite')}
              name={[name, 'overwrite']}
              className={'item-pricing'}
              help={`Minimum price ${minimumPrice.toFixed(2)}${currencyInfo?.symbol || '€'}`}
              rules={[
                {
                  type: 'number',
                  min: Number(minimumPrice)
                }
              ]}
              dependencies={[[variant, name, 'discount']]}
            >
              <InputNumber
                className="w-auto"
                addonAfter={
                  stateRates.loading ? (
                    <Spin indicator={<LoadingOutlined className="text-[8px]" spin />} />
                  ) : (
                    currencyInfo?.symbol || '€'
                  )
                }
                controls={false}
                maxLength={8}
                readOnly={
                  pageAction === FuncType.UPDATE ||
                  pageAction === FuncType.READ ||
                  !form.getFieldValue(variant)[name]?.standard
                }
                formatter={(value) =>
                  value ? currencyFormatter(value, currencyInfo?.iso || 'EUR') : ''
                }
                parser={currencyParser}
                onChange={handleChangeValueOverwrite}
              />
            </Form.Item>
          )}
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.overwrite !== currentValues.overwrite
          }
        >
          {() => (
            <Form.Item
              label={t('bundles:discount')}
              name={[name, 'discount']}
              className={'item-pricing'}
              help={`Maximum discount ${maximumDiscount.toFixed(0)} %`}
              rules={[
                {
                  type: 'number',
                  max: maximumDiscount
                }
              ]}
              dependencies={[[variant, name, 'overwrite']]}
            >
              <InputNumber
                className="w-auto"
                addonAfter={
                  stateRates.loading ? (
                    <Spin indicator={<LoadingOutlined className="text-[11px]" spin />} />
                  ) : (
                    '%'
                  )
                }
                controls={false}
                min={0}
                maxLength={2}
                readOnly={
                  pageAction === FuncType.UPDATE ||
                  pageAction === FuncType.READ ||
                  !form.getFieldValue(variant)[name]?.standard
                }
                formatter={(value) => (value && value < 0 ? `0` : `${value}`)}
                onChange={handleChangeValueDiscount}
              />
            </Form.Item>
          )}
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          label={t('bundles:price')}
          name={[name, 'price']}
          className={'item-pricing'}
          rules={[
            {
              type: 'number',
              min: baseWatcher && baseWatcher[0]?.price ? baseWatcher[0]?.price : 0,
              message: `Price must be higher than base price`
            }
          ]}
          dependencies={[variant, name, 'unit_group']}
        >
          <InputNumber
            min={1}
            readOnly
            addonAfter={
              stateRates.loading ? (
                <Spin indicator={<LoadingOutlined className="text-[8px]" spin />} />
              ) : (
                currencyInfo?.symbol || '€'
              )
            }
            maxLength={8}
            formatter={(value) => value && currencyFormatter(value, currencyInfo?.iso || 'EUR')}
            parser={currencyParser}
          />
        </Form.Item>
      </Col>
    </>
  );
}

export default UnitGroupItem;
