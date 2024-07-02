/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CalendarOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  CreditCardOutlined,
  CustomerServiceOutlined,
  FormOutlined,
  HighlightOutlined,
  HomeOutlined,
  KeyOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { TimeSliceBookingType, TimeSliceType } from '@types';
import { App, Button, Space, Spin, Typography } from 'antd';
import { GeneralReservationInfo } from 'components/common';
import { GeneralReservationInfoProps } from 'components/common/GeneralReservationInfo';
import XIcon from 'components/shared/Icon';
import { DATE_FORMAT_1, DATE_FORMAT_2 } from 'configs/const/format';
import { A_THOUSAND } from 'configs/const/general';
import { paths } from 'constant';
import dayjs from 'dayjs';
import { useAsyncAction } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { amendReservationService } from 'services/Reservation';
import { useAppDispatch, useAppSelector } from 'store';
import { resetAllState } from 'store/booking/Booking';
import { totalPriceBundle } from 'utils/array';
import { arrayDateInDateRange } from 'utils/dayjs';
import { formatPriceByLocales } from 'utils/format';
import { ReservationDetailPageProps } from '../index.types';
import { ModalAssignUnit, SearchBundle } from '../partials';
import CurrentPeriodCard from '../partials/CurrentPeriodCard';

export const ActionReservationDetailType = {
  AmendArrival: 'AmendArrival',
  AssignUnit: 'AssignUnit',
  AmendDeparture: 'AmendDeparture'
  // AmendTimeSlices: 'AmendTimeSlices'
};
const actionIcons = (type: string) => {
  switch (type) {
    case ActionReservationDetailType.AmendArrival:
      return <XIcon name="planeArrival" />;
    case ActionReservationDetailType.AmendDeparture:
      return <XIcon name="planeDeparture" />;
    case ActionReservationDetailType.AssignUnit:
      return <KeyOutlined />;
    default:
      return <FormOutlined />;
  }
};
const formatDay = (day: number | string | undefined) => {
  return day ? dayjs(Number(day) * A_THOUSAND).format(DATE_FORMAT_2) : '';
};

