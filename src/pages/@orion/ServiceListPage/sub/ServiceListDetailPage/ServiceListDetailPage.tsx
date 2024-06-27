/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Col, Form, Input, Row, Select, SelectProps, Space, Switch } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { AddMediaComponent, GeneralFormComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import { FuncType, daysOfWeek, vatType } from 'configs/const/general';
import { bundleDayOption, modeOption, serviceUnitOptions } from 'configs/const/select';
import { paths } from 'constant';
import dayjs from 'dayjs';
import { useAsyncAction, useDidMount, useHelmet } from 'hooks';
import { useDetailDisplay } from 'hooks/useDisplay';
import useView from 'hooks/useView';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MediaStrapiType } from 'services/@strapi/type';
import { createServiceService, getServiceDetail, updateServiceService } from 'services/ServiceList';
import { ServiceDetailAppType, ServiceParamsType } from 'services/ServiceList/type';
import { TagDetailAppType } from 'services/Tags/type';
import { useAppSelector } from 'store';
import { currencies } from 'utils/currency';
import { formatDefaultSelected, revertValueOption } from 'utils/format';
import { capitalize } from 'utils/text';
import { validateMessages } from 'utils/validationForm';
import { displayRole } from 'utils/view';
import { AccountConfig, AvailabilityService, PriceService } from '../../partials';
import { useTranslation } from 'react-i18next';

