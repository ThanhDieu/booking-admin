/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Checkbox, Col, Form, Input, Row, Skeleton, Space, Spin, Switch } from 'antd';
import { InternalNamePath } from 'antd/lib/form/interface';
import { PlainLayout } from 'components/layout';
import { FuncType, filterBundle } from 'configs/const/general';
import { bundleDayOption } from 'configs/const/select';
import { COPYRIGHT, paths } from 'constant';
import dayjs from 'dayjs';
import {
  useAsyncAction,
  useDetailDisplay,
  useDidMount,
  useHelmet,
  useLocaleSegmentOption
} from 'hooks';
import useView from 'hooks/useView';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MediaStrapiType } from 'services/@strapi/type';
import { createBundleService, getBundleDetailService, updateBundleService } from 'services/Bundle';
import {
  BundleDetailType,
  BundlePayloadCreateType,
  BundlePayloadUpdateType,
  BundlePriceType,
  BundleServiceType
} from 'services/Bundle/type';
import { getRatesService } from 'services/RatePlan';
import { AllRateOfRatePlanAppType } from 'services/RatePlan/type';
import { useAppSelector } from 'store';
import { validateMessages } from 'utils/validationForm';
import { displayRole } from 'utils/view';
import { calculatePrice } from './helper';
import { Calculation, GeneralInfo, SubmitButton } from './partials';
import { InitBaseType, InitialBundleType } from './types';

