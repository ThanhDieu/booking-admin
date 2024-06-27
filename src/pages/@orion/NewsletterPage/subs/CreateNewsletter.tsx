/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Col, Form, Row, Select, Spin, Typography } from 'antd';
import { PlainLayout } from 'components/layout';
import { FuncType, filterBundle } from 'configs/const/general';
import { COPYRIGHT, paths } from 'constant';
import { useAsyncAction, useDataDisplayV2 } from 'hooks';
import { BundleListResult } from 'pages/@orion/ReservationsPage/partials';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getBundlesService } from 'services/Bundle';
import { BundleListType, GetBundlePriceTypeV2 } from 'services/Bundle/type';
import {
  createNewsletterService,
  getNewsletterDetailService,
  updateNewsletterService
} from 'services/Newsletter';
import {
  BundleNewsletterSelect,
  DataNewsletterPayload,
  NewsletterCreateType,
  NewsletterDetailType
} from 'services/Newsletter/type';
import { MailType } from 'services/SendMail/type';
import { useAppDispatch, useAppSelector } from 'store';
import { triggerSendCampaignThunk } from 'store/orion/Mailchimp/thunks';
import { removeDuplicateObjects } from 'utils/array';
import { formatSelectOption } from 'utils/format';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { validateMessages } from 'utils/validationForm';
import { NewsletterTextForm, PresentBundleListCard, SendNewsletterModal } from '../partials';

