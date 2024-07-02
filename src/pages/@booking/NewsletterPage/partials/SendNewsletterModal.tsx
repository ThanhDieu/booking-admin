import ModalSendMail from 'components/common/modal/ModalSendMail';
import { IBE_BOOKING_LINK_NEWSLETTER } from 'constant/paths';
import { useTranslation } from 'react-i18next';
import { DataNewsletterPayload } from 'services/Newsletter/type';
import { converHtmlToPlainText } from 'utils/text';

interface Props {
  modalOpen: boolean;
  handleChangeOpenModal: () => void;
  onSubmit: (campaignId: string, content: string) => void;
  contentData: DataNewsletterPayload | undefined;
}

const SendNewsletterModal = ({
  modalOpen,
  handleChangeOpenModal,
  onSubmit,
  contentData
}: Props) => {
  const { t } = useTranslation(['reservation', 'newsletter']);

  const bundleQuill = (contentData as DataNewsletterPayload)?.bundles?.map((bundle) => {
    const bundleLink = `${IBE_BOOKING_LINK_NEWSLETTER}/${bundle.bundleId}`;
    return [
      { insert: `${t('reservation:bundle_name')}: `, attributes: { bold: true } },
      { insert: `${bundle.name}` },
      {
        insert: `    ${t('newsletter:click_here')} \n`,
        attributes: {
          link: bundleLink
        }
      }
    ];
  });

  const formatContentToQuill = {
    ops: [
      { insert: `${contentData?.name}\n\n`, attributes: { bold: true, header: 2 } },
      { insert: `${converHtmlToPlainText(contentData?.intro ?? '')}\n\n` },
      ...bundleQuill.flat(),
      { insert: `\n` },
      { insert: `${converHtmlToPlainText(contentData?.outro ?? '')}\n` }
    ]
  };

  return (
    <ModalSendMail
      modalOpen={modalOpen}
      handleChangeOpenModal={() => handleChangeOpenModal()}
      onSubmit={onSubmit}
      contentData={formatContentToQuill}
    />
  );
};

export default SendNewsletterModal;
