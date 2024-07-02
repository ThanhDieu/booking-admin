/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Checkbox,
  Col,
  Empty,
  Image,
  Modal,
  Radio,
  Row,
  Select,
  Skeleton,
  Space,
  Spin
} from 'antd';
import clsx from 'clsx';
import { filterTypeOptions } from 'configs/const/select';
import { useDidMount } from 'hooks';
import { ImageType } from 'pages/@booking/@property/MediaPage/index.types';
import { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MediaStrapiType } from 'services/@strapi/type';
import { useAppDispatch } from 'store';
import { resetFilterState } from 'store/booking/Media';
import { checkDomainUrl, fallbackImageError, fallbackImageStrapiResolution } from 'utils/media';
import SearchComponent from '../SearchComponent';
import { useTranslation } from 'react-i18next';

export type ImageAcceptType = '.jpg' | '.png' | '.svg' | '.webp' | '.jpeg';
export type ModalGalleryControlType = {
  open: boolean;
  selectionType?: 'checkbox' | 'radio';
  accept?: ImageAcceptType | ImageAcceptType[];
};

interface ModalGalleryProps {
  control: {
    onChange: (value: ModalGalleryControlType) => void;
    onConfirm: (value: MediaStrapiType[]) => void;
    onSearch?: (value: string) => void;
    onFilter?: (value: string) => void;
  } & ModalGalleryControlType;
  dataMedia: MediaStrapiType[];
  watchHook?: MediaStrapiType[][];
}

type InitializeType = {
  patchedData: MediaStrapiType[];
  defaultValue: string | MediaStrapiType | MediaStrapiType[];
};

