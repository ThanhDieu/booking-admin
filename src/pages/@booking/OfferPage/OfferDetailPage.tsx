import { Spin, Tabs, TabsProps } from 'antd';
import { PlainLayout } from 'components/layout';
import { ErrorPageStatus } from 'configs/const/auth';
import { PrivateRoute } from 'configs/route';
import { COPYRIGHT, paths } from 'constant';
import { useAsyncAction, useDetailDisplay, useDidMount } from 'hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getOfferDetailService } from 'services/Offer';
import { OfferDetailType } from 'services/Offer/type';
import { ExtraServicePage, GuestPage, HeaderSection, TravelDatePage } from './subs/details';

const OfferDetailPage = () => {
  const navigate = useNavigate();
  const param = useParams();
  const location = useLocation();
  const { t } = useTranslation(['offer']);
  const [notPermision, setNotPermision] = useState<string>();

  const [getOfferDetail, offerDetailState] = useAsyncAction(getOfferDetailService, {
    onSuccess: () => {
      setNotPermision(undefined);
    },
    onFailed: () => {
      setNotPermision(ErrorPageStatus.notFound);
    }
  });

  useDidMount(
    (controller) => {
      if (param?.id) getOfferDetail(param.id, controller?.signal);
    },
    [param?.id]
  );

  const offerDetail = useDetailDisplay<OfferDetailType>(offerDetailState);

  const items: TabsProps['items'] = [
    {
      key: `${paths.guests}`,
      label: t('guests').toUpperCase(),
      children: <GuestPage offerDetail={offerDetail} loading={offerDetailState?.loading} />
    },
    {
      key: `${paths.travelDates}`,
      label: t('travel_dates').toUpperCase(),
      children: <TravelDatePage offerDetail={offerDetail} />
    },
    {
      key: `${paths.extras}`,
      label: t('extras').toUpperCase(),
      children: <ExtraServicePage offerDetail={offerDetail} />
    }
  ];

  return (
    <PlainLayout
      headerprops={{
        title: t('offer_detail')
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
    >
      <PrivateRoute hardCode={notPermision}>
        <Spin spinning={offerDetailState?.loading}>
          <HeaderSection offerDetail={offerDetail} />
          <Tabs
            defaultActiveKey={paths.guests}
            items={items}
            onChange={(key: string) => navigate(`${key}`)}
            activeKey={
              location?.pathname?.split('/')?.length > 3
                ? location?.pathname?.split('/')[location.pathname.split('/').length - 1]
                : paths.guests
            }
          />
        </Spin>
      </PrivateRoute>
    </PlainLayout>
  );
};

export default OfferDetailPage;
