/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Col, Form, Row, Space, Spin } from 'antd';
import { PlainLayout } from 'components/layout';
import { A_THOUSAND, FuncType, tagType } from 'configs/const/general';
import { COPYRIGHT, currencies, paths } from 'constant';
import { useHelmet } from 'hooks';
import useAsyncAction from 'hooks/useAsyncAction';
import { useNavigate, useParams } from 'react-router-dom';
import { apiPropertyCreateService, apiPropertyUpdateService } from 'services/Properties';

import { useForm } from 'antd/es/form/Form';
import { TagFormItemComponent } from 'components/common';
import ProtectedComponent from 'components/shared/ProtectedComponent';
import dayjs from 'dayjs';
import useView from 'hooks/useView';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MediaStrapiType } from 'services/@strapi/type';
import { PropertyParamsType } from 'services/Properties/type';
import { useAppDispatch, useAppSelector } from 'store';
import { updateView } from 'store/booking/Auth';
import { getPropertyDetails } from 'store/booking/Property';
import { formatSelectOption } from 'utils/format';
import { validateMessages } from 'utils/validationForm';
import { CompanyDetailSection, LocationSection, PropertyGeneral } from './partials';

const PropertySettingPage = () => {
  const { t, i18n } = useTranslation(['common', 'properties']);
  const dispatch = useAppDispatch();
  const [form] = useForm();
  const { allowedViewAll } = useView();
  // const mediaWatch = useWatch('media', form);
  const navigate = useNavigate();
  const param = useParams();
  const { detail: propertyDetail } = useAppSelector((state) => state?.booking?.property);
  const { message } = App.useApp();
  const { data: mediaData } = useAppSelector((state) => state?.booking?.media);
  const currentLanguage = i18n.language;

  const [updateProperty, stateUpdateProperty] = useAsyncAction(apiPropertyUpdateService, {
    onSuccess: () => {
      message.success('Update success!', 2);
      propertyDetail?.extId && dispatch(getPropertyDetails({ id: propertyDetail.extId }));
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const [createProperty] = useAsyncAction(apiPropertyCreateService, {
    onSuccess: (res: any) => {
      const nameProperty = res.data?.data[0]?.name?.en;
      const code = res.data?.data[0].code;
      dispatch(updateView(nameProperty));

      navigate(`/${code}/${paths.home}`);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const foundMedia = useMemo(() => {
    return (
      mediaData?.filter((data: MediaStrapiType) =>
        propertyDetail?.media?.some((media) => media === data?.url)
      ) || []
    );
  }, [mediaData, propertyDetail]);

  //TODO
  const initFormValue = {
    code: propertyDetail?.extId,
    name: propertyDetail?.extendedData?.name[currentLanguage] ?? propertyDetail?.name ?? '',
    description:
      propertyDetail?.extendedData?.description[currentLanguage] ??
      propertyDetail?.description ??
      '',
    addressLine1: propertyDetail?.data?.location?.addressLine1,
    addressLine2: propertyDetail?.data?.location?.addressLine2,
    postalCode: propertyDetail?.data?.location?.postalCode,
    city: propertyDetail?.city || propertyDetail?.data?.location?.city,
    countryCode: propertyDetail?.data?.location?.countryCode
      ? `${propertyDetail?.data?.location?.countryCode}@${propertyDetail?.country}`
      : '',
    timeZone: propertyDetail?.data?.timeZone,
    currencyCode: propertyDetail?.data?.currencyCode
      ? `${propertyDetail?.data?.currencyCode}@${currencies[propertyDetail?.data?.currencyCode]}`
      : '',
    companyName: propertyDetail?.data?.companyName,
    bank: propertyDetail?.data?.bankAccount?.bank,
    bic: propertyDetail?.data?.bankAccount?.bic,
    iban: propertyDetail?.data?.bankAccount?.iban,
    commercialRegisterEntry: propertyDetail?.data?.commercialRegisterEntry,
    taxId: propertyDetail?.data?.taxId,
    managingDirectors: propertyDetail?.data?.managingDirectors,
    defaultCheckInTime: propertyDetail?.data?.defaultCheckInTime
      ? dayjs(Number(propertyDetail?.data?.defaultCheckInTime) * A_THOUSAND)
      : undefined,
    defaultCheckOutTime: propertyDetail?.data?.defaultCheckOutTime
      ? dayjs(Number(propertyDetail?.data?.defaultCheckOutTime) * A_THOUSAND)
      : undefined,
    tagIds: propertyDetail?.tags?.length
      ? formatSelectOption(propertyDetail?.tags, 'title', 'tagId')
      : [],
    media: foundMedia,
    unavailableBookingOnline: propertyDetail?.unavailableBookingOnline
      ? [
        dayjs(propertyDetail?.unavailableBookingOnline?.start * A_THOUSAND),
        dayjs(propertyDetail?.unavailableBookingOnline.end * A_THOUSAND)
      ]
      : []
  };
  // FUNCTIONS
  const onSubmitForm = () => {
    const formData = form.getFieldsValue();

    const payload: PropertyParamsType = {
      code: formData.code,
      // title: formData.name,
      // description: formData.description,
      // companyDetails: {
      //   name: formData.companyName,
      //   commercialRegisterEntry: formData.commercialRegisterEntry,
      //   taxId: formData.taxId,
      //   managingDirectors: formData.managingDirectors
      // },
      // bankAccount: {
      //   bank: formData.bank,
      //   bic: formData.bic,
      //   iban: formData.iban
      // },
      // location: {
      //   addressLine1: formData.addressLine1,
      //   addressLine2: formData.addressLine2,
      //   city: formData.city,
      //   postalCode: formData.postalCode,
      //   countryCode: formData.countryCode?.split('@')[0]
      // },
      // currencyCode: formData.currencyCode?.split('@')[0],
      // timeZone: formData.timeZone,
      // status: statusPropertyType.TEST,
      tagIds: formData.tagIds.length
        ? formData.tagIds.map((tag: any) =>
          tag?.value ? tag?.value.split('@')[0] : tag?.split('@')[0]
        )
        : [],
      media: formData?.media?.length ? formData?.media.map((item: MediaStrapiType) => item.url) : []
    };

    if (formData.unavailableBookingOnline?.length) {
      payload.start = Number(dayjs(formData.unavailableBookingOnline[0]).unix());
      payload.end = Number(dayjs(formData.unavailableBookingOnline[1]).unix());
    }

    if (param.code) {
      updateProperty(param.code, payload);
    } else {
      createProperty(payload);
    }
  };

  useEffect(() => {
    if (propertyDetail) form.setFieldsValue(initFormValue);
  }, [propertyDetail, foundMedia]);

  // UI
  useHelmet({
    title: `Property / ${propertyDetail?.name || ''}`
  });

  return (
    <PlainLayout
      headerprops={{
        title: t('common:table.property'),
        extra: [
          <Button type="primary" key={'submit'} onClick={onSubmitForm}>
            {t('common:button.save')}
          </Button>,
          <ProtectedComponent key={'cancel'} renderIfTrue={() => allowedViewAll}>
            <Button onClick={() => navigate(`/${paths.properties}`)}>
              {t('common:button.cancel')}
            </Button>
          </ProtectedComponent>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <Spin spinning={stateUpdateProperty.loading}>
        <Form
          layout="vertical"
          initialValues={initFormValue}
          onFinish={onSubmitForm}
          form={form}
          validateMessages={validateMessages}
        >
          <Space direction="vertical" size="large" className="w-full ">
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <PropertyGeneral mode={param.code ? FuncType.UPDATE : FuncType.CREATE} />
              </Col>
              <Col span={12}>
                {/* <AddMediaComponent form={form} watchHook={mediaWatch} /> */}
                {param.code && (
                  <TagFormItemComponent
                    propertyCode={param?.code}
                    tagType={tagType.PROPERTY}
                    item={{
                      label: t('properties:property_tags'),
                      isRequired: false,
                      name: 'tagIds'
                    }}
                    initialTags={propertyDetail?.tags ?? []}
                  />
                )}
                {/* <UnavailableBookingOnlineSection /> */}
              </Col>
            </Row>

            <LocationSection
              mode={param.code ? FuncType.UPDATE : FuncType.CREATE}
              propertyDetail={propertyDetail}
            />
            <CompanyDetailSection mode={param.code ? FuncType.UPDATE : FuncType.CREATE} />
          </Space>
        </Form>
      </Spin>
    </PlainLayout>
  );
};
export default PropertySettingPage;
