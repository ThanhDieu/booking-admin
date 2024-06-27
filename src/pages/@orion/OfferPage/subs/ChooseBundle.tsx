import { Button, Space, Typography } from 'antd';
import { useAsyncAction, useDataDisplayV2 } from 'hooks';
import { BundleListResult, FormSearchBundle } from 'pages/@orion/ReservationsPage/partials';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getBundlesService } from 'services/Bundle';
import { BundleListType } from 'services/Bundle/type';
import { useAppSelector } from 'store';
import { StateAccommodation } from 'store/orion/Booking';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import TableSelectedBundle from '../partials/TableSelectedBundle';

interface Props {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}
const ChooseBundle = ({ setCurrentStep }: Props) => {
  const { t } = useTranslation(['offer']);
  const [currentLocation, setCurrentLocation] = useState<QueryCaseType>({
    currentPage: 1
  });

  const { bundleOfferSelected } = useAppSelector((state) => state.orion.offer);
  const { stateAccommodation, payloadSearch } = useAppSelector((state) => state.orion.booking);

  //SERVICE
  const [fetchBundles, stateBundles] = useAsyncAction(getBundlesService);

  // HANDLE PAGINATION
  const handleChangeLocation = ({
    currentPage = currentLocation.currentPage,
    arrival = currentLocation.arrival,
    departure = currentLocation.departure,
    adults = currentLocation.adults,
    children = currentLocation.children,
    propertyId = currentLocation.propertyId,
    online = true
  }: QueryCaseType) => {
    const query = queryCase({
      propertyId,
      currentPage,
      arrival,
      departure,
      adults,
      children,
      online
    });

    fetchBundles(query);
    setCurrentLocation({
      ...currentLocation,
      propertyId,
      currentPage,
      arrival,
      departure,
      adults,
      online
    });
  };

  useEffect(() => {
    payloadSearch &&
      handleChangeLocation({
        ...currentLocation,
        adults: payloadSearch.adults,
        children: payloadSearch?.children,
        arrival: payloadSearch?.arrival?.toString(),
        departure: payloadSearch?.departure?.toString(),
        propertyId: payloadSearch?.propertyId
      });
  }, [payloadSearch]);

  //DATA
  const bundles = useDataDisplayV2<BundleListType>(stateBundles);

  return (
    <div className="flex flex-col">
      {(stateAccommodation === StateAccommodation.Search ||
        stateAccommodation === StateAccommodation.Select) && (
        <>
          <Typography.Title level={3}>
            {t('reservation:property_and_travel_dates')}
          </Typography.Title>
          <FormSearchBundle loading={stateBundles?.loading} isOffer />
        </>
      )}

      {stateAccommodation === StateAccommodation.Select && (
        <div className="flex flex-col gap-5">
          <Space direction="vertical" className="mt-10" size={30}>
            <TableSelectedBundle />

            <BundleListResult
              bundles={bundles}
              loading={stateBundles?.loading}
              handleChangeLocation={handleChangeLocation}
              currentLocation={currentLocation}
              isOffer
              // initialBundlistArrKey={initialBundlistArrKey}
            />
          </Space>
          {bundleOfferSelected?.length > 0 && (
            <Button className="w-fit " type="primary" onClick={() => setCurrentStep(1)}>
              {t('common:button.continue')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChooseBundle;
