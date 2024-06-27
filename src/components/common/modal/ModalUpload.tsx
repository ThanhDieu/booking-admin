/* eslint-disable @typescript-eslint/no-explicit-any */
import { InboxOutlined } from '@ant-design/icons';
import { Col, Divider, Form, FormInstance, Input, Modal, ModalProps, Upload } from 'antd';
import { MediaStrapiType } from 'services/@strapi/type';
import { ActivitiesPayload } from 'services/Activity/type';
import { isShowFields } from 'utils/array';
import { validateMessages } from 'utils/validationForm';
import AddMediaComponent from '../AddMediaComponent';
import LocaleForm from '../LocaleForm';
import { useState } from 'react';
import { InternalNamePath } from 'antd/lib/form/interface';
import { FuncType } from 'configs/const/general';
import { useTranslation } from 'react-i18next';

export interface ModalUploadProps extends ModalProps {
  form: FormInstance<any>;
  onSubmitForm: ((values: ActivitiesPayload | any) => void) | undefined;
  loading: boolean;
  showedFields: string[];
  mediaWatch?: any;
  mediaData?: MediaStrapiType[];
  selectionType?: 'checkbox' | 'radio';
  width?: number;
  haveDescription?: boolean;
  onCancel: () => void;
  actionType?: string;
}

function ModalUpload({
  form,
  onSubmitForm: handleSubmit,
  loading,
  title,
  open,
  onCancel,
  showedFields,
  mediaWatch,
  mediaData,
  selectionType = 'checkbox',
  width = 576,
  haveDescription,
  actionType
}: ModalUploadProps) {
  const { t } = useTranslation(['common']);
  const [errorTileList, setErrorTitleList] = useState<string[]>([]);

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <Modal
      title={title}
      centered
      width={width}
      open={open}
      onCancel={() => {
        onCancel();
        setErrorTitleList([]);
      }}
      cancelText={t('common:button.reset')}
      cancelButtonProps={{ onClick: () => form && form.resetFields() }}
      onOk={() => {
        if (form) {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              handleSubmit && handleSubmit(values);
            })
            .catch(
              ({
                errorFields
              }: {
                errorFields: {
                  name: InternalNamePath;
                  errors: string[];
                }[];
              }) => {
                const titleErrorArr = errorFields
                  ?.filter(({ name }) => name[0] === 'title')
                  .map(({ name }) => name[1]);
                return setErrorTitleList([...(titleErrorArr as string[])]);
              }
            );
        }
      }}
      okText={t('common:button.submit')}
      okButtonProps={{ loading: loading }}
    >
      <Form name="upload-form" form={form} layout="vertical" validateMessages={validateMessages}>
        {isShowFields(
          showedFields,
          'locale',
          <LocaleForm haveDescription={haveDescription} errorTileList={errorTileList} form={form} />
        )}
        <Divider className="mt-0 mb-2" />

        {isShowFields(
          showedFields,
          'name',
          <Form.Item
            label="Name"
            name={'name'}
            rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
          >
            <Input />
          </Form.Item>
        )}

        {isShowFields(
          showedFields,
          'code',
          <Col span={12}>
            <Form.Item
              label="Code"
              name={'code'}
              rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
            >
              <Input disabled={actionType === FuncType.UPDATE} />
            </Form.Item>
          </Col>
        )}
        {isShowFields(
          showedFields,
          'alt',
          <Form.Item
            label="Alt"
            name={'alt'}
            rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
          >
            <Input />
          </Form.Item>
        )}
        {isShowFields(
          showedFields,
          'caption',
          <Form.Item label={t('common:form.caption')} name="caption">
            <Input.TextArea />
          </Form.Item>
        )}
        {isShowFields(
          showedFields,
          'image',
          <Form.Item label={t('common:form.caption')} required>
            <Form.Item
              name="image"
              rules={[{ required: true, message: 'Please upload a image' }]}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger
                name="file"
                multiple={false}
                listType="picture"
                accept="image/*"
                maxCount={1}
                beforeUpload={() => false}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">{t('common:form.click_or_drag_upload')}</p>
                <p className="ant-upload-hint">{t('common:form.support_single_file')}</p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
        )}
        <div className="flex gap-10">
          {isShowFields(
            showedFields,
            showedFields?.includes('activityIcon') ? 'activityIcon' : 'media',
            mediaData && form && (
              <AddMediaComponent
                form={form}
                watchHook={showedFields?.includes('activityIcon') ? mediaWatch?.icon : mediaWatch}
                selectionType={selectionType}
                fieldName={showedFields?.includes('activityIcon') ? 'icon' : 'media'}
              />
            )
          )}
          {isShowFields(
            showedFields,
            'activityImage',
            mediaData && form && (
              <AddMediaComponent
                form={form}
                watchHook={mediaWatch?.image}
                selectionType={selectionType}
                fieldName="image"
              />
            )
          )}
        </div>
        <div className="flex gap-10">
          {isShowFields(
            showedFields,
            'whiteIcon',
            mediaData && form && (
              <AddMediaComponent
                form={form}
                watchHook={(mediaWatch?.whiteIcon?.length && mediaWatch?.whiteIcon) ?? []}
                selectionType={selectionType}
                fieldName="whiteIcon"
              />
            )
          )}
          {isShowFields(
            showedFields,
            'blackIcon',
            mediaData && form && (
              <AddMediaComponent
                form={form}
                watchHook={(mediaWatch?.blackIcon?.length && mediaWatch?.blackIcon) ?? []}
                selectionType={selectionType}
                fieldName="blackIcon"
              />
            )
          )}
        </div>
      </Form>
    </Modal>
  );
}

export default ModalUpload;
