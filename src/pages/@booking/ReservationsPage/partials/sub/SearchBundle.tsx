import { Space } from 'antd';
import { useAsyncAction, useDataDisplayV2 } from 'hooks';
import { useEffect, useState } from 'react';
import { getBundlesService } from 'services/Bundle';
import { BundleListType } from 'services/Bundle/type';
import { ReservationDetailAppType } from 'services/Reservation/type';
import { useAppSelector } from 'store';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { BundleListResult, FormSearchBundle } from '../booking';

interface Props {
  action: string[];
  detail: ReservationDetailAppType;
}

const IndexSub: React.FC<Props> = ({ action, detail }) => {
  // SERVICES
  const [fetchBundles, stateBundles] = useAsyncAction(getBundlesService);
  const bundles = useDataDisplayV2<BundleListType>(stateBundles);

  const { payloadSearch, bundleSelected } = useAppSelector((state) => state.booking.booking);
  const [currentLocation, setCurrentLocation] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: 100
  });

  // FUNCTIONS
  const handleChangeLocation = ({
    currentPage = currentLocation.currentPage,
    arrival = currentLocation.arrival,
    departure = currentLocation.departure,
    adults = currentLocation.adults,
    propertyId = currentLocation.propertyId,
    online = true
  }: QueryCaseType) => {
    const query = queryCase({
      propertyId,
      currentPage,
      arrival,
      departure,
      adults,
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

  // LIFE
  useEffect(() => {
    payloadSearch &&
      handleChangeLocation({
        ...currentLocation,
        adults: payloadSearch.adults,
        arrival: payloadSearch?.arrival?.toString(),
        departure: payloadSearch?.departure?.toString(),
        propertyId: payloadSearch?.propertyId
      });
  }, [payloadSearch, bundleSelected]);
  return (
    <div className="flex flex-col">
      <FormSearchBundle
        loading={stateBundles?.loading}
        status={action}
        data={{
          period: {
            from: detail?.arrivalTimestamp,
            to: detail?.departureTimestamp
          }
        }}
      />
      {(payloadSearch || bundleSelected) && (
        <Space direction="vertical" className="mt-10">
          <BundleListResult
            bundles={bundles}
            loading={stateBundles?.loading}
            handleChangeLocation={handleChangeLocation}
            currentLocation={currentLocation}
          />
        </Space>
      )}
    </div>
  );
};
export default IndexSub;
