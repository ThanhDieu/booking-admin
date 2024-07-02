/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Space, Typography } from 'antd';
import { paths } from 'constant';
import { useAsyncAction, useDataDisplayV2 } from 'hooks';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createReservationByBookingId } from 'services/Bookings';
import { getBundlesService } from 'services/Bundle';
import { BundleListType } from 'services/Bundle/type';
import { useAppDispatch, useAppSelector } from 'store';
import { StateAccommodation, resetAllState } from 'store/booking/Booking';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { BundleListResult, FormCreateBooking, FormSearchBundle } from '../partials';
import { useTranslation } from 'react-i18next';

interface Props {
  currentCardRes: number | undefined;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  setCurrentCardRes: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const CreateAccommodation = ({ setCurrentStep, currentCardRes, setCurrentCardRes }: Props) => {
  const { t } = useTranslation(['reservation']);
  const { message } = App.useApp();
  const dispatch = useAppDispatch();
  const { stateAccommodation, payloadSearch, bundleSelected } = useAppSelector(
    (state) => state.booking.booking
  );
  const navigate = useNavigate();
  const location = useLocation();

  const bookingId = location?.search !== '' ? location?.search?.split('=')[1] : undefined;

  const [currentLocation, setCurrentLocation] = useState<QueryCaseType>({
    currentPage: 1
  });

  const [createReservation, stateCreateReservation] = useAsyncAction(createReservationByBookingId, {
    onSuccess: () => {
      const propertyId = location?.pathname?.split('/')[1];
      navigate(`/${propertyId}/${paths.bookings}/${bookingId}/${paths.reservations}`);
      dispatch(resetAllState());
      message.success('Success!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  const [fetchBundles, stateBundles] = useAsyncAction(getBundlesService);
  // Handle Pagination
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
      adults
    });
  };

  const bundles = useDataDisplayV2<BundleListType>(stateBundles);

  useEffect(() => {
    payloadSearch &&
      handleChangeLocation({
        ...currentLocation,
        adults: payloadSearch.adults,
        children: payloadSearch?.children.join(','),
        arrival: payloadSearch?.arrival?.toString(),
        departure: payloadSearch?.departure?.toString(),
        propertyId: payloadSearch?.propertyId
      });
  }, [payloadSearch, bundleSelected]);

  return (
    <div>
      <div className="flex flex-col">
        {(stateAccommodation === StateAccommodation.Search ||
          stateAccommodation === StateAccommodation.Select) && (
            <>
              <Typography.Title level={3}>
                {t('reservation:property_and_travel_dates')}
              </Typography.Title>
              <FormSearchBundle loading={stateBundles?.loading} />
            </>
          )}
        {stateAccommodation === StateAccommodation.Select && (
          <Space direction="vertical" className="mt-10">
            <Typography.Title level={3}>{t('reservation:bundles')}</Typography.Title>
            <BundleListResult
              bundles={bundles}
              loading={stateBundles?.loading}
              handleChangeLocation={handleChangeLocation}
              currentLocation={currentLocation}
            />
          </Space>
        )}
      </div>
      {stateAccommodation === StateAccommodation.ExtraInfo && (
        <FormCreateBooking
          currentCardRes={currentCardRes}
          loading={stateCreateReservation.loading}
          setCurrentStep={setCurrentStep}
          setCurrentCardRes={setCurrentCardRes}
          createReservation={createReservation}
        />
      )}
    </div>
  );
};

export default CreateAccommodation;
