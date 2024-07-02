import { Spin, Tabs, TabsProps } from 'antd';
import { PlainLayout } from 'components/layout';
import { ErrorPageStatus } from 'configs/const/auth';
import { PrivateRoute } from 'configs/route';
import { COPYRIGHT, paths } from 'constant';
import { useAsyncAction, useDetailDisplay, useDidMount } from 'hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getReservationDetailService } from 'services/Reservation';
import { ReservationDetailAppType } from 'services/Reservation/type';
import HeaderSection from './partials/HeaderSection';
import { ExtrasPage, GeneralPage, GuestPage, TravelDatePage } from './subs';

const ReservationDetailPage = () => {
  const navigate = useNavigate();
  const param = useParams();
  const location = useLocation();
  const { t } = useTranslation(['reservation']);
  const [notPermision, setNotPermision] = useState<string>()

  const [getReservationDetail, reservationDetailState] = useAsyncAction(
    getReservationDetailService, {
    onSuccess: () => {
      setNotPermision(undefined)
    },
    onFailed: () => {
      setNotPermision(ErrorPageStatus.notFound)
    }
  }

  );

  const fetchReservationDetail = (controller?: AbortController) => {
    if (param.code && param.id) {
      getReservationDetail(param?.code, param?.id, controller?.signal);
    }
  };

  useDidMount((controller) => {
    fetchReservationDetail(controller);
  });

  const onGetDetail = () => {
    if (param.code && param.id) {
      getReservationDetail(param?.code, param?.id);
    }
  };

  const reservationDetail = useDetailDisplay<ReservationDetailAppType>(reservationDetailState);

  const items: TabsProps['items'] = [
    {
      key: `${paths.general}`,
      label: t('general').toUpperCase(),
      children: <GeneralPage reservationDetail={reservationDetail} onChangeDetail={onGetDetail} />
    },
    {
      key: `${paths.guests}`,
      label: t('guests').toUpperCase(),
      children: (
        <GuestPage
          reservationDetail={reservationDetail}
          onChangeDetail={onGetDetail}
          getReservationDetail={fetchReservationDetail}
        />
      )
    },
    {
      key: `${paths.travelDates}`,
      label: t('travel_dates').toUpperCase(),
      children: (
        <TravelDatePage reservationDetail={reservationDetail} onChangeDetail={onGetDetail} />
      )
    },
    {
      key: `${paths.extras}`,
      label: t('extras').toUpperCase(),
      children: <ExtrasPage reservationDetail={reservationDetail} onChangeDetail={onGetDetail} />
    }
  ];

  return (
    <PlainLayout
      headerprops={{
        title: t('reservation_detail')
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
    >
      <PrivateRoute hardCode={notPermision} >
        <Spin spinning={reservationDetailState?.loading}>
          <HeaderSection reservationDetail={reservationDetail} />
          <Tabs
            defaultActiveKey={paths.general}
            items={items}
            onChange={(key: string) => navigate(`${key}`)}
            activeKey={
              location?.pathname?.split('/')?.length > 4
                ? location?.pathname?.split('/')[location.pathname.split('/').length - 1]
                : paths.general
            }
          />
        </Spin>
      </PrivateRoute>
    </PlainLayout>
  );
};

export default ReservationDetailPage;
