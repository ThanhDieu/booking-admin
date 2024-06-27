import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { SearchComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import { ViewMode } from 'configs/const/auth';
import { COPYRIGHT, paths } from 'constant';
import { useAsyncAction, useDataDisplayV2, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReservationListService } from 'services/Reservation';
import { ReservationDetailAppType } from 'services/Reservation/type';
import { useAppDispatch } from 'store';
import { resetAllState } from 'store/orion/Booking';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { TableReservation } from './partials';
import { useTranslation } from 'react-i18next';

const ReservationsPage = () => {
  const { t } = useTranslation(['reservation', 'common']);

  useHelmet({
    title: t('reservation:reservation_page')
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentView, currentViewObj } = useView();

  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    propertyId: '',
    currentPage: 1,
    perPage: 10
  });

  ////////Service area///////////
  const [getAllReservation, stateAllReservation] = useAsyncAction(getReservationListService);

  ////////Reservation list///////////
  const reservationList = useDataDisplayV2<ReservationDetailAppType>(stateAllReservation);

  ////////Pagination///////////
  const handleChangeLocation = (
    {
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      sorts = locationCurrent.sorts,
      status = locationCurrent.status,
      search = locationCurrent.search,
      propertyId = locationCurrent.propertyId
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      propertyId: currentView === ViewMode.Account ? propertyId ?? '' : currentViewObj?.code ?? '',
      currentPage,
      perPage,
      status,
      sorts,
      search
    });

    getAllReservation(query, controller?.signal);
    navigate(
      `${currentView !== ViewMode.Account ? `/${currentViewObj?.code}` : ``}/${
        paths.reservations
      }?${query}`
    );
    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      perPage,
      status,
      sorts,
      search,
      propertyId
    });
  };

  ///// FUNCTIONS /////

  const handleSearch = (value: string) => {
    handleChangeLocation({
      currentPage: 1,
      search: value?.trim()
    });
  };

  //// LIFE /////
  useDidMount((controller) => {
    dispatch(resetAllState());
    handleChangeLocation(
      {
        currentPage: locationCurrent.currentPage,
        perPage: locationCurrent.perPage
      },
      controller
    );
  });

  return (
    <PlainLayout
      headerprops={{
        title: (
          <SearchComponent
            placeholderC={`${t('common:search.search_by', {
              attribute: `${t('common:search.external_code')}, ${t(
                'common:search.booking_id'
              )}, ${t('common:search.unit_name')}`
            })}`}
            onChange={handleSearch}
            allowClear
          />
        ),
        extra: [
          <Button
            type="primary"
            key="new-user-btn"
            icon={<PlusOutlined />}
            onClick={() => navigate(`${paths.create}`)}
          >
            {t('reservation:new_booking')}
          </Button>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      // className="bg-inherit"
    >
      <TableReservation
        locationCurrent={locationCurrent}
        handleChangeLocation={handleChangeLocation}
        reservationList={reservationList}
        loading={stateAllReservation.loading}
      />
    </PlainLayout>
  );
};

export default ReservationsPage;
