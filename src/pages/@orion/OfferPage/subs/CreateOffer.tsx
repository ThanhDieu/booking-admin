import { StepProps, Steps } from 'antd';
import { PlainLayout } from 'components/layout';
import { COPYRIGHT } from 'constant';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'store';
import { resetState } from 'store/orion/Offer';
import { calculateServicePrice, calculateTotal } from 'utils/calculate';
import { dateFormat } from 'utils/dayjs';
import { AddServiceStep, BookerOffer, SummaryOffer, ChooseBundle } from '.';

const CreateOffer = () => {
  const { t } = useTranslation(['offer', 'common', 'reservation']);

  const dispatch = useAppDispatch();
  const { payloadSearch } = useAppSelector((state) => state.orion.booking);
  const { bundleOfferSelected, extraServiceOffer } = useAppSelector((state) => state.orion.offer);

  const arrival = payloadSearch?.arrival && dateFormat(payloadSearch.arrival, 'MMM DD,YYYY');
  const departure = payloadSearch?.departure && dateFormat(payloadSearch.departure, 'MMM DD,YYYY');

  const numberOfNight = dayjs(departure).diff(dayjs(arrival), 'day');
  const summaryBundle = useMemo(
    () => calculateTotal(bundleOfferSelected, ['totalGuest', 'totalPrice']),
    [bundleOfferSelected]
  );

  const summaryService = calculateServicePrice(extraServiceOffer, numberOfNight);

  const [currentStep, setCurrentStep] = useState(0);

  const items: StepProps[] = [
    {
      title: t('offer:choose_bundles').toUpperCase()
    },
    {
      title: t('reservation:add_service').toUpperCase()
    },
    {
      title: t('offer:offer_info').toUpperCase()
    },
    {
      title: t('common:modal.confirmation').toUpperCase()
    }
  ];

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, []);

  return (
    <PlainLayout
      headerprops={{
        title: t('offer:new_offer')
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <Steps items={items} current={currentStep} className="w-[900px] mb-9" />
      {currentStep === 0 ? (
        <ChooseBundle setCurrentStep={setCurrentStep} />
      ) : currentStep === 1 ? (
        <AddServiceStep
          setCurrentStep={setCurrentStep}
          summaryBundle={summaryBundle}
          summaryService={summaryService}
          numberOfNight={numberOfNight}
        />
      ) : currentStep === 2 ? (
        <BookerOffer
          setCurrentStep={setCurrentStep}
          summaryBundle={summaryBundle.totalPrice}
          summaryService={summaryService}
        />
      ) : (
        <SummaryOffer
          numberOfNight={numberOfNight}
          summaryBundle={summaryBundle}
          summaryService={summaryService}
          arrival={arrival}
          departure={departure}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
    </PlainLayout>
  );
};

export default CreateOffer;