const BundleDetailPage = () => {
  //* Handle api service
  // Action
  /**
   * @param propertyId
   * @param from
   * @param to
   * @param ratePlanIds
   */

  /**
   * @param propertyId
   */
  const [fetchBundle, stateBundle] = useAsyncAction(getBundleDetailService);

  const [createBundle] = useAsyncAction(createBundleService, {
    onSuccess: () => {
      message.success('Success!', 2);
      navigate(`/${codeProperty}/${paths.bundles}/${currentTypeBundle}`, { replace: true });
    },
    onFailed: (res: any) => {
      message.error(res.message.charAt(0).toUpperCase() + res.message.slice(1), 2);
    }
  });

  const [updateBundle] = useAsyncAction(updateBundleService, {
    onSuccess: () => {
      bundleCode && fetchBundle(bundleCode);
      navigate(`/${codeProperty}/${paths.bundles}/${currentTypeBundle}`, { replace: true });

      message.success('Success!', 2);
    },
    onFailed: (res: any) => {
      message.error(res.message.charAt(0).toUpperCase() + res.message.slice(1), 2);
    }
  });

  // Data
  const bundle = useDetailDisplay<BundleDetailType>(stateBundle);
  const mediaData: MediaStrapiType[] = useAppSelector((state) => state.orion.media.data);
  const { profile } = useAppSelector((state) => state.orion.auth);
  const { loading: settingLanguageLoading } = useAppSelector(
    (state) => state.orion.languageSetting
  );

  const { mandatoryLocaleList } = useLocaleSegmentOption();
  const [errorTileList, setErrorTitleList] = useState<string[]>([]);

  // Call
  useDidMount(async (controller) => {
    bundleCode && fetchBundle(bundleCode, controller?.signal);
  });
  //* End Handle api service

  //* Declare variable global
  const { t, i18n } = useTranslation(['common', 'bundles']);
  const currentLanguage = i18n.language;
  const navigate = useNavigate();
  const { currentView } = useView();
  const { code: codeProperty, name: nameProperty } = displayRole(currentView);
  const { message } = App.useApp();
  const bundleCode = useParams().id;
  const currentTypeBundle = useLocation().pathname.split('/')[3];
  const isDuplicateFeature = useLocation().pathname.includes(`/${paths.duplicate}`);
  const pageAction = useMemo(() => {
    if (!bundleCode) return FuncType.CREATE;
    if (bundleCode && isDuplicateFeature) return FuncType.DUPLICATE;
    if (
      bundleCode &&
      !isDuplicateFeature &&
      bundle?.status !== filterBundle.APPROVED &&
      bundle?.status !== filterBundle.EXPIRED
    )
      return FuncType.UPDATE;
    if (
      (bundleCode && bundle?.status === filterBundle.APPROVED) ||
      bundle?.status === filterBundle.EXPIRED
    )
      return FuncType.READ;

    // Fallback
    return FuncType.CREATE;
  }, [bundle]);

  const [form] = Form.useForm<InitialBundleType>();

  const initialValue: InitialBundleType = useMemo(() => {
    return {
      locale: 'en',
      periods: [undefined],
      days_of_week: bundleDayOption?.map((dayOfWeek) => dayOfWeek.value),
      minimum_stay: 1,
      maximum_stay: 2,
      title: {
        en: ''
      },
      description: {
        en: ''
      },
      currency: 'EUR',
      is_template: currentTypeBundle === 'template',
      disabled: false,
      base: [
        {
          standard: 0,
          overwrite: 0,
          discount: 0,
          price: 0
        }
      ],
      services_include: [
        {
          standard: 0,
          discount: 0,
          overwrite: 0,
          price: 0
        }
      ]
    };
  }, [currentTypeBundle]);
  //* End declare variable global

  //*  Handle form
  // Set form value
  const initialUpdateForm: InitialBundleType = useMemo(() => {
    const base = bundle?.bundlePrices?.find((value) => value.category === 0);
    const upgrades = bundle?.bundlePrices?.filter((value) => value.category !== 0);

    return {
      ...initialValue,
      title: bundle?.extendedData?.title ?? { en: bundle?.title || '' },
      description: bundle?.extendedData?.description ?? { en: bundle?.description || '' },
      is_holiday_package: bundle?.isHolidayPackage,
      currency: bundle?.currency,
      activities: bundle?.activities?.map((value) => value.activityId),
      mainActivity: bundle?.mainActivity,
      special_bundles: bundle?.specialBundle?.specialBundleId,
      landscape: bundle?.landscape?.landscapeId,
      tags: bundle?.tags?.map((value) => value.tagId),
      online: bundle?.online,
      status: bundle?.status,
      disabled: bundle?.disabled,
      is_template: pageAction === FuncType.DUPLICATE ? false : bundle?.isTemplate,
      periods:
        pageAction === FuncType.DUPLICATE
          ? initialValue.periods
          : bundle?.periods.map((period) => [dayjs.unix(period.start), dayjs.unix(period.end)]),
      days_of_week: bundle?.daysOfWeek?.map((value) => value),
      minimum_stay: bundle?.minimumStay,
      maximum_stay: bundle?.maximumStay,
      base:
        pageAction === FuncType.DUPLICATE
          ? initialValue.base
          : [
              {
                unit_group: base?.unitGroupId,
                rate_plan: base?.ratePlanId,
                standard: base?.originalPrice,
                overwrite: base?.overwritePrice,
                discount: base ? calculatePrice(base?.originalPrice, base?.overwritePrice) : 0,
                price: base && base.overwritePrice ? base.overwritePrice : base?.originalPrice
              }
            ],
      services_include:
        bundle?.bundleServices?.map((service) => ({
          title: service?.serviceId,
          standard: service?.originalPrice,
          overwrite: service?.overwritePrice,
          discount: service ? calculatePrice(service?.originalPrice, service?.overwritePrice) : 0,
          price: service && service.overwritePrice ? service.overwritePrice : service?.originalPrice
        })) ?? [],
      upgrade:
        pageAction === FuncType.DUPLICATE
          ? initialValue.upgrade
          : upgrades?.map((upgrade) => ({
              category: upgrade?.category,
              unit_group: upgrade?.unitGroupId,
              rate_plan: upgrade?.ratePlanId,
              standard: upgrade?.originalPrice,
              overwrite: upgrade?.overwritePrice,
              discount: upgrade
                ? calculatePrice(upgrade?.originalPrice, upgrade?.overwritePrice)
                : 0,
              price:
                upgrade && upgrade.overwritePrice ? upgrade.overwritePrice : upgrade?.originalPrice
            })) || []
    };
  }, [bundle]);

  useEffect(() => {
    if (bundleCode && bundle && mediaData && pageAction !== FuncType.CREATE) {
      const [mainUrl, ...extraUrl] = bundle.media;
      const mainMedia = mediaData.filter((media) => media.url === mainUrl);
      const extraMedia = mediaData.filter((media) =>
        extraUrl.some((value: string) => media.url === value)
      );

      form.setFieldsValue({ ...initialUpdateForm, media: mainMedia, extra: extraMedia });
    } else {
      form.setFieldsValue(initialValue);
    }
  }, [bundle, mediaData]);

  useEffect(() => {
    if (pageAction === FuncType.CREATE && mandatoryLocaleList?.length) {
      const titleValueArr = mandatoryLocaleList?.map((lang) => form.getFieldValue(['title', lang]));
      mandatoryLocaleList?.map((lang, idx) => {
        initialValue.title[lang] = titleValueArr[idx] ?? '';
      });

      form.setFieldsValue({
        title: initialValue.title
      });
    }
  }, [mandatoryLocaleList]);

  // Form action
  const onSubmitForm = useCallback(
    (formData: any) => {
      const {
        title,
        description,
        is_holiday_package,
        activities,
        mainActivity,
        special_bundles,
        landscape,
        tags,
        online,
        disabled,
        is_template,
        periods,
        days_of_week,
        minimum_stay,
        maximum_stay,
        currency,
        base,
        services_include,
        upgrade,
        media,
        extra
      } = formData;

      const payloadMedia: string[] = [
        ...(media.map((item: MediaStrapiType) => item.url) || []),
        ...(extra.map((item: MediaStrapiType) => item.url) || [])
      ];

      const payloadInfo = {
        title: title.en,
        description: description.en,
        extendedData: {
          title: title,
          description: description
        },
        activityIds: activities,
        mainActivity,
        specialBundleId: special_bundles,
        landscapeId: landscape,
        tagIds: tags,
        isHolidayPackage: is_holiday_package,
        isTemplate: is_template,
        media: payloadMedia
      };

      const payloadBundleBase = {
        category: 0,
        originalPrice: base[0].standard,
        overwritePrice: base[0].overwrite || base[0].standard,
        ratePlanId: base[0].rate_plan || '',
        unitGroupId: base[0].unit_group || ''
      };

      const payloadBundleUpgrade =
        upgrade?.map((upgrade: InitBaseType) => ({
          category: upgrade.category || 1,
          originalPrice: upgrade.standard,
          overwritePrice: upgrade.overwrite || upgrade.standard,
          ratePlanId: upgrade.rate_plan || '',
          unitGroupId: upgrade.unit_group || ''
        })) || [];

      const bundlePrices: BundlePriceType[] = [{ ...payloadBundleBase }, ...payloadBundleUpgrade];

      const bundleServices: BundleServiceType[] = services_include.map((item: any) => ({
        originalPrice: item.standard,
        overwritePrice: item.overwrite || item.standard,
        serviceId: item.title || ''
      }));
      const mappedPeriods: { start: number; end: number }[] = periods.map(
        (period: dayjs.Dayjs[]) => ({
          start: dayjs(period[0]).unix(),
          end: dayjs(period[1]).unix()
        })
      );

      // Create an array of Promises for fetching rates
      const fetchRatesPromises = mappedPeriods.map((period) => {
        if (codeProperty) {
          return getRatesService(codeProperty, period.start.toString(), period.end.toString(), [
            base[0].rate_plan
          ]);
        } else {
          // Return a Promise that resolves immediately if codeProperty is not defined
          return Promise.resolve();
        }
      });

      if (bundleCode && !isDuplicateFeature) {
        const payloadUpdate: BundlePayloadUpdateType = {
          ...payloadInfo,
          online: online,
          disabled: disabled
        };

        bundle.bundleId && updateBundle(bundle.bundleId, payloadUpdate);
      } else {
        Promise.all(fetchRatesPromises)
          .then((results) => {
            // Price total service include
            const totalServiceInclude =
              bundleServices?.length > 0
                ? bundleServices?.reduce((acc, cur) => acc + cur.overwritePrice, 0)
                : 0;

            // Initialize variables to track the minimum prices
            let minPriceOverall = Number.MAX_VALUE; // Initialize with a high value

            // results will be an array of responses from fetchRates
            results.forEach((res: any) => {
              if (!res || !res.data || !res.data.success) return;

              const result: AllRateOfRatePlanAppType = res.data.data ? res.data.data[0] : null;
              if (result && result.rates && Array.isArray(result.rates)) {
                const lowestPrice = Math.min(
                  ...result.rates.map((rate) => (rate && rate.price) || Number.MAX_VALUE)
                );

                // Update the overall lowest price and highest price
                minPriceOverall = Math.min(minPriceOverall, lowestPrice) + totalServiceInclude;
              }
            });

            return { minPriceOverall };
          })
          .then(({ minPriceOverall }) => {
            const payloadCreate: BundlePayloadCreateType = {
              ...payloadInfo,
              propertyId: codeProperty || '',
              periods: mappedPeriods,
              daysOfWeek: days_of_week,
              minimumStay: minimum_stay,
              maximumStay: maximum_stay,
              bundlePrices: bundlePrices,
              bundleServices: bundleServices,
              createdBy: profile?.userId || '',
              currency: currency,
              priceMin: minPriceOverall,
              isNewsletter: false
            };

            const payloadNewsletter: BundlePayloadCreateType = {
              ...payloadInfo,
              propertyId: codeProperty || '',
              periods: mappedPeriods,
              bundlePrices: bundlePrices,
              bundleServices: bundleServices,
              createdBy: profile?.userId || '',
              currency: currency,
              priceMin: minPriceOverall,
              isNewsletter: true
            };
            createBundle(
              currentTypeBundle === paths.bundlesNewsletter ? payloadNewsletter : payloadCreate
            );
          })
          .catch((error) => {
            console.error('An error occurred:', error);
          });
      }
      setErrorTitleList([]);
    },
    [bundle, profile]
  );
  const onSubmitFormFail = ({
    errorFields
  }: {
    errorFields: {
      name: InternalNamePath;
      errors: string[];
    }[];
  }) => {
    const titleErrorArr = errorFields
      ?.filter(({ name }) => name[0] === 'title')
      .map(({ name }) => name[1]);
    return setErrorTitleList([...(titleErrorArr as string[])]);
  };
  //* End handle form

  //* Handle interface
  // Helmet
  useHelmet({
    title: `${t('bundles:bundles')} / ${nameProperty}`
  });
  //* End handle interface
  if (stateBundle.loading && settingLanguageLoading) return <Spin />;
  return (
    <PlainLayout
      headerprops={{
        title: (
          <div className="m-0 flex items-center gap-4">
             {t('bundles:bundle') + " - "}
            {!bundleCode || isDuplicateFeature ? (
              t('common:form.form')
            ) : (
              <>
                {bundle ? (
                  bundle?.extendedData?.title[currentLanguage] ?? bundle.name
                ) : (
                  <Skeleton.Input active={true} size={'large'} />
                )}
              </>
            )}
          </div>
        ),
        extra: [
          <Space key={'extra-action'}>
            <Button
              type="default"
              onClick={() =>
                navigate(`/${codeProperty}/${paths.bundles}/${currentTypeBundle}`, {
                  replace: true
                })
              }
            >
              {t('common:button.close')}
            </Button>
            {pageAction !== FuncType.READ && <SubmitButton form={form} />}
          </Space>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className={`bg-inherit`}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmitForm}
        onFinishFailed={onSubmitFormFail}
        className="bundle-form h-auto"
        validateMessages={validateMessages}
      >
        <Row gutter={24}>
          {/* //? Form item hidden */}
          <Form.Item name="createdBy" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="online" valuePropName="checked" noStyle>
            <Checkbox className="hidden" />
          </Form.Item>
          <Form.Item name="status" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="disabled" valuePropName="checked" noStyle>
            <Checkbox className="hidden" />
          </Form.Item>
          <Form.Item name="currency" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item name="is_template" valuePropName="checked" noStyle>
            <Switch className="hidden" />
          </Form.Item>

          {/* //? General information bundle */}
          <Col span={8} order={2}>
            <GeneralInfo
              pageAction={pageAction}
              code={codeProperty}
              form={form}
              errorTileList={errorTileList}
            />
          </Col>

          {/* //? Calculation price bundle */}
          <Col span={16}>
            <Calculation pageAction={pageAction} form={form} />
          </Col>
        </Row>
      </Form>
    </PlainLayout>
  );
};

export default BundleDetailPage;
