import { PlusOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { SelectProps } from 'antd/es/select';
import { DATE_FORMAT_1 } from 'configs/const/format';
import { statusReservationType } from 'configs/const/general';
import { paths } from 'constant';
import dayjs from 'dayjs';
import { useAsyncAction, useDataDisplay } from 'hooks';
import useView from 'hooks/useView';
import { useEffect, useMemo, useState } from 'react';
import { getServicesByPropertyService } from 'services/ServiceList';
import { ServiceDetailAppType } from 'services/ServiceList/type';
import { arrayDateInDateRange } from 'utils/dayjs';
import { ReservationDetailPageProps } from '../index.types';
import { ExtraService, ModalAddService, RatePlanExtras } from '../partials';
import { modeKeys } from '../partials/modals/ModalAddService';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';

const ExtrasPage = ({ reservationDetail, onChangeDetail }: ReservationDetailPageProps) => {
  const [openModal, setOpenModal] = useState<string>('');
  const { currentViewObj } = useView();
  const { t } = useTranslation(['common', 'reservation']);
  const currentLanguage = i18n.language;

  ///// SERVICES
  const [getServiceList, stateServiceList] = useAsyncAction(getServicesByPropertyService);

  /////  DATA
  const services = useDataDisplay<ServiceDetailAppType>(stateServiceList);
  const currentServices = useMemo(() => {
    return reservationDetail?.data?.services || [];
  }, [reservationDetail]);
  const checkModeService = (svDetail: ServiceDetailAppType) => {
    return (
      svDetail.mode?.toLowerCase() === modeKeys[1]?.toLowerCase() ||
      svDetail.mode?.toLowerCase() === modeKeys[2]?.toLowerCase()
    );
  };

  const rangeAvailableDates = useMemo(() => {
    return arrayDateInDateRange(
      dayjs(reservationDetail?.data?.arrival).unix() || 0,
      dayjs(reservationDetail?.data?.departure).unix() || 0,
      true
    ).map((date) => dayjs(date).format(DATE_FORMAT_1));
  }, [reservationDetail?.data]);

  // TODO
  const servicesOptions: SelectProps['options'] = useMemo(() => {
    const options = services
      ?.filter((service) => {
        return currentServices?.some((field) => {
          return (
            field?.service?.id === service.extId &&
            (field?.dates?.length === rangeAvailableDates?.length ||
              field?.dates?.length >=
                rangeAvailableDates?.length - dayjs().diff(dayjs(rangeAvailableDates[0]), 'day') ||
              checkModeService(service))
          );
        });
      })
      .map((item) => item.extId);

    return services?.map((value) => ({
      label: value?.extendedData?.name[currentLanguage],
      value: value.extId,
      disable: options.includes(value.extId),
      className: options.includes(value.extId) ? 'hidden' : ''
    }));
  }, [services, currentServices]);

  const checkShowButton = useMemo(() => {
    return (
      servicesOptions?.length &&
      servicesOptions.findIndex((service) => !service?.disable) > -1 &&
      reservationDetail?.data?.status !== statusReservationType.Canceled
    );
  }, [servicesOptions, reservationDetail?.data]);

  ///// LIFE
  useEffect(() => {
    if (currentViewObj?.code) getServiceList(currentViewObj.code);
  }, []);

  return (
    <Space direction="vertical" className="w-full">
      {/* BUTTON AREA */}
      <Space className="w-full">
        {checkShowButton ? (
          <Button
            icon={<PlusOutlined />}
            type="link"
            onClick={() => setOpenModal(paths.services)}
            className="text-base p-0"
          >
            {t('reservation:add_service')}
          </Button>
        ) : (
          ''
        )}
        {/* TODO */}
        {/* <Button type="text" icon={<QuestionCircleOutlined />} className="text-base p-0">
          Help
        </Button> */}
      </Space>
      {/* EXTRA SERVICE AREA */}
      <ExtraService getReservationDetail={onChangeDetail} reservationDetail={reservationDetail} />

      {/* Bundle services */}
      <RatePlanExtras reservationDetail={reservationDetail} />

      {openModal === paths.services && (
        <ModalAddService
          modalOpen={openModal === paths.services}
          onChangeOpenModal={setOpenModal}
          detail={reservationDetail}
          onChangeLocation={onChangeDetail}
          services={services}
          servicesOptions={servicesOptions}
          rangeAvailableDates={rangeAvailableDates}
        />
      )}
    </Space>
  );
};

export default ExtrasPage;