const CreateNewsletter = () => {
  const { t } = useTranslation(['newsletter', 'reservation', 'common']);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { id: idNewsletter } = useParams();
  const dispatch = useAppDispatch();

  //STATE
  const [currentLocation, setCurrentLocation] = useState<QueryCaseType>({
    currentPage: 1,
    online: true,
    status: filterBundle.APPROVED
  });
  const [bundleSelected, setBundleSeleted] = useState<BundleNewsletterSelect[]>([]);
  const [openModal, setOpenModal] = useState<{ type: string; data?: DataNewsletterPayload }>({
    type: ''
  });

  const { properties, loading } = useAppSelector((state) => state.orion.property);

  //SERVICE
  const [fetchBundles, stateBundles] = useAsyncAction(getBundlesService);
  const [createNewsletter, stateCreateNewsletter] = useAsyncAction(createNewsletterService, {
    onSuccess: () => {
      message.success(t('common:table.created'), 2);
      navigate(`/${paths.newsletter}`);
    },
    onFailed: (error: any) => {
      if (error) message.error(error.message, 2);
    }
  });
  const [updateNewsletterList, stateUpdateNewsletterList] = useAsyncAction(
    updateNewsletterService,
    {
      onSuccess: () => {
        navigate(`/${paths.newsletter}`);
      },
      onFailed: (error: any) => {
        if (error) message.error(error.message, 2);
      }
    }
  );
  const [getNewsletterDetail, stateGetNewsletterDetail] = useAsyncAction(
    getNewsletterDetailService
  );

  // FUNCTION
  const handleChangeLocation = ({
    currentPage = currentLocation.currentPage,
    propertyId = currentLocation.propertyId,
    online = currentLocation.online,
    status = currentLocation.status
  }: QueryCaseType) => {
    const query = queryCase({
      propertyId,
      currentPage,
      online,
      status
    });
    fetchBundles(query);
    setCurrentLocation({
      ...currentLocation,
      propertyId,
      currentPage,
      online,
      status
    });
  };

  const handleChooseBundle = (record: any, selected: boolean) => {
    const getBundleSelected = bundleSelected?.filter(
      (item) => item.propertyId === (currentLocation?.propertyId ?? '')
    );

    //property not exist
    if (!getBundleSelected?.length)
      return setBundleSeleted((prev) => [
        ...prev,
        {
          propertyId: currentLocation?.propertyId ?? '',
          bundles: !record.length ? [record] : [...record]
        }
      ]);

    //property  exist
    const bundleObjIndex = bundleSelected?.findIndex(
      (el) => el.propertyId === (currentLocation?.propertyId ?? '')
    );
    if (selected) {
      //select new bundle
      setBundleSeleted((prev) => {
        const mergeArr = !record.length
          ? [...prev[bundleObjIndex].bundles, record]
          : [...prev[bundleObjIndex].bundles, ...record];
        const uniqueArr = removeDuplicateObjects(mergeArr, 'bundleId');
        prev.splice(bundleObjIndex, 1);

        return [
          ...prev,
          { propertyId: currentLocation?.propertyId ?? '', bundles: [...uniqueArr] }
        ];
      });
    } else {
      //unselect bundle
      setBundleSeleted((prev) => {
        const indexBundle = !record.length
          ? prev[bundleObjIndex].bundles?.findIndex((el) => el.bundleId === record.bundleId)
          : record?.map((el: GetBundlePriceTypeV2) => {
              return prev[bundleObjIndex].bundles?.findIndex(
                (item) => item.bundleId === el.bundleId
              );
            });
        if (!record.length) {
          prev[bundleObjIndex].bundles.splice(indexBundle, 1);
        } else {
          indexBundle.reverse()?.map((idx: number) => {
            prev[bundleObjIndex].bundles.splice(idx, 1);
          });
        }
        return [...prev];
      });
    }
  };

  const handleSendMail = (campaignId: string, content: string) => {
    const payloadSendMail = {
      campaignId,
      html: content,
      mailType: MailType.newsletter
    };
    dispatch(triggerSendCampaignThunk({ formData: payloadSendMail }));

    if (openModal?.data) {
      const payloadCreate = {
        data: {
          type: NewsletterCreateType.newsletter,
          data: openModal.data
        }
      };
      idNewsletter
        ? updateNewsletterList(Number(idNewsletter), payloadCreate)
        : createNewsletter(payloadCreate);
    }
  };

  //DATA
  const bundles = useDataDisplayV2<BundleListType>(stateBundles);
  const propertiesOptions = formatSelectOption(properties?.data ?? [], 'name', 'extId');
  const newsletterDetailData: NewsletterDetailType = useMemo(
    () => (stateGetNewsletterDetail as any)?.data?.data ?? undefined,
    [stateGetNewsletterDetail]
  );

  const initialBundlistArrKey = useMemo(
    () => newsletterDetailData?.data?.bundles?.map((bundle) => bundle.bundleId),
    [newsletterDetailData]
  );

  useEffect(() => {
    const firstProperty = properties?.data[0].extId ?? '';
    properties?.data?.length &&
      handleChangeLocation({
        ...currentLocation,
        propertyId: firstProperty
      });
    form.setFieldsValue(intialFormValue);
  }, [properties, newsletterDetailData]);

  //FORM
  const intialFormValue = useMemo(
    () => ({
      name: newsletterDetailData?.data?.name ?? '',
      intro: newsletterDetailData?.data?.intro ?? '',
      outro: newsletterDetailData?.data?.outro ?? ''
    }),
    [newsletterDetailData]
  );
  const onsubmitForm = (e: any) => {
    const { id } = e.nativeEvent.submitter;
    form
      .validateFields()
      .then((values) => {
        const bundlesPayload = bundleSelected
          ?.map((bundleObj) => {
            return bundleObj?.bundles?.map((bundle) => ({
              name: bundle.name,
              bundleId: bundle?.bundleId,
              price: bundle?.priceMin,
              currency: bundle?.currency,
              periods: bundle?.periods,
              propertyId: bundle?.property?.extId,
              propertyName: bundle?.property?.name ?? ''
            }));
          })
          ?.flat(2);
        const dataPayload: DataNewsletterPayload = {
          ...values,
          bundles: [...bundlesPayload]
        };
        const payload = {
          data: {
            type: NewsletterCreateType.newsletter,
            data: dataPayload
          }
        };

        if (id === 'send_mail') {
          setOpenModal({ type: FuncType.SEND_MAIL, data: dataPayload });
        } else {
          idNewsletter
            ? updateNewsletterList(Number(idNewsletter), payload)
            : createNewsletter(payload);
        }
      })
      .catch(() => message.error(t('newsletter:validate_form')));
  };

  useEffect(() => {
    if (idNewsletter) getNewsletterDetail(Number(idNewsletter));
  }, []);

  //* End handle interface
  const pageLoading =
    loading ||
    stateCreateNewsletter.loading ||
    stateGetNewsletterDetail.loading ||
    stateUpdateNewsletterList.loading;

  return (
    <PlainLayout
      headerprops={{
        title: t('newsletter:new_newsletter')
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <Spin spinning={pageLoading}>
        <Form
          validateMessages={validateMessages}
          layout="vertical"
          onSubmitCapture={(e) => onsubmitForm(e)}
          form={form}
        >
          <NewsletterTextForm />
          {propertiesOptions?.length ? (
            <Row>
              <div className="flex flex-col items-start gap-1">
                <Typography.Text>{t('newsletter:property_filter_placeholder')}: </Typography.Text>
                <Select
                  className="mb-5"
                  defaultValue={propertiesOptions[0]?.value}
                  options={propertiesOptions}
                  placeholder={t('newsletter:property_filter_placeholder')}
                  onChange={(value) => {
                    const propertyId = (value as string)?.split('@')[0];
                    handleChangeLocation({ propertyId: propertyId, currentPage: 1 });
                  }}
                />
              </div>
            </Row>
          ) : null}
          <Row gutter={32}>
            <Col span={14}>
              <Form.Item
                name="bundle"
                rules={[
                  {
                    validator() {
                      if (!bundleSelected.length) {
                        return Promise.reject(new Error(t('newsletter:validate_select_bundle')));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <BundleListResult
                  loading={stateBundles.loading}
                  bundles={bundles}
                  handleChangeLocation={handleChangeLocation}
                  currentLocation={currentLocation}
                  isNewsletter
                  handleChooseBundle={handleChooseBundle}
                  newsLetterBundleSelected={bundleSelected}
                  initialBundlistArrKey={initialBundlistArrKey}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <PresentBundleListCard bundleOfferSelected={bundleSelected ?? []} />
            </Col>
          </Row>
          <Row className="mt-5 gap-5 flex">
            <Button id="send_mail" htmlType="submit" value={'send_mail'} type="primary">
              {idNewsletter
                ? t('newsletter:save_and_send_mail')
                : t('newsletter:create_and_send_mail')}
            </Button>
            <Button id="create" htmlType="submit" value={'create'}>
              {idNewsletter ? t('common:button.save') : t('newsletter:create_newsletter')}
            </Button>
            <Button onClick={() => navigate(`/${paths.newsletter}`)}>
              {t('common:button.close')}
            </Button>
          </Row>
        </Form>
      </Spin>
      {openModal.type === FuncType.SEND_MAIL && (
        <SendNewsletterModal
          modalOpen={openModal.type === FuncType.SEND_MAIL}
          handleChangeOpenModal={() => setOpenModal((prev) => ({ type: '', data: prev.data }))}
          onSubmit={handleSendMail}
          contentData={openModal.data}
        />
      )}
    </PlainLayout>
  );
};

export default CreateNewsletter;
