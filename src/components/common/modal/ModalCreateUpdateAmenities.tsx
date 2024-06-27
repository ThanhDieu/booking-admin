/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ColorPicker, Form, Input, Modal, Select, SelectProps, Space, Switch } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { InternalNamePath } from 'antd/lib/form/interface';
import { ViewMode } from 'configs/const/auth';
import { FuncType, GeneralName, tagType } from 'configs/const/general';
import { colors } from 'constant';
import { useLocaleSegmentOption } from 'hooks';
import useView from 'hooks/useView';
import { ImageType } from 'pages/@orion/@property/MediaPage/index.types';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttributeDetailAppType } from 'services/Attributes/type';
import { TagDetailAppType } from 'services/Tags/type';
import { useAppSelector } from 'store';
import { capitalize } from 'utils/text';
import { AddMediaComponent, LocaleForm, TagCustomComponent } from '..';

const Textarea = Input.TextArea;
const PropertyAll = 'all';
interface ModalProp {
  openModal: string;
  onChangeOpenModal: () => void;
  handleUpdate?: (id: string, formData: AttributeDetailAppType | TagDetailAppType) => Promise<any>;
  handleCreate?: (formData: AttributeDetailAppType | TagDetailAppType) => void;
  title: string;
  preValueUpdate?: AttributeDetailAppType | TagDetailAppType;
  variant: keyof typeof GeneralName;
  propertyList?: SelectProps['options'];
  loading?: boolean;
  isHasInputLocale?: boolean;
  haveDescription?: boolean;
}

