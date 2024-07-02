import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormInstance, Upload, UploadFile } from 'antd';
import clsx from 'clsx';
import { ModalGalleryComponent } from 'components/common';
import { ModalGalleryControlType } from 'components/common/modal/ModalGalleryComponent';
import { ImageType } from 'pages/@booking/@property/MediaPage/index.types';
import { useMemo, useState } from 'react';
import { MediaStrapiType } from 'services/@strapi/type';
import { useAppDispatch, useAppSelector } from 'store';
import { mediaSlice } from 'store/booking/Media';
import { checkDomainUrl, fallbackImageStrapiResolution } from 'utils/media';
import { InitialBundleType } from '../../types';
import { useTranslation } from 'react-i18next';

interface MediaSelectBoxProps {
  form: FormInstance<InitialBundleType>;
  isReadOnly?: boolean;
}

export default function MediaSelectBox({ form, isReadOnly }: MediaSelectBoxProps) {
  const { t } = useTranslation(['common', 'bundles']);
  const mediaWatch = Form.useWatch('media', form);
  const extraWatch = Form.useWatch('extra', form);
  const dispatch = useAppDispatch();

  const [fieldChosen, setFieldChosen] = useState<string>('');
  const [galleryControl, setGalleryControl] = useState<ModalGalleryControlType>({
    open: false
  });

  const { dataFiltered: mediaFilteredData } = useAppSelector((state) => state.booking.media);

  const modifiedMedia = (data: MediaStrapiType[]): UploadFile<MediaStrapiType>[] => {
    if (data && data.length) {
      return data?.map((media: MediaStrapiType, index: number) => ({
        uid: `${index}`,
        name: media.name,
        status: 'done',
        url: media?.url
          ? `${checkDomainUrl(media.url)}${media.formats && Object.keys(media.formats)?.length
            ? fallbackImageStrapiResolution(media.formats)
            : media.url
          }`
          : '/no-image.png'
      }));
    } else return [];
  };

  const mediaList = useMemo(() => modifiedMedia(mediaWatch || []), [mediaWatch]);
  const extraList = useMemo(() => modifiedMedia(extraWatch || []), [extraWatch]);

  const handleSearch = (value: string) => {
    dispatch(mediaSlice.actions.searchMedia(value));
  };

  const handleFilterType = (value: string) => {
    dispatch(mediaSlice.actions.filterTypeMedia(value));
  };

  return (
    <>
      <Col span={24}>
        <Form.Item
          label={t('bundles:main_media')}
          name="media"
          rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
        >
          <div className="bundle-main-media">
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => {
                setGalleryControl({ open: true, selectionType: 'radio' });
                setFieldChosen('media');
              }}
              className={clsx({ ['mb-4']: mediaList?.length })}
              hidden={isReadOnly}
            >
              {t('common:button.choose')}
            </Button>
            <Upload
              className={clsx('block w-full')}
              listType="picture-card"
              fileList={mediaList}
              openFileDialogOnClick={false}
              onRemove={() => {
                form.setFieldValue('media', []);
              }}
            />
          </div>
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item
          className="mb-0"
          label={t('bundles:extra_media')}
          name="extra"
          rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
        >
          <div>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => {
                setGalleryControl({ open: true, selectionType: 'checkbox' });
                setFieldChosen('extra');
              }}
              className={clsx({ ['mb-4']: extraList?.length })}
              hidden={isReadOnly}
            >
              {t('common:button.choose')}
            </Button>
            <Upload
              className={clsx('block w-full')}
              listType="picture-card"
              fileList={extraList}
              openFileDialogOnClick={false}
              onRemove={(item) => {
                const newMedia = extraWatch?.filter(
                  (media: MediaStrapiType) => media.name !== item.name
                );
                form.setFieldValue('extra', newMedia);
              }}
            />
          </div>
        </Form.Item>
      </Col>

      <ModalGalleryComponent
        control={{
          ...galleryControl,
          accept: [ImageType.PNG, ImageType.JPG, ImageType.WEBP, ImageType.JPEG],
          onChange: (value) => {
            setGalleryControl(value);
          },
          onConfirm: (value) => {
            form?.setFieldValue(fieldChosen, value);
          },
          onSearch: handleSearch,
          onFilter: handleFilterType
        }}
        dataMedia={mediaFilteredData}
        watchHook={[mediaWatch || [], extraWatch || []]}
      />
    </>
  );
}
