/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Modal, Spin, Typography } from 'antd';
import { useAsyncAction } from 'hooks';
import { unassignUnitReservationService } from 'services/Reservation';
import { ModalActionReservationProps } from '../../index.types';
import { useTranslation } from 'react-i18next';

const IndexModal: React.FC<ModalActionReservationProps> = ({
  onChangeOpenModal,
  modalOpen,
  detail,
  onChangeLocation: handleChangeLocation
}) => {
  const { t } = useTranslation(['reservation', 'common']);
  const { message } = App.useApp();
  //SERVICES
  const [unassignUnitReservation, unassignUnitReservationState] = useAsyncAction(
    unassignUnitReservationService,
    {
      onSuccess: () => {
        message.success(t('common:general.successfully'), 2);
        handleChangeLocation && handleChangeLocation({});
        onChangeOpenModal('');
      },
      onFailed: (error: any) => {
        message.error(error?.message, 10);
        onChangeOpenModal('');
      }
    }
  );

  const handleConfirm = () => {
    detail?.extId && unassignUnitReservation(detail.extId);
  };
  return (
    <Modal
      title={t('reservation:unassign_unit')}
      centered
      open={modalOpen}
      footer={null}
      closable={false}
      onCancel={() => onChangeOpenModal('')}
      maskClosable={false}
    >
      <Spin spinning={unassignUnitReservationState.loading}>
        <Typography.Text>{t('reservation:confirm_unassign')}</Typography.Text>
        <div className="flex justify-end gap-3 mt-3">
          <Button
            type="primary"
            disabled={unassignUnitReservationState?.loading}
            onClick={handleConfirm}
          >
            {t('common:button.yes')}
          </Button>
          <Button
            onClick={() => onChangeOpenModal('')}
            disabled={unassignUnitReservationState?.loading}
          >
            {t('common:button.no')}
          </Button>
        </div>
      </Spin>
    </Modal>
  );
};
export default IndexModal;
