import { Button, Modal, Typography } from 'antd';
import { FuncType } from 'configs/const/general';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactToPrint from 'react-to-print';

interface Props {
  componentRef: React.MutableRefObject<null>;
  setIsPrinting: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: boolean;
  handleChangeOpenModal: () => void;
  setOpenModal: React.Dispatch<React.SetStateAction<string>>;
}

const ModalChooseOfferAction = ({
  componentRef,
  setIsPrinting,
  modalOpen,
  handleChangeOpenModal,
  setOpenModal
}: Props) => {
  const { t } = useTranslation(['offer', 'common']);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  const reactToPrintTrigger = React.useCallback(() => {
    return <Button>{t('offer:print')}</Button>;
  }, []);

  const handleBeforePrint = () => {
    setIsPrinting(true);
  };
  const handleAfterPrint = () => {
    setIsPrinting(false);
    handleChangeOpenModal();
  };
  return (
    <Modal
      title={t('offer:offer_created')}
      open={modalOpen}
      onCancel={() => handleChangeOpenModal()}
      footer={false}
    >
      <div className="flex flex-col">
        <Typography.Text className="my-8">{t('offer:send_mail_question')}</Typography.Text>
        <div className="flex justify-end gap-2">
          <Button type={'primary'} onClick={() => setOpenModal(FuncType.SEND_MAIL)}>
            {t('offer:send_mail')}
          </Button>
          <ReactToPrint
            content={reactToPrintContent}
            documentTitle={t('offer:offer_confirmation')}
            onAfterPrint={handleAfterPrint}
            onBeforePrint={handleBeforePrint}
            removeAfterPrint
            trigger={reactToPrintTrigger}
          />
          <Button onClick={() => handleChangeOpenModal()}>{t('common:button.no')}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalChooseOfferAction;
