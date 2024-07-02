import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Space, Spin, Typography, message } from 'antd';
import { CommentBox, ModalAddComment, ModalConfirmation } from 'components/common';
import { DATE_TIME_FORMAT_1 } from 'configs/const/format';
import { A_THOUSAND, FuncType, actionReservationType } from 'configs/const/general';
import { paths } from 'constant';
import dayjs from 'dayjs';
import { useAsyncAction } from 'hooks';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateReservationService } from 'services/Reservation';
import { ReservationDetailAppType } from 'services/Reservation/type';
import { formatPriceByLocales } from 'utils/format';
import { addSpaceInString } from 'utils/text';
import { ReservationDetailPageProps } from '../index.types';
import { ModalList, actionListFunction } from '../partials';
import { actionIcons } from '../partials/MenuAction';
import { useTranslation } from 'react-i18next';
import i18n from 'i18n';

const GeneralPage = ({ reservationDetail, onChangeDetail }: ReservationDetailPageProps) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState<string>('');
  const { t } = useTranslation(['reservation', 'common']);
  const currentLanguage = i18n.language;
  //SERVICE
  const [updateResComment, stateUpdateGuestComment] = useAsyncAction(updateReservationService, {
    onSuccess: () => {
      onChangeDetail && onChangeDetail();
      setOpenModal('');
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  // DATA
  const status = useMemo(() => reservationDetail?.data?.status, [reservationDetail?.data?.status]);
  const guestInfo = useMemo(
    () => reservationDetail?.data?.primaryGuest,
    [reservationDetail?.data?.primaryGuest]
  );
  const actions = useMemo(
    () => actionListFunction(reservationDetail),
    [reservationDetail?.data?.actions]
  );
  const checkTypeButton = (type: string) => {
    return (
      type === actionReservationType.CheckIn ||
      type === actionReservationType.CheckOut ||
      (type === actionReservationType.AssignUnit && !reservationDetail?.data?.unit)
    );
  };

  const comment = useMemo(() => {
    return reservationDetail?.data?.comment ? reservationDetail?.data?.comment : '';
  }, [reservationDetail]);

  const linkBundleDetail = useMemo(
    () =>
      reservationDetail?.bundle
        ? `/${reservationDetail?.property?.extId}/${paths.bundles}/${
            reservationDetail?.bundle?.isNewsletter
              ? paths.bundlesNewsletter
              : paths.bundlesOverview
          }/${reservationDetail?.bundle?.id}`
        : '',
    [reservationDetail?.bundle]
  );
  return (
    <Space>
      <Space direction="vertical">
        <Space size="large">
          {actions?.length
            ? actions.map((item) => {
                return (
                  <Button
                    key={item.action}
                    className="text-base p-0"
                    icon={actionIcons(item.action)}
                    type={checkTypeButton(item.action) ? 'link' : 'text'}
                    onClick={() => setOpenModal(item.action)}
                  >
                    {addSpaceInString(item.action)}
                  </Button>
                );
              })
            : ''}

          {/* <Button className="text-base p-0" type="text" icon={<ThunderboltOutlined />}>
            Actions
          </Button> */}
          {/* TODO */}
          {/* <Button className="text-base p-0" type="text" icon={<QuestionCircleOutlined />}>
            Help
          </Button> */}
        </Space>
        <Space className="items-start grid grid-cols-3">
          {/* Reservation details */}
          <Space direction="vertical" className="col-span-1 ">
            <Typography.Title level={3}>{t('reservation:reservation_detail')}</Typography.Title>
            <Card>
              <Space direction="vertical" size={0} className="px-2 ">
                <Typography.Text strong className="text-base">
                  {t('common:button.create')}:{' '}
                  <Typography.Text className="font-normal">
                    {dayjs(Number(reservationDetail?.arrivalTimestamp) * A_THOUSAND).format(
                      DATE_TIME_FORMAT_1
                    )}
                  </Typography.Text>
                </Typography.Text>
                <Typography.Text strong className="text-base">
                  {t('reservation:booked_unit_group')}:{' '}
                  <Typography.Text className="font-normal">
                    {reservationDetail?.unitGroup?.extendedData?.name[currentLanguage]}
                  </Typography.Text>
                </Typography.Text>
                <Typography.Text strong className="text-base">
                  {t('reservation:adults')}:{' '}
                  <Typography.Text className="font-normal">
                    {reservationDetail?.data?.adults}
                  </Typography.Text>
                </Typography.Text>
                <Typography.Text strong className="text-base">
                  {t('reservation:status')}:{' '}
                  <Typography.Text className="font-normal">{status}</Typography.Text>
                </Typography.Text>
              </Space>
              <Space direction="vertical" size={0} className="px-2">
                <Typography.Text strong className="text-base">
                  {t('reservation:rate_plan')}:{' '}
                  <Typography.Text className="font-normal">
                    {reservationDetail?.data?.ratePlan?.name}
                  </Typography.Text>
                </Typography.Text>
                <Typography.Text strong className="text-base">
                  {t('reservation:guarantee')}:
                </Typography.Text>
                <Typography.Text strong className="text-base">
                  {t('reservation:cancellation_policy')}:{' '}
                  <Typography.Text className="font-normal">
                    {reservationDetail?.data?.cancellationFee?.description}
                  </Typography.Text>
                </Typography.Text>
                <Typography.Text strong className="text-base">
                  {t('reservation:no_show_policy')}:{' '}
                  <Typography.Text className="font-normal">
                    {reservationDetail?.data?.noShowFee?.description}
                  </Typography.Text>
                </Typography.Text>
                <Typography.Text strong className="text-base">
                  {t('reservation:channel_code')}:{' '}
                  <Typography.Text className="font-normal">
                    {reservationDetail?.data?.channelCode}
                  </Typography.Text>
                </Typography.Text>
                <Typography.Text strong className="text-base">
                  {t('reservation:price')}:{' '}
                  <Typography.Text className="font-normal ">
                    {formatPriceByLocales(
                      reservationDetail?.data?.totalGrossAmount?.amount,
                      reservationDetail?.data?.totalGrossAmount?.currency
                    )}{' '}
                    {reservationDetail?.data?.totalGrossAmount?.currency}
                  </Typography.Text>
                </Typography.Text>
              </Space>
            </Card>
            <Card>
              {linkBundleDetail !== '' && (
                <Typography.Text strong className="text-base">
                  {t('reservation:bundle_name')}:{' '}
                  <Typography.Link
                    className="font-normal"
                    onClick={() => navigate(linkBundleDetail)}
                  >
                    {reservationDetail?.bundle?.name}
                  </Typography.Link>
                </Typography.Text>
              )}
              {!comment ? (
                <Spin spinning={stateUpdateGuestComment?.loading}>
                  <Button
                    type="link"
                    icon={<PlusOutlined />}
                    className="text-base mt-2"
                    onClick={() => setOpenModal(FuncType.CREATE)}
                  >
                    {t('reservation:add_reservation_comment')}
                  </Button>
                </Spin>
              ) : (
                <Spin spinning={stateUpdateGuestComment?.loading}>
                  <CommentBox comment={comment} setModalOpen={setOpenModal} />
                </Spin>
              )}
            </Card>
            {/* </div> */}
            {/* TODO */}
            {/* <div>
              <Typography.Title level={4}>Payment account</Typography.Title>
              <Button type="link" icon={<PlusOutlined />} className="text-base">
                Add payment account
              </Button>
            </div> */}
          </Space>
          {/* Booking infomation */}
          <Space direction="vertical" className="col-span-1 ">
            <Typography.Title level={3}>{t('reservation:booking_information')}</Typography.Title>
            <Card>
              <div className="flex flex-col ">
                <Typography.Text
                  strong
                  className="text-base cursor-pointer px-2"
                  onClick={() => {
                    navigate(
                      `/${reservationDetail?.data?.property?.code}/${paths.bookings}/${reservationDetail?.data?.bookingId}`
                    );
                  }}
                >
                  ID:{' '}
                  <Typography.Text className="font-normal text-teal-600">
                    {reservationDetail?.data?.bookingId}
                  </Typography.Text>
                </Typography.Text>
                <Space direction="vertical" size="small" className="px-2">
                  <Typography.Text className="text-base border-b-2 border-slate-700">
                    {t('reservation:booker')}
                  </Typography.Text>
                  <Divider className="m-0" />
                  <Space direction="vertical" size={0}>
                    <Typography.Text className="text-base">
                      {guestInfo?.firstName}
                      {guestInfo?.lastName}
                    </Typography.Text>
                    <Typography.Text className="text-base">
                      {guestInfo?.address?.addressLine1} {guestInfo?.address?.addressLine2}{' '}
                      {guestInfo?.address?.city} {guestInfo?.address?.countryCode}
                    </Typography.Text>
                  </Space>
                  <Space direction="vertical" size={0}>
                    {guestInfo?.email && (
                      <Typography.Text strong className="text-base">
                        {t('reservation:email')}:{' '}
                        <Typography.Text className="font-normal">
                          {guestInfo?.email}
                        </Typography.Text>
                      </Typography.Text>
                    )}
                    {guestInfo?.phone && (
                      <Typography.Text strong className="text-base">
                        {t('reservation:phone')}:{' '}
                        <Typography.Text className="font-normal">
                          {guestInfo?.phone}
                        </Typography.Text>
                      </Typography.Text>
                    )}
                  </Space>
                </Space>
              </div>
            </Card>

            <Button
              type="primary"
              onClick={() => {
                navigate(
                  `/${reservationDetail?.data?.property?.code}/${paths.bookings}/${reservationDetail?.data?.bookingId}`
                );
              }}
            >
              {t('reservation:jump_to_booking')}
            </Button>
          </Space>
        </Space>
      </Space>
      {/* // MODALS */}
      <ModalList
        openModal={openModal}
        onChangeModal={setOpenModal}
        reservationItem={reservationDetail}
        onChangeLocation={onChangeDetail}
      />

      <ModalAddComment
        title={t('reservation:comment')}
        modalOpen={openModal === FuncType.CREATE || openModal === FuncType.UPDATE}
        onChangeOpenModal={() => setOpenModal('')}
        id={reservationDetail?.extId ? reservationDetail.extId : ''}
        comment={comment}
        onUpdate={(id: string, payload: ReservationDetailAppType) => updateResComment(id, payload)}
        loading={stateUpdateGuestComment?.loading}
      />
      <ModalConfirmation
        modalOpen={openModal === FuncType.DELETE}
        content={`${t('reservation:sure_to_delete_comment_booking')} ${reservationDetail?.extId}?`}
        onChangeOpenModal={() => setOpenModal('')}
        callBack={() =>
          reservationDetail?.extId && updateResComment(reservationDetail?.extId, { comment: '' })
        }
        title={t('reservation:comment')}
      />
    </Space>
  );
};

export default GeneralPage;
