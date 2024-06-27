import { App, Button, Modal, Spin, Typography } from 'antd';
import { useAsyncAction } from 'hooks';
import { actionReservationCancelService } from 'services/Reservation';
import { ModalActionReservationProps } from '../../index.types';

const IndexModal: React.FC<ModalActionReservationProps> = ({
  onChangeOpenModal,
  modalOpen,
  detail,
  onChangeLocation: handleChangeLocation
}) => {
  const { message } = App.useApp();
  //SERVICES
  const [actionReservationCancel, stateActionReservationCancel] = useAsyncAction(
    actionReservationCancelService,
    {
      onSuccess: () => {
        message.success('Cancel success!', 2);
        onChangeOpenModal('');
        handleChangeLocation && handleChangeLocation({});
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFailed: (error: any) => {
        message.error(error?.message, 2);
        onChangeOpenModal('');
      }
    }
  );

  const handleConfirm = () => {
    detail?.extId && actionReservationCancel(detail.extId);
  };
  return (
    <Modal
      title="Cancel reservation"
      centered
      open={modalOpen}
      footer={null}
      closable={false}
      onCancel={() => onChangeOpenModal('')}
      maskClosable={false}
    >
      <Spin spinning={stateActionReservationCancel.loading}>
        <Typography.Text>
          Are you sure you want to cancel the reservation <strong>{detail?.extId || ''}</strong>
        </Typography.Text>
        <div className="flex justify-end gap-3 mt-3">
          <Button
            type="primary"
            disabled={stateActionReservationCancel?.loading}
            onClick={handleConfirm}
          >
            Yes
          </Button>
          <Button
            onClick={() => onChangeOpenModal('')}
            disabled={stateActionReservationCancel?.loading}
          >
            No
          </Button>
        </div>
      </Spin>
    </Modal>
  );
};
export default IndexModal;
