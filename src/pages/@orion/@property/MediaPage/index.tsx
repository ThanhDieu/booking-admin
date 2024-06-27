/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import {
  App,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Image,
  Popconfirm,
  Row,
  Select,
  SelectProps,
  Skeleton,
  Space,
  Spin
} from 'antd';
import clsx from 'clsx';
import { SearchComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import { COPYRIGHT } from 'constant';
import { useAsyncAction, useDidMount, useHelmet } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { deleteMediaService, uploadMediaService } from 'services/@strapi/strapiService';
import { MediaStrapiType } from 'services/@strapi/type';
import { useAppDispatch, useAppSelector } from 'store';
import { getMediaDataAction, mediaSlice, resetFilterState } from 'store/orion/Media';
import { checkDomainUrl, fallbackImageStrapiResolution } from 'utils/media';
import { ImageType } from './index.types';
import { ModalUpload } from 'components/common';
import { useTranslation } from 'react-i18next';
const DATA_DEFAULT = {
  search: '',
  filter: 'all'
};
const MediaPage = () => {
  const [stateEvents, setStateEvents] = useState<{ search: string; filter: string }>(DATA_DEFAULT);
  const [mediaModifiedData, setMediaModifiedData] = useState<MediaStrapiType[]>([]);
  const [modalUpload, setModalUpload] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>();
  const [indicatorUpload, setIndicatorUpload] = useState<boolean>(false);
  const [indicatorLoadMore, setIndicatorLoadMore] = useState<boolean>(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common', 'sidebar']);
  const { message } = App.useApp();
  // services
  const {
    data: mediaData,
    dataFiltered: mediaFilteredData,
    loading: fetchLoading
  } = useAppSelector((state) => state.orion.media);
  const [uploadMedia] = useAsyncAction(uploadMediaService, {
    onSuccess: async () => {
      message.success('Success!', 2);
      setStateEvents(DATA_DEFAULT);
      await dispatch(getMediaDataAction());
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  const [deleteMedia] = useAsyncAction(deleteMediaService, {
    onSuccess: async () => {
      message.success('Success!', 2);
      await dispatch(getMediaDataAction());
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  useEffect(() => {
    if (mediaFilteredData) {
      setMediaModifiedData(mediaFilteredData.slice(0, 30));
    }
  }, [mediaFilteredData]);

  useDidMount(() => {
    dispatch(resetFilterState());
  });

  // FUNCTIONS
  const handleUpload = async (formData: any) => {
    const { image, ...info } = formData;
    setIndicatorUpload(true);
    await uploadMedia(image[0].originFileObj, info);
    setIndicatorUpload(false);
    setModalUpload(false);
  };

  const handleDelete = async (id: string | number) => {
    await deleteMedia(`${id}`);
  };

  const handleSearch = (value: string) => {
    setStateEvents({
      ...stateEvents,
      search: value
    });
    dispatch(mediaSlice.actions.searchMedia(value));
  };

  const handleFilterType = (value: string) => {
    setStateEvents({
      ...stateEvents,
      filter: value
    });
    dispatch(mediaSlice.actions.filterTypeMedia(value));
  };

  const loadMoreData = () => {
    if (indicatorLoadMore) {
      return;
    }
    setIndicatorLoadMore(true);
    const currentDataLength = mediaModifiedData.length;
    const newData = mediaFilteredData?.slice(currentDataLength, currentDataLength + 24) || [];
    setMediaModifiedData((prevData) => [...prevData, ...newData]);
    setIndicatorLoadMore(false);
  };

  // UI
  const filterTypeOptions: SelectProps['options'] = useMemo(() => {
    const mapped = mediaData.reduce((acc, obj) => {
      const ext = obj.ext;
      if (
        acc.findIndex((item) => {
          return item.label === ext;
        }) === -1
      ) {
        acc.push({ label: ext, value: ext });
      }
      return acc;
    }, [] as { label: string; value: string }[]);

    return [{ label: t('common:general.all'), value: 'all' }, ...mapped];
  }, [mediaFilteredData]);

  const renderData = () => {
    if (fetchLoading) return <Spin spinning={fetchLoading} />;
    if (!mediaFilteredData.length)
      return <Empty className="w-full" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    else
      return (
        mediaModifiedData.length &&
        mediaModifiedData?.map((image: MediaStrapiType) => {
          return (
            <Col key={image.id} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                size="small"
                hoverable
                cover={
                  <div className="h-[200px] flex items-center justify-center bg-slate-300">
                    <Image
                      src={
                        image?.url
                          ? `${checkDomainUrl(image.url)}${image?.formats && Object.keys(image?.formats)?.length
                            ? fallbackImageStrapiResolution(image?.formats)
                            : image.url
                          }`
                          : '/no-image.png'
                      }
                      alt={image.alternativeText}
                      width={image.ext === ImageType.SVG ? 50 : '100%'}
                      height={200}
                      className={clsx(
                        image ? 'object-center aspect-square' : 'object-cover object-center',
                        image.ext === ImageType.SVG ? `object-contain` : `object-cover`
                      )}
                      style={{ objectFit: 'cover' }}
                      preview={{
                        mask: (
                          <>
                            <Space size={0}>
                              {image.ext !== ImageType.SVG ? (
                                <Button
                                  type="text"
                                  className="text-white"
                                  icon={<EyeOutlined />}
                                  onClick={() => setPreview(image.hash)}
                                />
                              ) : null}
                              <Popconfirm
                                title="Delete"
                                description="Are you sure to delete this image?"
                                onConfirm={() => handleDelete(image.id)}
                                okText="Yes"
                                cancelText="No"
                                placement="rightBottom"
                              >
                                <Button
                                  type="text"
                                  className="text-white"
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>
                            </Space>
                          </>
                        ),
                        visible: image.hash === preview,
                        onVisibleChange(value) {
                          !value && setPreview('');
                        }
                      }}
                      placeholder={
                        <Skeleton.Image className="w-full h-full" active></Skeleton.Image>
                      }
                    />
                  </div>
                }
              >
                <Card.Meta title={image.name} />
              </Card>
            </Col>
          );
        })
      );
  };

  useHelmet({
    title: `Media Page`
  });



  return (
    <PlainLayout
      headerprops={{
        title: (
          <Space size={[8, 8]}>
            <SearchComponent
              placeholderC={t('common:search.placeholder', {content: "name, alt or caption"})}
              onChange={handleSearch}
              defaultValue={stateEvents.search || ''}
              allowClear
            />
            <Select
              defaultValue="all"
              style={{ width: 120 }}
              options={filterTypeOptions}
              onChange={(value) => handleFilterType(value)}
              value={stateEvents.filter || 'all'}
            />
          </Space>
        ),
        extra: [
          <Button
            key="new-media-btn"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalUpload(true)}
          >
            {t('button.new_pageName', { pageName: t('sidebar:sidebar.media') })}
          </Button>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      id="mediaScrollableDiv"
    >
      <InfiniteScroll
        dataLength={mediaModifiedData?.length}
        next={loadMoreData}
        hasMore={mediaModifiedData?.length < mediaFilteredData?.length}
        loader={<Spin className="w-full my-6" spinning={indicatorLoadMore} />}
        scrollableTarget="mediaScrollableDiv"
        className={clsx(
          `overflow-x-hidden -mr-4 pr-4`,
          fetchLoading ? `flex items-center justify-center pl-4 pb-1` : `-mr-4 pr-4`
        )}
        height={'83vh'}
      >
        <Row gutter={[24, 24]}>{renderData()}</Row>
      </InfiniteScroll>

      <ModalUpload
        form={form}
        onSubmitForm={handleUpload}
        loading={indicatorUpload}
        title={t('button.upload_image')}
        open={modalUpload}
        onCancel={() => setModalUpload(false)}
        showedFields={['name', 'alt', 'caption', 'image']}
      />
    </PlainLayout>
  );
};

export default MediaPage;