const TravelDatePage: React.FC<ReservationDetailPageProps> = ({
  reservationDetail,
  onChangeDetail
}) => {
  const { message } = App.useApp();
  const [openModal, setOpenModal] = useState<string>('');
  const { bundleSelected, payloadSearch } = useAppSelector((state) => state.booking.booking);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { t } = useTranslation(['reservation', 'common']);

  // SERVICES
  const [amendReservation, stateAmendReservation] = useAsyncAction(amendReservationService, {
    onSuccess: () => {
      handleDetails();
      handleCancel();
      message.success('Success!', 2);
    },
    onFailed: (error: any) => {
      message.error(error.message, 10);
    }
  });

  // FUNCTIONS
  const handleDetails = () => {
    const propertyId = reservationDetail?.data?.property?.code;
    reservationDetail?.extId && propertyId && onChangeDetail && onChangeDetail();
  };
  const checkTypeButton = (type: string) => {
    return (
      type === ActionReservationDetailType.AmendArrival ||
      type === ActionReservationDetailType.AmendDeparture ||
      (type === ActionReservationDetailType.AssignUnit && !reservationDetail?.data?.unit)
    );
  };

  const handleChangeDayArray = () => {
    const newData = {
      ...bundleSelected,
      ratePlanId: bundleSelected?.ratePlan?.extId,
      amount: {
        amount: Number(bundleSelected?.totalPrice) || 0,
        currency: bundleSelected?.currency || ''
      },
      totalGrossAmount: {
        amount: Number(bundleSelected?.totalPrice) || 0,
        currency: bundleSelected?.currency || ''
      }
    };
    const dateRange = arrayDateInDateRange(
      payloadSearch?.arrival || 0,
      payloadSearch?.departure || 0
    ).map((date) => ({
      ...newData,
      from: dayjs(date).format(DATE_FORMAT_1)
    }));
    if (reservationDetail?.data?.timeSlices?.length) {
      dateRange.forEach(function (element1) {
        reservationDetail?.data?.timeSlices.forEach(function (element2) {
          if (element1.from === dayjs(element2.from).format(DATE_FORMAT_1)) {
            element1.ratePlanId = element2?.ratePlan?.id;
            element1.amount = {
              amount: Number(element2?.totalGrossAmount.amount) || 0,
              currency: element2?.totalGrossAmount?.currency || ''
            };
            element1.totalGrossAmount = element1.amount;
          }
        });
      });
    }
    return dateRange;
  };

  const handleAmendSave = () => {
    if (reservationDetail?.extId) {
      const slices = handleChangeDayArray();
      amendReservation(reservationDetail?.extId, {
        adults: payloadSearch?.adults,
        arrival: payloadSearch?.arrival ? dayjs(payloadSearch.arrival * A_THOUSAND).unix() : 0,
        departure: payloadSearch?.departure
          ? dayjs(payloadSearch.departure * A_THOUSAND).unix()
          : 0,
        timeSlices: slices.map((slice) => ({
          ratePlanId: slice.ratePlanId,
          totalAmount: {
            amount: slice?.amount?.amount,
            currency: slice?.amount?.currency || ''
          }
        }))
      });
    }
  };

  const handleCancel = () => {
    setOpenModal('');
    dispatch(resetAllState());
  };

  const isAllowedAction = (status: string) => {
    return (
      actions && actions?.findIndex((action) => action.isAllowed && action.action === status) > -1
    );
  };

  // DATA
  const actions = useMemo(
    () =>
      reservationDetail?.data?.actions?.filter((item) =>
        Object.values(ActionReservationDetailType).some(
          (value) => item.action === value && item.isAllowed
        )
      ),
    [reservationDetail?.data?.actions]
  );
  const numberOfNights = useMemo(
    () => reservationDetail?.data?.timeSlices?.length,
    [reservationDetail?.data?.timeSlices]
  );
  const arrivalFormat = useMemo(
    () => formatDay(reservationDetail?.arrivalTimestamp),
    [reservationDetail?.arrivalTimestamp]
  );
  const departureFormat = useMemo(
    () => formatDay(reservationDetail?.departureTimestamp),
    [reservationDetail?.departureTimestamp]
  );

  const itemsResShortInfo = useMemo(() => {
    if (bundleSelected) {
      const numberOfNight = dayjs(Number(payloadSearch?.departure) * A_THOUSAND).diff(
        dayjs(Number(payloadSearch?.arrival) * A_THOUSAND),
        'day'
      );
      const totalPrices = totalPriceBundle(bundleSelected);

      return [
        {
          icon: <CalendarOutlined />,
          value:
            formatDay(payloadSearch?.arrival) +
            ' - ' +
            formatDay(payloadSearch?.departure) +
            ', ' +
            numberOfNight +
            ' ' +
            ` ${t('common:general.nights')}`
        },
        {
          icon: <CloseCircleOutlined />,
          value: reservationDetail?.data?.cancellationFee?.name
        },
        {
          icon: <CreditCardOutlined />,
          value: reservationDetail?.data?.guaranteeType || ''
        },
        totalPrices.totalUnit && {
          icon: <HomeOutlined />,
          value: `${t('reservation:accommodation')}: ${totalPrices.totalUnit} ${bundleSelected?.currency || ''
            }`
        },
        totalPrices.totalService && {
          icon: <CustomerServiceOutlined />,
          value: `${t('reservation:service')}: ${totalPrices.totalService} ${bundleSelected?.currency || ''
            }`
        },
        {
          icon: <ShoppingCartOutlined />,
          value: `${t('reservation:total')}: ${formatPriceByLocales(
            bundleSelected.totalPrice,
            bundleSelected?.currency
          )} ${bundleSelected?.currency || ''}`
        }
      ] as GeneralReservationInfoProps[];
    }
    return [
      {
        icon: <XIcon name="hotel" className=" text-xl" />,
        value: reservationDetail?.data?.property?.code
      },
      {
        icon: <XIcon name="info" className=" text-xl" />,
        value: numberOfNights && numberOfNights >= 1 ? 'Over night' : 'Day use'
      },
      {
        icon: <XIcon name="userGroup" className=" text-xl" />,
        value: reservationDetail?.data?.adults
      },
      {
        icon: <XIcon name="calendar" className=" text-xl" />,
        value:
          arrivalFormat +
          ' - ' +
          departureFormat +
          ', ' +
          numberOfNights +
          ` ${t('common:general.nights')}`
      },
      {
        icon: <XIcon name="cancel" className=" text-xl" />,
        value: reservationDetail?.data?.cancellationFee?.name
      },
      {
        icon: <XIcon name="creditCard" className=" text-xl" />,
        value: reservationDetail?.data?.guaranteeType
      }
    ] as GeneralReservationInfoProps[];
  }, [reservationDetail, bundleSelected]);

  const newSlices: any = useMemo(() => {
    if (bundleSelected) {
      return handleChangeDayArray();
    }
    return reservationDetail?.data?.timeSlices;
  }, [reservationDetail?.data?.timeSlices, bundleSelected]);

  // LIFE
  useEffect(() => {
    if (location?.pathname?.split(',')[4] !== paths.travelDates) handleCancel();
  }, [location?.pathname]);

  return (
    <Space direction="vertical" className="w-full">
      <Spin spinning={stateAmendReservation.loading}>
        <Space size="large">
          {openModal === ActionReservationDetailType.AmendArrival ||
            openModal === ActionReservationDetailType.AmendDeparture ? (
            <Button type="text" icon={<CloseOutlined />} onClick={handleCancel} danger>
              {t('common:button.close')}
            </Button>
          ) : (
            ''
          )}
          {isAllowedAction(ActionReservationDetailType.AmendArrival) ||
            isAllowedAction(ActionReservationDetailType.AmendDeparture) ? (
            <Button
              className="text-base p-0"
              icon={<HighlightOutlined />}
              type="link"
              onClick={() =>
                setOpenModal(
                  isAllowedAction(ActionReservationDetailType.AmendArrival)
                    ? ActionReservationDetailType.AmendArrival
                    : ActionReservationDetailType.AmendDeparture
                )
              }
              disabled={
                openModal === ActionReservationDetailType.AmendArrival ||
                openModal === ActionReservationDetailType.AmendDeparture
              }
            >
              {t('reservation:amend_stay')}
            </Button>
          ) : (
            ''
          )}

          {isAllowedAction(ActionReservationDetailType.AssignUnit) ? (
            <Button
              className="text-base p-0"
              icon={actionIcons(ActionReservationDetailType.AssignUnit)}
              type={checkTypeButton(ActionReservationDetailType.AssignUnit) ? 'link' : 'text'}
              onClick={() => setOpenModal(ActionReservationDetailType.AssignUnit)}
              disabled={
                openModal === ActionReservationDetailType.AmendArrival ||
                openModal === ActionReservationDetailType.AmendDeparture
              }
            >
              {t('reservation:assign_unit')}
            </Button>
          ) : (
            ''
          )}
          {/* TODO */}
          {/* <Button type="text" icon={<QuestionCircleOutlined />}>
            Help
          </Button> */}
        </Space>
        {(openModal === ActionReservationDetailType.AmendArrival ||
          openModal === ActionReservationDetailType.AmendDeparture) && (
            <>
              <Typography.Title level={3}>
                {t('reservation:accommodation_and_travel_information')}
              </Typography.Title>
              <SearchBundle
                action={[
                  !isAllowedAction(ActionReservationDetailType.AmendArrival)
                    ? ActionReservationDetailType.AmendArrival
                    : '',
                  !isAllowedAction(ActionReservationDetailType.AmendDeparture)
                    ? ActionReservationDetailType.AmendDeparture
                    : ''
                ]}
                detail={reservationDetail}
              />
            </>
          )}
        <section className="flex flex-col">
          {openModal !== ActionReservationDetailType.AmendArrival &&
            openModal !== ActionReservationDetailType.AmendDeparture ? (
            <>
              <Typography.Title level={3}>{t('reservation:travel_information')}</Typography.Title>
              {itemsResShortInfo && <GeneralReservationInfo items={itemsResShortInfo} />}
            </>
          ) : (
            ''
          )}

          {bundleSelected &&
            (openModal === ActionReservationDetailType.AmendArrival ||
              openModal === ActionReservationDetailType.AmendDeparture) ? (
            <>
              <Typography.Title level={3}>{t('reservation:updated_period')}</Typography.Title>
              {itemsResShortInfo && <GeneralReservationInfo items={itemsResShortInfo} />}
              <Space className="my-5 ">
                <Button type="primary" onClick={handleAmendSave}>
                  {t('common:button.apply_changes')}
                </Button>
                <Button type="primary" onClick={handleCancel}>
                  {t('common:button.reset')}
                </Button>
              </Space>
            </>
          ) : (
            ''
          )}
          <Typography.Title className="mt-8" level={3}>
            {t('reservation:current_period')}
          </Typography.Title>

          <div className="grid grid-cols-4 ">
            {newSlices?.map((slice: TimeSliceType | TimeSliceBookingType, idx: number) => (
              <CurrentPeriodCard key={idx} slice={slice as TimeSliceType} idx={idx} />
            ))}
          </div>
        </section>
        {openModal === ActionReservationDetailType.AssignUnit && (
          <ModalAssignUnit
            modalOpen={openModal === ActionReservationDetailType.AssignUnit}
            detail={reservationDetail}
            onChangeOpenModal={setOpenModal}
            onChangeLocation={handleDetails}
          />
        )}
      </Spin>
    </Space>
  );
};

export default TravelDatePage;
