/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Spin, Typography, message } from 'antd';
import { ModalAddComment, ModalConfirmation } from 'components/common';
import CommentBox from 'components/common/CommentBox';
import { ViewMode } from 'configs/const/auth';
import { FuncType } from 'configs/const/general';
import { paths } from 'constant';
import { PERPAGE } from 'constant/size';
import { useAsyncAction, useDataDisplayV2, useDidMount } from 'hooks';
import useView from 'hooks/useView';
import { TableReservation } from 'pages/@booking/ReservationsPage/partials';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getReservationsByBookingIdService, updateBookingService } from 'services/Bookings';
import { BookerPayloadProps, BookingDetailAppType } from 'services/Bookings/type';
import { ReservationDetailAppType } from 'services/Reservation/type';
import { QueryCaseType, queryCase } from 'utils/queryParams';
interface Props {
  bookingId: string;
  onSetBookingDetail: (detail: BookingDetailAppType) => void;
  bookingDetail: BookingDetailAppType;
  getBookingDetail: (bookingId: string, signal?: AbortSignal | undefined) => Promise<any>;
}

const ReservationPage: React.FC<Props> = ({
  bookingId,
  onSetBookingDetail: setBookingDetail,
  bookingDetail,
  getBookingDetail
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'bookingDetail']);
  const { currentView, currentViewObj } = useView();
  const [modalOpen, setModalOpen] = useState<string>('');

  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: PERPAGE,
    bookingId
  });

  ////////Service area///////////
  const [getAllReservation, stateAllReservation] = useAsyncAction(
    getReservationsByBookingIdService
  );
  const [updateBookingComment, stateUpdateBookingComment] = useAsyncAction(updateBookingService, {
    onSuccess: () => {
      getBookingDetail(bookingId);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  const reservationList = useDataDisplayV2<ReservationDetailAppType>(stateAllReservation);

  useEffect(() => {
    reservationList?.list &&
      setBookingDetail({
        reservations: reservationList?.list
      });
  }, [reservationList?.list]);

  const handleChangeLocation = (
    {
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      sorts = locationCurrent.sorts,
      status = locationCurrent.status,
      bookingId = locationCurrent.bookingId
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      propertyId: currentView === ViewMode.Account ? '' : currentViewObj?.code || '',
      currentPage,
      perPage,
      status,
      sorts,
      bookingId
    });

    getAllReservation(query, controller?.signal);
    // navigate(
    //   `${currentView !== ViewMode.Account ? `/${currentViewObj?.code}` : ``}/${
    //     paths.bookings
    //   }/${bookingId}/${paths.reservations}?${query}`
    // );
    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      perPage,
      status,
      sorts,
      bookingId
    });
  };

  useDidMount((controller) => {
    handleChangeLocation({}, controller);
  });
  const comment = useMemo(() => {
    return bookingDetail?.data?.comment ? bookingDetail?.data?.comment : '';
  }, [bookingDetail]);

  return (
    <div className="flex flex-col gap-8">
      <Space className="mb-2">
        <Button
          type="text"
          icon={<PlusOutlined />}
          className="text-orange-500"
          onClick={() =>
            navigate(
              `/${currentViewObj?.code}/${paths.reservations}/${paths.create}?bookingId=${bookingId}`
            )
          }
        >
          {t('bookingDetail:add_new_reservation')}
        </Button>
        {!bookingDetail?.data?.comment && (
          <Button type="text" icon={<PlusOutlined />} onClick={() => setModalOpen(FuncType.CREATE)}>
            {t('bookingDetail:add_booking_comment')}
          </Button>
        )}
      </Space>
      {stateUpdateBookingComment?.loading ? (
        <div className="flex justify-start">
          <Spin />
        </div>
      ) : (
        comment && <CommentBox comment={comment} setModalOpen={setModalOpen} />
      )}
      <Card>
        <Typography.Title level={4}>Reservations</Typography.Title>
        <TableReservation
          locationCurrent={locationCurrent}
          handleChangeLocation={handleChangeLocation}
          reservationList={reservationList}
        />
      </Card>
      <ModalAddComment
        title={t('common:table.comment')}
        modalOpen={modalOpen === FuncType.CREATE || modalOpen === FuncType.UPDATE}
        onChangeOpenModal={(value) => setModalOpen(value)}
        id={bookingId}
        comment={comment}
        onUpdate={(id: string, payload: BookerPayloadProps) => updateBookingComment(id, payload)}
        loading={stateUpdateBookingComment.loading}
      />
      <ModalConfirmation
        modalOpen={modalOpen === FuncType.DELETE}
        content={t('common:modal.confirm_content_delete')}
        onChangeOpenModal={() => setModalOpen('')}
        callBack={() => updateBookingComment(bookingId, { comment: '' } as any)}
      />
    </div>
  );
};

export default ReservationPage;
