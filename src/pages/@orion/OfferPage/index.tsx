import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { SearchComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import { ViewMode } from 'configs/const/auth';
import { COPYRIGHT, paths } from 'constant';
import { useAsyncAction, useDataDisplayV2, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getOfferListService } from 'services/Offer';
import { OfferDetailType } from 'services/Offer/type';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { TableOffer } from './partials';

const OfferPage = () => {
  const { t } = useTranslation(['offer']);
  const navigate = useNavigate();
  const { currentView, currentViewObj } = useView();

  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: 10
  });

  ////////Service area///////////
  const [getAllOffer, stateGetAllOffer] = useAsyncAction(getOfferListService);

  ////////Reservation list///////////
  const offerList = useDataDisplayV2<OfferDetailType>(stateGetAllOffer);

  ////////Pagination///////////
  const handleChangeLocation = (
    {
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      sorts = locationCurrent.sorts,
      status = locationCurrent.status,
      search = locationCurrent.search
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      propertyId: currentView === ViewMode.Account ? '' : currentViewObj?.code || '',
      currentPage,
      perPage,
      status,
      sorts,
      search
    });

    getAllOffer(query, controller?.signal);
    navigate(
      `${currentView !== ViewMode.Account ? `/${currentViewObj?.code}` : ``}/${
        paths.offer
      }?${query}`
    );
    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      perPage,
      status,
      sorts,
      search
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
    handleChangeLocation(
      {
        currentPage: locationCurrent.currentPage,
        perPage: locationCurrent.perPage
      },
      controller
    );
  });

  useHelmet({
    title: t('offer:offer_page')
  });

  return (
    <PlainLayout
      headerprops={{
        title: (
          <SearchComponent
            placeholderC={t('offer:search_placeholder')}
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
            {t('offer:create_offer')}
          </Button>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
    >
      <TableOffer
        locationCurrent={locationCurrent}
        handleChangeLocation={handleChangeLocation}
        offerList={offerList}
        loading={stateGetAllOffer.loading}
      />
    </PlainLayout>
  );
};

export default OfferPage;