const ModalCreateUpdateAmenities = ({
  openModal,
  onChangeOpenModal,
  handleUpdate,
  handleCreate,
  title,
  preValueUpdate,
  variant,
  propertyList,
  loading,
  isHasInputLocale,
  haveDescription
}: ModalProp) => {
  const [form] = useForm();
  const mediaWatch = useWatch('media', form);
  const { data: mediaData } = useAppSelector((state) => state.orion.media);
  const { currentView, currentViewObj } = useView();
  const { colorPrimary } = useAppSelector((state) => state.app.theme);
  const { languages: languageSetting } = useAppSelector((state) => state.orion.languageSetting);
  const { mandatoryLocaleList } = useLocaleSegmentOption();

  const [colorTag, setcolorTag] = useState<string>(
    variant === GeneralName.Tag && preValueUpdate
      ? (preValueUpdate as TagDetailAppType)?.color?.replace('#', '')
      : colorPrimary
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [errorTileList, setErrorTitleList] = useState<string[]>([]);
  const { t } = useTranslation(['common']);
  const handleSelectChange = (values: string[]) => {
    // If "All" option is selected, select all items
    if (values.findIndex((value) => value === PropertyAll) > -1) {
      const selected = propertyList ? propertyList.map((item) => item.value) : [];
      setSelectedItems(selected as string[]);
      form.setFieldValue('propertyIds', [PropertyAll]);
    } else {
      setSelectedItems(values);
      form.setFieldValue('propertyIds', values);
    }
  };

  const propertyOptions: SelectProps['options'] = useMemo(() => {
    const hasProperty = selectedItems && selectedItems?.includes(PropertyAll);
    return propertyList?.map((item) => ({
      ...item,
      disabled: hasProperty && item.value !== PropertyAll
    }));
  }, [propertyList, selectedItems]);

  const formatPropertyIds = (propertyIds: string[], type: string) => {
    switch (type) {
      case PropertyAll:
        return propertyOptions
          ?.filter((item) => item.value !== PropertyAll)
          .map((item) => (item.value as string)?.split('@')[0]);
      default:
        return propertyIds.map((hotel: string) => hotel.split('@')[0]);
    }
  };
  const defaultIcon = useMemo(() => {
    return (
      mediaData?.filter((media) => (preValueUpdate as TagDetailAppType)?.icon === media?.url) || []
    );
  }, [mediaData, preValueUpdate]);

  const initFormValue =
    variant === GeneralName.Attribute
      ? {
        extId: preValueUpdate?.extId,
        name: preValueUpdate?.name || '',
        description: preValueUpdate?.description || ''
      }
      : ({
        locale: 'en',
        title: (preValueUpdate as TagDetailAppType)?.extendedData?.title ?? {
          en: (preValueUpdate as TagDetailAppType)?.title || ''
        },
        description: (preValueUpdate as TagDetailAppType)?.extendedData?.description ?? {
          en: (preValueUpdate as TagDetailAppType)?.description || ''
        },
        type: (preValueUpdate as TagDetailAppType)?.type || tagType.SERVICE,
        propertyIds: (preValueUpdate as TagDetailAppType)?.properties?.length
          ? (preValueUpdate as TagDetailAppType)?.properties?.map(
            (hotel) => `${hotel?.extId}@${hotel?.name}`
          )
          : [],
        color: (preValueUpdate as TagDetailAppType)?.color
          ? `#${(preValueUpdate as TagDetailAppType)?.color?.replace('#', '')}`
          : colorTag,
        media: defaultIcon || ''
      } as any);

  useEffect(() => {
    if (variant === GeneralName.Tag && openModal === FuncType.CREATE) {
      mandatoryLocaleList?.length
        ? mandatoryLocaleList?.map((lang) => (initFormValue['title'][lang] = ''))
        : null;
    }
    if (openModal === FuncType.UPDATE || openModal === FuncType.CREATE)
      form.setFieldsValue(initFormValue);
  }, [languageSetting, openModal, preValueUpdate]);

  const onSubmitForm = (formData: any) => {
    formData['icon'] = formData['media'];
    delete formData['media'];

    if (
      openModal === FuncType.UPDATE &&
      (preValueUpdate?.extId || (preValueUpdate as TagDetailAppType).tagId) &&
      handleUpdate
    ) {
      const dataUpdate =
        variant === GeneralName.Tag
          ? {
            ...formData,
            propertyIds: formData?.propertyIds.length
              ? formatPropertyIds(formData?.propertyIds, formData.propertyIds[0])
              : currentView !== ViewMode.Account
                ? [currentViewObj.code]
                : [],
            color: colorTag,
            status: (preValueUpdate as TagDetailAppType)?.status,
            isGlobal: (preValueUpdate as TagDetailAppType)?.isGlobal || false,
            icon: formData?.icon[0]?.url,
            title: formData?.title.en,
            description: formData?.description.en,
            extendedData: {
              title: formData?.title,
              description: formData?.description
            }
          }
          : formData;
      handleUpdate(preValueUpdate?.extId || (preValueUpdate as TagDetailAppType).tagId || '', {
        ...dataUpdate
      });
    } else if (handleCreate) {
      const payload =
        variant === GeneralName.Tag
          ? {
            ...formData,
            propertyIds: formData.propertyIds.length
              ? formatPropertyIds(formData.propertyIds, formData.propertyIds[0])
              : currentView !== ViewMode.Account
                ? [currentViewObj.code]
                : [],
            status: true,
            color: colorTag,
            isGlobal: currentView === ViewMode.Account ? true : false,
            icon: formData?.icon[0]?.url,
            title: formData?.title.en,
            description: formData?.description.en,
            extendedData: {
              title: formData?.title,
              description: formData?.description
            }
          }
          : formData;
      handleCreate({ ...payload });
    }
    // onChangeOpenModal();
  };

  const onSubmitFormFail = ({
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
  };

  return (
    <Modal
      title={title}
      open={openModal === FuncType.UPDATE || openModal === FuncType.CREATE}
      onCancel={onChangeOpenModal}
      footer={false}
      width={900}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={initFormValue}
        onFinish={onSubmitForm}
        onFinishFailed={onSubmitFormFail}
      >
        {isHasInputLocale && (
          <LocaleForm haveDescription={haveDescription} errorTileList={errorTileList} form={form} />
        )}

        {Object.keys(initFormValue).map((key, index) => {
          if (key === 'type')
            return (
              <Form.Item key={key} name={key} label={t('common:table.type')}>
                <Select
                  disabled={(preValueUpdate as TagDetailAppType)?.type ? true : false}
                  options={Object.values(tagType).map((type) => {
                    const localizedLabel = t('sidebar:sidebar.' + type.toLowerCase());
                    return {
                      label: localizedLabel,
                      value: type.toLowerCase()
                    };
                  })}
                />
              </Form.Item>
            );
          if (key === 'propertyIds') {
            return (
              <Form.Item
                key={key}
                name={key}
                label={t('common:table.properties')}
                hidden={currentView !== ViewMode.Account}
                rules={[
                  {
                    required: currentView === ViewMode.Account,
                    message: t('common:error.required_message', {
                      content: capitalize('properties')
                    })
                  }
                ]}
              >
                <Select
                  // disabled={(preValueUpdate as TagDetailAppType)?.properties?.length ? true : false}
                  options={propertyOptions || []}
                  mode="multiple"
                  onChange={handleSelectChange}
                />
              </Form.Item>
            );
          }

          if (key === 'disabled')
            return (
              <Form.Item key={key} name={key} label={capitalize(key)} valuePropName="checked">
                <Switch />
              </Form.Item>
            );

          if (key === 'color')
            return (
              <Space key={key}>
                <Form.Item name={key} label={t('common:table.color')}>
                  <ColorPicker
                    format="hex"
                    presets={[
                      {
                        label: 'Recommended',
                        colors: colors
                      },
                      {
                        label: 'Recent',
                        colors: []
                      }
                    ]}
                    value={colorTag}
                    onChange={(value) => setcolorTag(value.toHex())}
                  />
                </Form.Item>
                <TagCustomComponent color={colorTag} value={t('common:button.preview_tag')} />
              </Space>
            );

          if (key === 'media')
            return (
              <AddMediaComponent
                form={form}
                watchHook={mediaWatch}
                selectionType="radio"
                key={key}
                typeMedia={variant === GeneralName.Tag ? [ImageType.SVG] : undefined}
              />
            );

          return !isHasInputLocale ? (
            <Form.Item
              key={key}
              name={key}
              label={capitalize(key)}
              rules={
                index === 0
                  ? [
                    { required: true, max: 64, whitespace: true },
                    { pattern: /^[A-Za-z0-9.,#)(_ -]*$/ }
                  ]
                  : [{ required: index === 1 }]
              }
            >
              {key === 'description' ? <Textarea rows={4} /> : <Input />}
            </Form.Item>
          ) : null;
        })}
        <div className="flex justify-end gap-3">
          <Button type="primary" htmlType="submit" disabled={loading}>
            {t('common:button.save')}
          </Button>
          <Button onClick={() => onChangeOpenModal()} disabled={loading}>
            {t('common:button.close')}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCreateUpdateAmenities;
