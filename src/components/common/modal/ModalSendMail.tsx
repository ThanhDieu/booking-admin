/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Modal, Select, Spin } from 'antd';
import { ThemeType } from 'configs/const/general';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';
import { formatSelectOption } from 'utils/format';
import TextEditor from '../form/TextEditor';
import { converHtmlToPlainText } from 'utils/text';

interface Props {
  modalOpen: boolean;
  handleChangeOpenModal: () => void;
  onSubmit: (campaignId: string, content: string) => void;
  contentData: any;
}

const ModalSendMail = ({ modalOpen, handleChangeOpenModal, onSubmit, contentData }: Props) => {
  const { t } = useTranslation(['offer', 'common', 'reservation']);
  const { selected } = useAppSelector((state) => state.app.theme);
  const { campaignList, campaignLoading } = useAppSelector((state) => state.orion.mailchimp);
  const [form] = Form.useForm();
  const contentWatch = Form.useWatch('content', form);

  const campaignOptionsList = useMemo(() => {
    if (!campaignList?.length) return [];
    const cutCampaignList = campaignList?.map((campaign) => ({
      id: campaign.id,
      title: campaign.settings.title
    }));
    return formatSelectOption(cutCampaignList, 'title', 'id');
  }, [campaignList]);

  const initialValue = {
    content: contentData
  };

  const handleSubmit = (formData: { campaign: string; content: string }) => {
    const campaigId = formData.campaign.split('@')[0];
    onSubmit(campaigId, formData.content);
  };

  useEffect(() => {
    const formContentField = form.getFieldValue('content');
    form.setFieldValue('content', formContentField);
  }, [contentWatch]);

  return (
    <Modal
      title={t('offer:send_mail_modal_title')}
      open={modalOpen}
      onCancel={() => handleChangeOpenModal()}
      footer={false}
      width={900}
    >
      <Spin spinning={campaignLoading}>
        <Form onFinish={handleSubmit} initialValues={initialValue} form={form}>
          <Form.Item
            label={t('offer:campaign')}
            name="campaign"
            rules={[{ required: true }]}
            className="my-8"
          >
            <Select
              options={campaignOptionsList}
              placeholder={t('offer:campaign_select_placeholder')}
            />
          </Form.Item>
          <Form.Item
            rules={[
              { required: true },
              {
                validator() {
                  if (!contentWatch || converHtmlToPlainText(contentWatch)?.trim() === '') {
                    return Promise.reject(new Error(t('common:form.please_enter_this_field')));
                  }
                  return Promise.resolve();
                }
              }
            ]}
            label={t('offer:content')}
            name="content"
          >
            <TextEditor
              className="bundle-text-editor"
              style={{ backgroundColor: selected === ThemeType.DARK ? '#000' : '#fff' }}
            />
          </Form.Item>
          <div className="flex justify-end gap-5">
            <Button type="primary" htmlType="submit">
              {t('offer:send_mail')}
            </Button>
            <Button onClick={() => handleChangeOpenModal()}>{t('common:button.close')}</Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default ModalSendMail;
