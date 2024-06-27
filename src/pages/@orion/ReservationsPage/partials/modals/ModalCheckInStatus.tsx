/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Modal, Spin, Typography } from 'antd';
import { useAsyncAction, useDetailDisplay } from 'hooks';
import { useEffect } from 'react';
import {
  actionReservationCheckinService,
  assignUnitReservationService
} from 'services/Reservation';
import { getUnitByIdService } from 'services/Units';
import { ConditionEnum, UnitDetailAppType } from 'services/Units/type';
import { ModalActionReservationProps } from '../../index.types';

const IndexModal: React.FC<ModalActionReservationProps> = ({
  onChangeOpenModal,

  modalOpen,

  onChangeLocation: handleChangeLocation,
  detail
}) => {
  const { message } = App.useApp();
  //SERVICES
  const [getUnitDetails, unitDetailsState] = useAsyncAction(getUnitByIdService);
  const [actionReservationCheckin, stateActionReservationCheckin] = useAsyncAction(
    actionReservationCheckinService,
    {
      onSuccess: () => {
        message.success('Check in success!', 2);
        onChangeOpenModal('');
        handleChangeLocation && handleChangeLocation({});
      },
      onFailed: (error: any) => {
        message.error(error?.message, 2);
      }
    }
  );

  const [assignUnitReservation, assignUnitReservationState] = useAsyncAction(
    assignUnitReservationService,
    {
      onSuccess: () => {
        detail?.extId && actionReservationCheckin(detail.extId);
      },
      onFailed: (error: any) => {
        message.error(error?.message, 2);
      }
    }
  );

  // FUNCTIONS

  const handleCheckin = () => {
    if (detail?.data?.unit?.id) {
      detail?.extId && actionReservationCheckin(detail.extId);
    } else {
      detail?.extId && assignUnitReservation(detail.extId);
    }
  };

  // LIFE
  useEffect(() => {
    if (detail?.data?.unit?.id) getUnitDetails(detail.data.unit.id);
  }, [detail?.data?.unit?.id]);
  const unitDetails = useDetailDisplay<UnitDetailAppType>(unitDetailsState);

  return (
    <Modal
      title={`Check in ${
        `${detail?.data?.primaryGuest?.firstName || ''} ${
          detail?.data?.primaryGuest?.middleInitial || ''
        } ${detail?.data?.primaryGuest?.lastName || ''}` || ''
      }`}
      centered
      open={modalOpen}
      footer={null}
      closable={false}
      onCancel={() => onChangeOpenModal('')}
      maskClosable={false}
    >
      <Spin
        spinning={
          unitDetailsState.loading ||
          stateActionReservationCheckin?.loading ||
          assignUnitReservationState?.loading
        }
      >
        {detail?.data?.unit?.id ? (
          <>
            {unitDetails?.data?.status?.condition?.toLowerCase() ===
              ConditionEnum.Clean.toLowerCase() && (
              <Typography.Text>
                Are you sure you want to check in the guest to {unitDetails?.name || ''}?
              </Typography.Text>
            )}
            {unitDetails?.data?.status?.condition?.toLowerCase() ===
              ConditionEnum.Dirty.toLowerCase() && (
              <>
                <Typography.Text>
                  The unit {unitDetails?.name || ''} assigned to this reservation currently has the
                  following condition: <strong>{unitDetails?.data?.status?.condition || ''}</strong>{' '}
                </Typography.Text>
                <Typography.Text className="mt-3 block">
                  Are you sure you want to proceed?
                </Typography.Text>
              </>
            )}
          </>
        ) : (
          <>
            <Typography.Text>
              There is no unit assigned to this reservation. We will assign a random available unit
              of the booked unit group.
            </Typography.Text>
            <Typography.Text className="mt-3 block">
              Are you sure you want to proceed?
            </Typography.Text>
          </>
        )}

        <div className="flex justify-end gap-3 mt-3">
          <Button
            type="primary"
            disabled={stateActionReservationCheckin?.loading || assignUnitReservationState?.loading}
            onClick={handleCheckin}
          >
            Check in
          </Button>
          <Button
            onClick={() => onChangeOpenModal('')}
            disabled={stateActionReservationCheckin?.loading || assignUnitReservationState?.loading}
          >
            Cancel
          </Button>
        </div>
      </Spin>
    </Modal>
  );
};
export default IndexModal;