const IndexComponent: React.FC<ModalGalleryProps> = ({ control, dataMedia, watchHook = [] }) => {
  const {
    open,
    onChange: handleModal,
    onConfirm: handleModalConfirm,
    onSearch: handleSearch,
    onFilter: handleFilter,
    selectionType,
    accept
  } = control;

  const [loading, setLoading] = useState(false);
  const [mediaModifiedData, setMediaModifiedData] = useState<MediaStrapiType[]>([]);
  const [mediaSelected, setMediaSelected] = useState<MediaStrapiType[]>([]);
  const [mediaWatch, extraWatch] = watchHook;
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common']);
  const [{ patchedData, defaultValue }, setInitialize] = useState<InitializeType>({
    defaultValue: '',
    patchedData: dataMedia
  });

  useEffect(() => {
    if (!dataMedia) return;
    if (accept) {
      const filtered = dataMedia.filter((media) =>
        typeof accept === 'string'
          ? media.ext === accept
          : accept.includes(media.ext as ImageAcceptType)
      );
      setInitialize({ defaultValue, patchedData: filtered });
    }

    if (selectionType === 'radio' && mediaWatch && mediaWatch?.length) {
      const foundedMain = patchedData?.find((media) => media.hash === mediaWatch[0].hash);
      if (foundedMain) {
        const remainingItems = patchedData?.filter((item) => item.hash !== foundedMain.hash);
        setInitialize({
          patchedData: [foundedMain, ...remainingItems],
          defaultValue: foundedMain || ''
        });
      }
    } else if (selectionType === 'checkbox' && extraWatch && extraWatch?.length) {
      const foundedExtra = patchedData?.filter((media) =>
        extraWatch?.some((extra) => extra.hash === media?.hash)
      );

      if (foundedExtra) {
        const remainingItems = patchedData?.filter(
          (item) => !foundedExtra?.some((extra) => extra.id === item.id)
        );
        setInitialize({
          patchedData: [...foundedExtra, ...remainingItems],
          defaultValue: foundedExtra || ''
        });
      }
    }
  }, [
    dataMedia,
    selectionType,
    mediaWatch,
    extraWatch,
    mediaWatch && !mediaWatch.length,
    extraWatch && !extraWatch.length
  ]);

  useEffect(() => {
    if (!defaultValue) setMediaSelected([]);

    if (selectionType === 'radio' && defaultValue && typeof defaultValue === 'object')
      setMediaSelected([defaultValue as MediaStrapiType]);

    if (selectionType === 'checkbox' && defaultValue && Array.isArray(defaultValue))
      setMediaSelected(defaultValue);
  }, [selectionType, defaultValue]);

  useEffect(() => {
    if (patchedData && patchedData.length) setMediaModifiedData(patchedData?.slice(0, 30));
  }, [patchedData, dataMedia]);

  useDidMount(() => {
    dispatch(resetFilterState());
  });

  const newFilterTypeOptions = useMemo(() => {
    const options = filterTypeOptions?.filter(option => accept && Array.isArray(accept) && accept.some(type => type === option.value))
    if (!options || options.length <= 1) return []
    return filterTypeOptions
  }, [filterTypeOptions])

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const currentDataLength = mediaModifiedData.length;
    const newData = patchedData?.slice(currentDataLength, currentDataLength + 24) || [];
    setMediaModifiedData((prevData) => [...prevData, ...newData]);
    setLoading(false);
  };

  const handleModalCancel = () => handleModal({ open: false, selectionType: undefined });

  const handleModalSubmit = () => {
    handleModalConfirm(mediaSelected);
    handleModal({ open: false, selectionType: undefined });
  };

  const renderMediaList = useMemo(() => {
    return (
      <div id={`${selectionType}-scrollableDiv`} className="w-full">
        <InfiniteScroll
          dataLength={mediaModifiedData?.length}
          next={loadMoreData}
          hasMore={mediaModifiedData?.length < patchedData?.length}
          loader={<Spin className="w-full my-6" />}
          scrollableTarget={`${selectionType}-scrollableDiv`}
          className="overflow-x-hidden"
          height={600}
        >
          <Row gutter={[8, 8]}>
            {mediaModifiedData?.map((media) => {
              return (
                <Col span={4} key={media?.id} className="overflow-hidden">
                  <div className="relative bg-slate-300 rounded-[2px] w-full h-full flex items-center justify-center media-item aspect-square">
                    <Image
                      preview={false}
                      alt={media.caption}
                      width={media.ext === ImageType.SVG ? 50 : '100%'}
                      className={clsx(
                        media ? 'object-center aspect-square' : 'object-cover object-center',
                        media.ext === ImageType.SVG ? `object-contain` : `object-cover`
                      )}
                      src={
                        media?.url
                          ? `${checkDomainUrl(media.url)}${media?.formats && Object.keys(media?.formats)?.length
                            ? fallbackImageStrapiResolution(media?.formats)
                            : media.url
                          }`
                          : '/no-image.png'
                      }
                      placeholder={
                        <Skeleton.Image className="w-full h-full" active></Skeleton.Image>
                      }
                      fallback={fallbackImageError}
                    />
                    <div className="absolute inset-0 z-[9999] w-full h-full">
                      {selectionType === 'checkbox' ? (
                        <Checkbox value={media} className="w-full h-full p-1" />
                      ) : null}

                      {selectionType === 'radio' ? (
                        <Radio value={media} className="w-full h-full p-1" />
                      ) : null}
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </InfiniteScroll>
      </div>
    );
  }, [selectionType, mediaModifiedData]);

  return (
    <Modal
      title="Gallery"
      className="w-[1248px]"
      bodyStyle={{ overflowY: 'auto', overflowX: 'hidden' }}
      width={patchedData && patchedData.length ? 1248 : '50%'}
      centered
      destroyOnClose
      open={open}
      onCancel={handleModalCancel}
      onOk={handleModalSubmit}
      footer={[
        <div key={'modal-footer-action'} className="flex justify-between items-center">
          <Space size={8}>
            <SearchComponent
              placeholderC={t('common:search.placeholder', { content: "name, alt, type" })}
              onChange={(value: string) => handleSearch && handleSearch(value)}
              defaultValue={''}
              allowClear
            />
            {newFilterTypeOptions?.length > 0 && <Select
              defaultValue="all"
              style={{ width: 120 }}
              options={newFilterTypeOptions}
              onChange={(value) => handleFilter && handleFilter(value)}
            />}
          </Space>
          <Space size={8}>
            <Button onClick={handleModalCancel}>Cancel</Button>
            <Button type="primary" loading={loading} onClick={handleModalSubmit}>
              Submit
            </Button>
          </Space>
        </div>
      ]}
    >
      {patchedData && patchedData.length ? (
        <>
          {selectionType === 'checkbox' ? (
            <Checkbox.Group
              className="w-full"
              onChange={(value) => {
                setMediaSelected(value as any);
              }}
              value={mediaSelected as any}
            >
              {renderMediaList}
            </Checkbox.Group>
          ) : null}

          {selectionType === 'radio' ? (
            <Radio.Group
              className="w-full"
              onChange={(e) => {
                setMediaSelected([e.target.value]);
              }}
              value={mediaSelected && mediaSelected.length && mediaSelected[0]}
            >
              {renderMediaList}
            </Radio.Group>
          ) : null}
        </>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </Modal>
  );
};

export default IndexComponent;
