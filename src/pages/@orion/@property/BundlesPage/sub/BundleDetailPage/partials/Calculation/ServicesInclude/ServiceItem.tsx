/* eslint-disable @typescript-eslint/no-explicit-any */
import { EllipsisOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormListFieldData, InputNumber, Select, Spin } from 'antd';
import { SelectProps } from 'antd/es/select';
import clsx from 'clsx';
import { FuncType } from 'configs/const/general';
import { useMemo } from 'react';
import { ServiceDetailAppType } from 'services/ServiceList/type';
import { currencies, currencyFormatter, currencyParser } from 'utils/currency';
import { CalculationPartialProps } from '..';
import { calculatePrice } from '../../../helper';
import { InitServiceType } from '../../../types';
import { useTranslation } from 'react-i18next';
import { MAXIMUM_DISCOUNT_DEFAULT } from 'constant/size';

function ServiceItem({
  variant,
  form,
  field,
  pageAction,
  watchHook,
  data: services,
  loading,
  dataLength,
  onLoadMore: handleLoadMore
}: CalculationPartialProps<ServiceDetailAppType[]>) {
  //* Declare variable global
  const { name, ...restField } = field as FormListFieldData;
  const [servicesIncludeWatcher] = watchHook as InitServiceType[][];
  const { t, i18n } = useTranslation(['common', 'bundles']);
  const currentLanguage = i18n.language;

  const currencyWatcher = Form.useWatch('currency', form);
  const currencyInfo = useMemo(() => {
    const found = currencies?.find((value) => value.iso === currencyWatcher);
    if (found) return found;
    else
      return {
        name: 'European Euro',
        symbol: '€',
        iso: 'EUR',
        locale: 'de-DE'
      };
  }, [currencyWatcher]);
  //* End declare variable global

  const serviceInfo = useMemo(() => {
    const foundService = services?.find(
      (item) => item?.extId === servicesIncludeWatcher[name].title
    );
    return foundService?.mode;
  }, [servicesIncludeWatcher]);

  //* Handle component
  const handleChangeService = (value: string) => {
    const foundService = services?.find((item) => item?.extId === value);

    if (foundService) {
      form.setFieldValue([variant, name], {
        title: value,
        standard: foundService?.price,
        overwrite: foundService?.price,
        discount: 0,
        price: foundService?.price
      });
    }
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

  //* Handle interface
  // Declare options
  const servicesOptions: SelectProps['options'] = useMemo(() => {
    const options = services
      ?.filter((service) =>
        servicesIncludeWatcher?.every((field: any) => field?.title !== service?.extId)
      )
      ?.map((item) => item?.extId);

    return services?.map((value) => ({
      label: value?.extendedData?.name[currentLanguage] ?? value?.name,
      value: value?.extId,
      disabled: !options?.includes(value?.extId) || value.disabled,
      className: !options?.includes(value?.extId) ? 'hidden' : ''
    }));
  }, [services, servicesIncludeWatcher, currentLanguage]);
  //* End handle interface

  const disableSelectionCondition =
    pageAction !== FuncType.UPDATE && pageAction !== FuncType.READ && undefined;

  if (variant !== 'services_include') return <></>;
  return (
    <>
      <Col span={8}>
        <Form.Item
          {...restField}
          label={name < 1 ? t('common:table.title') : <></>}
          name={[name, 'title']}
          rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
          className={clsx({ ['service-form-item-hidden']: name })}
          help={serviceInfo ? t('common:table.availability') + ': ' + serviceInfo : '...'}
        >
          <Select
            loading={loading}
            options={servicesOptions}
            placeholder={t('bundles:placeholder_service')}
            onChange={handleChangeService}
            showSearch={disableSelectionCondition}
            showArrow={disableSelectionCondition}
            open={disableSelectionCondition}
            dropdownRender={(node) => (
              <>
                {node}
                {!!dataLength && dataLength - services?.length > 0 && (
                  <Button
                    type="link"
                    className="w-full"
                    onClick={() => handleLoadMore && handleLoadMore()}
                    icon={<EllipsisOutlined />}
                  />
                )}
              </>
            )}
          />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...restField}
          label={name < 1 ? t('bundles:standard') : <></>}
          name={[name, 'standard']}
          className={clsx('item-pricing', { ['service-form-item-hidden']: name })}
        >
          <InputNumber
            className="w-auto"
            addonAfter={
              loading ? (
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
          {...restField}
          label={name < 1 ? t('bundles:overwrite') : <></>}
          name={[name, 'overwrite']}
          className={clsx('item-pricing', { ['service-form-item-hidden']: name })}
        >
          <InputNumber
            className="w-auto"
            addonAfter={
              loading ? (
                <Spin indicator={<LoadingOutlined className="text-[8px]" spin />} />
              ) : (
                currencyInfo?.symbol || '€'
              )
            }
            controls={false}
            min={(form.getFieldValue('services_include')[name]?.standard || 0) * 0.3}
            maxLength={8}
            readOnly={
              pageAction === FuncType.UPDATE ||
              pageAction === FuncType.READ ||
              !form.getFieldValue('services_include')[name]?.standard
            }
            formatter={(value) =>
              value ? currencyFormatter(value, currencyInfo?.iso || 'EUR') : ''
            }
            parser={currencyParser}
            onChange={handleChangeValueOverwrite}
          />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          {...restField}
          label={name < 1 ? t('bundles:discount') : <></>}
          name={[name, 'discount']}
          className={clsx('item-pricing', { ['service-form-item-hidden']: name })}
        >
          <InputNumber
            className="w-auto"
            addonAfter="%"
            controls={false}
            min={0}
            max={MAXIMUM_DISCOUNT_DEFAULT}
            maxLength={2}
            readOnly={
              pageAction === FuncType.UPDATE ||
              pageAction === FuncType.READ ||
              !form.getFieldValue('services_include')[name]?.standard
            }
            formatter={(value) => (value && value < 0 ? `0` : `${value}`)}
            onChange={handleChangeValueDiscount}
          />
        </Form.Item>
      </Col>
      <Col span={4}>
        <Form.Item
          {...restField}
          label={name < 1 ? t('bundles:price') : <></>}
          name={[name, 'price']}
          className={clsx('item-pricing', { ['service-form-item-hidden']: name })}
        >
          <InputNumber
            min={1}
            readOnly
            addonAfter={
              loading ? (
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

export default ServiceItem;
