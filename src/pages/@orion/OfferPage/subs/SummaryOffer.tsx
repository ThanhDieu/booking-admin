/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Space, Spin, Typography } from 'antd';
import ModalSendMail from 'components/common/modal/ModalSendMail';
import { ViewMode } from 'configs/const/auth';
import { FuncType, StatusOffer } from 'configs/const/general';
import { paths } from 'constant';
import dayjs from 'dayjs';
import { useAsyncAction } from 'hooks';
import useView from 'hooks/useView';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { createOfferService, updateOfferService } from 'services/Offer';
import { OfferPayloadType } from 'services/Offer/type';
import { MailType } from 'services/SendMail/type';
import { useAppDispatch, useAppSelector } from 'store';
import { triggerSendCampaignThunk } from 'store/orion/Mailchimp';
import { contendMailOfferFormat } from 'utils/contentMailFormat';
import { ModalChooseOfferAction } from '../partials';
import OfferPrintComponent from '../partials/OfferPrintComponent';
import OverviewBundleOfferCard from '../partials/OverviewBundleOfferCard';
import OverviewInfoOfferCard from '../partials/OverviewInfoOfferCard';

interface Props {
  summaryBundle: { [x: string]: number };
  summaryService: number;
  numberOfNight: number;
  arrival: string;
  departure: string;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const SummaryOffer = ({
  summaryBundle,
  summaryService,
  numberOfNight,
  arrival,
  departure,
  currentStep,
  setCurrentStep
}: Props) => {
  const componentRef = React.useRef(null);
  const { t } = useTranslation(['bundles', 'offer', 'common']);
  const navigate = useNavigate();
  const { currentView, currentViewObj } = useView();
  const dispatch = useAppDispatch();

  const [printLoading, setIsPrinting] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<string>('');
  const [currentPayloadCreate, setCurrentPayloadCreate] = useState<any>();

  const { offerInfo, bundleOfferSelected, extraServiceOffer } = useAppSelector(
    (state) => state.orion.offer
  );
  const { payloadSearch } = useAppSelector((state) => state.orion.booking);

  //SERVICE
  const [createOffer, stateCreateOffer] = useAsyncAction(createOfferService, {
    onSuccess: (res: any) => {
      const offerId = res?.data?.data[0];
      setCurrentPayloadCreate((prev: any) => ({ ...prev, offerId: offerId }));
      setOpenModal(FuncType.CREATE);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const [updateOffer] = useAsyncAction(updateOfferService);
  //END

  //FUNCTION
  const handleCreateOffer = () => {
    const controller = new AbortController();
    const serviceArr = extraServiceOffer?.map((service) => ({
      count: service?.count ?? 1,
      serviceId: service?.extId ?? ''
    }));
    const bundleArr = bundleOfferSelected?.map((bundle) => ({
      bundlePriceId: bundle.bundlePriceId,
      adults: bundle.adults,
      children: bundle?.children ?? [],
      count: bundle.count
    }));

    const payload = {
      arrival: payloadSearch.arrival ?? '',
      departure: payloadSearch.departure ?? '',
      name: offerInfo?.name ?? '',
      price: offerInfo?.price ?? 0,
      discount: offerInfo?.discount ?? 0,
      propertyId: payloadSearch.propertyId ?? '',
      offerBundleUpgrades: bundleArr ?? [],
      services: serviceArr ?? [],
      validity: offerInfo?.validity ?? dayjs().unix(),
      booker: {
        email: offerInfo?.email ?? '',
        firstName: offerInfo?.firstName ?? '',
        lastName: offerInfo?.lastName ?? '',
        phone: offerInfo?.phone ?? '',
        title: offerInfo?.title ?? '',
        address: {
          addressLine1: offerInfo?.address?.addressLine1 ?? '',
          addressLine2: offerInfo?.address?.addressLine2 ?? '',
          postalCode: offerInfo?.address?.postalCode ?? '',
          city: offerInfo?.address?.city ?? '',
          countryCode: offerInfo?.address?.countryCode ?? ''
        }
      }
    };
    setCurrentPayloadCreate(payload);
    createOffer(payload as OfferPayloadType, controller.signal);
  };

  const handleSendMail = (campaignId: string, content: string) => {
    const payload = {
      campaignId,
      html: content,
      mailType: MailType.offer,
      guestMail: currentPayloadCreate?.booker.email
    };

    dispatch(triggerSendCampaignThunk({ formData: payload }));

    updateOffer(currentPayloadCreate.offerId, {
      status: StatusOffer.submitted,
      validity: currentPayloadCreate.validity,
      disabled: false
    });
    navigate(`/${paths.offer}`);
  };

  //END

  return (
    <Spin spinning={printLoading || stateCreateOffer.loading}>
      <Space className="w-full" direction="vertical">
        <Typography.Title level={3}>{t('bundles:summary')}</Typography.Title>
        <div className="grid grid-cols-3 w-full gap-12">
          {/* Offer service & bundle */}
          <div className="col-span-2">
            <OverviewBundleOfferCard
              currentStep={currentStep}
              summaryBundle={summaryBundle.totalPrice}
              summaryService={summaryService}
              numberOfNight={numberOfNight}
            />
          </div>
          {/* Offer information */}
          <div className="col-span-1">
            <OverviewInfoOfferCard
              numberOfNight={numberOfNight}
              departure={departure}
              arrival={arrival}
            />
          </div>
        </div>
        <Space className="mt-5">
          {openModal === '' && (
            <Button type="primary" onClick={() => handleCreateOffer()}>
              {t('common:button.create')}
            </Button>
          )}

          <Button onClick={() => setCurrentStep(2)}> {t('common:button.back')}</Button>
        </Space>
      </Space>

      <div ref={componentRef}>
        <OfferPrintComponent
          offerInfo={offerInfo}
          propertyId={payloadSearch?.propertyId ?? ''}
          summaryBundle={summaryBundle}
          summaryService={summaryService}
          numberOfNight={numberOfNight}
        />
      </div>
      {openModal === FuncType.CREATE && (
        <ModalChooseOfferAction
          setOpenModal={setOpenModal}
          modalOpen={openModal === FuncType.CREATE}
          handleChangeOpenModal={() => {
            setOpenModal('');
            navigate(
              `${currentView !== ViewMode.Account ? `/${currentViewObj?.code}` : ``}/${
                paths.offer
              }?perPage=10&currentPage=1`
            );
          }}
          componentRef={componentRef}
          setIsPrinting={setIsPrinting}
        />
      )}
      {openModal === FuncType.SEND_MAIL && (
        <ModalSendMail
          modalOpen={openModal === FuncType.SEND_MAIL}
          handleChangeOpenModal={() => {
            setOpenModal('');
            navigate(
              `${currentView !== ViewMode.Account ? `/${currentViewObj?.code}` : ``}/${
                paths.offer
              }?perPage=10&currentPage=1`
            );
          }}
          onSubmit={handleSendMail}
          contentData={contendMailOfferFormat(currentPayloadCreate)}
        />
      )}
    </Spin>
  );
};

export default SummaryOffer;