const ServiceTypePage = () => {
  const { t, i18n } = useTranslation(['common', 'services']);
  const currentLanguage = i18n.language;

  const param = useParams();
  const { message } = App.useApp();
  const { currentView } = useView();
  const { code: codeProperty, name: nameProperty } = displayRole(currentView);
  const navigate = useNavigate();
  const { data: mediaData } = useAppSelector((state) => state?.orion?.media);
  const { detail: propertyDetail } = useAppSelector((state) => state?.orion?.property);

  const [form] = Form.useForm();
  const mediaWatch = useWatch('media', form);

  const [fetchService, stateService] = useAsyncAction(getServiceDetail);

  const [updateService, updateState] = useAsyncAction(updateServiceService, {
    onSuccess: () => {
      // navigate(`/${codeProperty}/${paths.services}`, { replace: true });
      message.success('Updated!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  const [createService, createState] = useAsyncAction(createServiceService, {
    onSuccess: () => {
      navigate(`/${codeProperty}/${paths.services}`, { replace: true });
      message.success('Created!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const service = useDetailDisplay<ServiceDetailAppType>(stateService);

  useDidMount((controller) => {
    param?.id && fetchService(param?.id, controller?.signal);
  });

  const vatOptions: SelectProps['options'] = Object.keys(vatType).map((key) => ({
    label: vatType[key as keyof typeof vatType],
    value: key.toLowerCase()
  }));

  const foundMedia = useMemo(() => {
    return (
      mediaData?.filter((data: MediaStrapiType) =>
        service?.media?.some((media) => media === data?.url)
      ) || []
    );
  }, [mediaData, service]);

  // Form handle
  const initialValue = {
    mode: modeOption[0].value,
    pricing_unit: serviceUnitOptions[0].value,
    amount: 0,
    currency: propertyDetail?.currency || 'EUR',
    day_of_week: daysOfWeek,
    vat_type: vatOptions[vatOptions.length - 1].value,
    valid_from: dayjs(Date.now())
  };

  const initialUpdateForm = {
    ...initialValue,
    code: service?.data?.code,
    name: service?.extendedData?.name[currentLanguage] ?? service?.name,
    description: service?.extendedData?.description[currentLanguage] ?? service?.description,
    mode: service?.data?.availability.mode,
    day_of_week: service?.data?.availability.daysOfWeek,
    pricing_unit: service?.data?.pricingUnit,
    amount: service?.price || service?.data?.defaultGrossPrice.amount,
    currency: service?.data?.defaultGrossPrice.currency,
    vat_type: service?.data?.vatType || service?.data?.accountingConfigs[0]?.vatType,
    valid_from: service?.data?.validFrom ? dayjs(Number(service?.data?.validFrom) * 1000) : 0,
    media: foundMedia,
    tagIds: service?.tags?.length
      ? formatDefaultSelected<TagDetailAppType>(service.tags, 'title', 'tagId')
      : [],
    popular: service?.popular,
    disabled: service?.disabled
  };

  useEffect(() => {
    if (service?.extId) {
      form.setFieldsValue(initialUpdateForm);
    }
  }, [service, foundMedia, currentLanguage]);

  const onSubmitForm = () => {
    const formData = form.getFieldsValue();
    const payload: ServiceParamsType = {
      // code: formData.code,
      // title: formData.name,
      // description: formData.description,
      // availability: {
      //   mode: formData?.mode,
      //   daysOfWeek: formData?.day_of_week
      // },
      // defaultGrossPrice: {
      //   amount: formData?.amount,
      //   currency: formData?.currency
      // },
      // pricingUnit: formData?.pricing_unit,
      // vatType: formData?.vat_type,
      // validFrom: Math.trunc(dayjs(formData?.valid_from).valueOf() / 1000)?.toString(),
      tagIds: formData.tagIds?.length
        ? formData.tagIds?.map((tag: any) => revertValueOption(tag.value || tag)?.value)
        : [],
      // propertyId: codeProperty || '',
      media: formData?.media?.length
        ? formData?.media.map((item: MediaStrapiType) => item.url)
        : [],
      popular: formData?.popular,
      disabled: formData?.disabled
    };
    if (param?.id) {
      service.extId && updateService(service.extId, payload as any);
    } else {
      createService(payload as any);
    }
  };

  // End form handle
  useHelmet({
    title: !param?.id
      ? capitalize(FuncType.CREATE) + `${' '}${t('services:service')}`
      : service?.name + `${' '}${t('services:service')}` + nameProperty
  });

  const selectPriceOptionAfter = (
    <Form.Item name="currency" noStyle>
      <Select style={{ width: 70 }} disabled>
        {currencies.map((currency) => (
          <Select.Option key={currency.iso} value={currency.iso} label={currency.iso}>
            {currency.iso}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  return (
    <PlainLayout
      headerprops={{
        title: `${t('services:service')} ${`${param?.id ? `- ${service?.name}` : t('common:button.create')
          }`}`,
        // onBack: () => navigate(`/${paths.account}/${paths.units}`, { replace: true }),
        extra: [
          <Button
            type="primary"
            key={'submit'}
            onClick={onSubmitForm}
            disabled={updateState.loading || createState.loading}
          >
            {t('common:button.save')}
          </Button>,
          <Button
            key={'cancel'}
            onClick={() => navigate(`/${codeProperty}/${paths.services}`, { replace: true })}
            disabled={updateState.loading || createState.loading}
          >
            {t('common:button.close')}
          </Button>
        ]
      }}
      className={`bg-inherit`}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmitForm}
        validateMessages={validateMessages}
        initialValues={initialValue}
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Space>
              <Form.Item label={t('common:table.code')} name="code" rules={[{ required: true }]}>
                <Input disabled={param?.id !== undefined} />
              </Form.Item>
              <Form.Item label={t('common:table.popular')} name="popular" valuePropName="checked">
                <Switch checkedChildren={t('common:button.yes')} unCheckedChildren="NO" />
              </Form.Item>
              <Form.Item label={t('common:button.disable')} name="disabled" valuePropName="checked">
                <Switch checkedChildren={t('common:button.yes')} unCheckedChildren="NO" />
              </Form.Item>
            </Space>
            <GeneralFormComponent span={24} status={param?.id ? ['name', 'description'] : []} />
          </Col>
          <Col span={12}>
            <AddMediaComponent form={form} watchHook={mediaWatch} />

            <PriceService
              selectPriceOptionAfter={selectPriceOptionAfter}
              serviceUnitOptions={serviceUnitOptions}
              vatOptions={vatOptions}
              status={param?.id ? ['pricing_unit', 'amount', 'vat_type'] : []}
            />
          </Col>
        </Row>

        <AvailabilityService
          modeOption={modeOption}
          bundleDayOption={bundleDayOption}
          status={param?.id ? ['mode', 'day_of_week'] : []}
        />

        <AccountConfig status={param?.id ? ['valid_from'] : []} dataDetail={service} />
      </Form>
    </PlainLayout>
  );
};

export default ServiceTypePage;
