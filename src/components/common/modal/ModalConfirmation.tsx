import { Button, Modal, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

interface Props {
  content: string;
  loading?: boolean;
  onChangeOpenModal: () => void;
  modalOpen: boolean;
  callBack?: () => void;
  title?: string;
}

const ModalConfirmation = ({
  loading = false,
  onChangeOpenModal,
  modalOpen,
  callBack,
  content,
  title
}: Props) => {
  const { t } = useTranslation(['common']);
  return (
    <Modal
      title={title ?? t('common:modal.confirmation')}
      centered
      open={modalOpen}
      footer={null}
      closable={false}
      onCancel={() => onChangeOpenModal()}
      maskClosable={false}
    >
      <Spin spinning={loading}>
        <Typography.Text>{content}</Typography.Text>
        <div className="flex justify-end gap-3 mt-3">
          <Button
            type="primary"
            disabled={loading}
            onClick={() => {
              callBack && callBack();
              onChangeOpenModal();
            }}
          >
            {t('common:button.yes')}
          </Button>
          <Button onClick={() => onChangeOpenModal()} disabled={loading}>
            {t('common:button.no')}
          </Button>
        </div>
      </Spin>
    </Modal>
  );
};

export default ModalConfirmation;
