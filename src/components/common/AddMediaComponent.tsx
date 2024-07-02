/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, FormInstance, Upload } from 'antd';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { MediaStrapiType } from 'services/@strapi/type';
import { useAppDispatch, useAppSelector } from 'store';
import { filterTypeMedia, searchMedia } from 'store/booking/Media';
import { checkDomainUrl, fallbackImageStrapiResolution } from 'utils/media';
import { addSpaceInString, capitalize } from 'utils/text';
import { ModalGalleryComponent } from '.';
import { useTranslation } from 'react-i18next';
import { ImageType } from 'pages/@booking/@property/MediaPage/index.types';
import { ImageAcceptType } from './modal/ModalGalleryComponent';

interface Props {
  watchHook: any;
  form: FormInstance<any>;
  selectionType?: 'checkbox' | 'radio';
  defaultRadioMedia?: MediaStrapiType;
  fieldName?: string;
  typeMedia?: ImageAcceptType[]
}
const IndexComponent: React.FC<Props> = ({
  watchHook: mediaWatch,
  form,
  selectionType = 'checkbox',
  fieldName = 'media',
  typeMedia
}) => {
  const { t } = useTranslation(['common']);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { dataFiltered } = useAppSelector((state) => state.booking.media);
  const mediaList = useMemo(() => {
    if (mediaWatch && mediaWatch.length) {
      return mediaWatch?.map((media: MediaStrapiType, index: number) => {
        return {
          uid: `${index}`,
          name: media.name,
          status: 'done',
          url: media?.url
            ? `${checkDomainUrl(media.url)}${media.formats && Object.keys(media.formats)?.length
              ? fallbackImageStrapiResolution(media.formats)
              : media?.url
            }`
            : '/no-image.png'
        };
      });
    }
    return [];
  }, [mediaWatch]);

  const handleSearch = (value: string) => {
    dispatch(searchMedia(value));
  };

  const handleFilterType = (value: string) => {
    dispatch(filterTypeMedia(value));
  };

  const formatApccept = useMemo(() => {
    if (typeMedia) {
      return typeMedia
    }
    else if (fieldName?.toLowerCase()?.includes('icon')) {
      return [ImageType.SVG]
    }
    return [ImageType.PNG, ImageType.JPG, ImageType.WEBP, ImageType.JPEG, ImageType.SVG]
  }, [fieldName, typeMedia])

  //UI
  return (
    <>
      <Form.Item
        label={t('common:form.' + fieldName)}
        name={fieldName}
        rules={[
          {
            required: true,
            message: t('common:error.required_message', {
              content: capitalize(addSpaceInString(fieldName))
            })
          }
        ]}
      >
        <div>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => {
              setGalleryOpen(!galleryOpen);
            }}
          >
            {t('common:button.choose')}
          </Button>
          <Upload
            className={clsx('block', { ['mt-4']: mediaList.length })}
            listType="picture-card"
            fileList={mediaList}
            openFileDialogOnClick={false}
            onRemove={(item) => {
              const mediaWatch2 = mediaWatch.filter((media: any) => media.name !== item.name);
              form.setFieldValue(fieldName, mediaWatch2);
            }}
          />
        </div>
      </Form.Item>
      <ModalGalleryComponent
        control={{
          onChange: () => setGalleryOpen(false),
          onConfirm: (value) => {
            form?.setFieldValue(fieldName, value);
          },
          open: galleryOpen,
          selectionType: selectionType,
          onSearch: handleSearch,
          onFilter: handleFilterType,
          accept: formatApccept,
        }}
        dataMedia={dataFiltered}
        watchHook={selectionType === 'radio' ? [mediaWatch] : [[], mediaWatch]}
      />
    </>
  );
};

export default IndexComponent;
