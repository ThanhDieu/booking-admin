/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Image, Skeleton, Typography } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import Table, { ColumnsType } from 'antd/es/table';
import { ModalConfirmation, ModalUpload } from 'components/common';
import { PlainLayout } from 'components/layout';
import { ImageDefault } from 'components/shared';
import renderMenuLabel from 'components/shared/i18nextRender';
import { FuncType } from 'configs/const/general';
import { COPYRIGHT, paths } from 'constant';
import { HORIZONTAL_SCROLL, PERPAGE } from 'constant/size';
import {
  useAppSize,
  useAsyncAction,
  useDataDisplayV2,
  useDetailDisplay,
  useDidMount,
  useHelmet,
  useLocaleSegmentOption
} from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  createLandscapeService,
  deleteLandscapeSrevice,
  getLandscapeDetailService,
  getLandscapesService,
  updateLandscapeService
} from 'services/Landscape';
import { LandscapeType } from 'services/Landscape/type';
import { useAppSelector } from 'store';
import { checkDomainUrl, fallbackImageError } from 'utils/media';
import { QueryCaseType, queryCase } from 'utils/queryParams';

const Landscape = () => {
  const { t, i18n } = useTranslation(['common', 'sidebar', 'landscapes']);

  const { message } = App.useApp();
  const { data: mediaData } = useAppSelector((state) => state.booking.media);
  const { languages: languageSetting, loading } = useAppSelector(
    (state) => state.booking.languageSetting
  );
  const { mandatoryLocaleList } = useLocaleSegmentOption();

  const [form] = useForm();
  const [openModal, setOpenModal] = useState<string>('');
  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: PERPAGE
  });
  const mediaWatch = useWatch([], form);
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState<string>('');
  const { innerAppHeight } = useAppSize();

  //SERVICE
  const [getLanscapeList, landscapeListState] = useAsyncAction(getLandscapesService);
  const handleChangeLocation = (
    { currentPage = locationCurrent.currentPage, perPage = locationCurrent.perPage }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      currentPage,
      perPage
    });
    getLanscapeList(query, controller?.signal);

    navigate(`/${paths.landscapes}?${query}`);
    setLocationCurrent({
      ...locationCurrent,
      currentPage
    });
  };

  const [createLandscape, createLandscapeState] = useAsyncAction(createLandscapeService, {
    onSuccess: () => {
      handleChangeLocation({ ...locationCurrent });
      message.success('Created!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const [updateLandscape, updateLandscapeState] = useAsyncAction(updateLandscapeService, {
    onSuccess: () => {
      handleChangeLocation({ ...locationCurrent });
      message.success('Updated!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  const [getLandscapeDetail, landscapeDetailState] = useAsyncAction(getLandscapeDetailService);
  const [deleteLandscape, deleteLandscapeState] = useAsyncAction(deleteLandscapeSrevice, {
    onSuccess: () => {
      handleChangeLocation({ ...locationCurrent });
      message.success('Deleted!', 2);
    },
    onFailed: (error: any) => {
      if (error) message.error(error.message, 3);
    }
  });

  //DATA DISPLAY
  const landscapeList = useDataDisplayV2<LandscapeType>(landscapeListState);
  const landscapeDetail = useDetailDisplay<LandscapeType>(landscapeDetailState);

  useDidMount((controller) => {
    handleChangeLocation({}, controller);
  });

  const columns: ColumnsType<LandscapeType> = [
    {
      title: renderMenuLabel('table.title', 'common'),
      key: 'title',
      render: (_, item: LandscapeType) => (
        <Typography.Text>
          {item?.extendedData?.title[i18n.language]
            ? item.extendedData.title[i18n.language]
            : item?.title ?? ''}
        </Typography.Text>
      )
    },
    {
      title: renderMenuLabel('table.light_icon', 'common'),
      key: 'whiteIcons',
      dataIndex: ['icons', 'light'],
      render: (icon: string) => {
        const foundImage =
          icon !== undefined ? mediaData?.find((value) => value.url === icon) : undefined;
        if (!foundImage) return <ImageDefault />;

        return (
          <Image
            preview={false}
            src={`${checkDomainUrl(icon)}${icon}`}
            alt=""
            className="bg-slate-300  w-10 h-10"
            placeholder={<Skeleton.Image className="w-full h-full" active></Skeleton.Image>}
            fallback={fallbackImageError}
          />
        );
      }
    },
    {
      title: renderMenuLabel('table.dark_icon', 'common'),
      key: 'blackIcons',
      dataIndex: ['icons', 'dark'],
      render: (icon) => {
        const foundImage =
          icon !== undefined ? mediaData?.find((value) => value.url === icon) : undefined;
        if (!foundImage) return <ImageDefault />;

        return (
          <Image
            preview={false}
            src={`${checkDomainUrl(icon)}${icon}`}
            alt=""
            className="bg-slate-300  w-10 h-10"
            placeholder={<Skeleton.Image className="w-full h-full" active></Skeleton.Image>}
            fallback={fallbackImageError}
          />
        );
      }
    },
    {
      title: renderMenuLabel('table.action', 'common'),
      key: 'action',
      align: 'right',
      dataIndex: '',
      render: (_, item: LandscapeType) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={async () => {
              await getLandscapeDetail(item.landscapeId);
              await setCurrentId(item.landscapeId);
              setOpenModal(FuncType.UPDATE);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={async () => {
              await setCurrentId(item.landscapeId);
              setOpenModal(FuncType.DELETE);
            }}
          />
        </>
      )
    }
  ];

  const defaultIcon = useMemo(() => {
    const whiteIcon =
      mediaData?.filter((media) => landscapeDetail?.icons?.light === media?.url) || [];
    const blackIcon =
      mediaData?.filter((media) => landscapeDetail?.icons?.dark === media?.url) || [];
    return {
      whiteIcon,
      blackIcon
    };
  }, [mediaData, landscapeDetail]);

  const initialValue = {
    locale: 'en',
    whiteIcon: '',
    blackIcon: '',
    title: {
      en: ''
    }
  } as any;

  const initialUpdateForm = {
    locale: 'en',
    whiteIcon: defaultIcon?.whiteIcon,
    blackIcon: defaultIcon?.blackIcon,
    title: landscapeDetail?.extendedData?.title ?? { en: landscapeDetail?.title || '' }
  } as any;

  useEffect(() => {
    mandatoryLocaleList?.length
      ? mandatoryLocaleList?.map((lang) => (initialValue['title'][lang] = ''))
      : null;

    //set value to form
    if (openModal === FuncType?.UPDATE) form.setFieldsValue(initialUpdateForm);
    if (openModal === FuncType?.CREATE) form.setFieldsValue(initialValue);
  }, [landscapeDetail, defaultIcon, openModal, languageSetting]);

  const handleSubmitModal = async (formData: any) => {
    const payload = {
      name: formData?.title.en || '',
      title: formData?.title.en || '',
      icons: {
        dark: formData?.blackIcon[0]?.url || '',
        light: formData?.whiteIcon[0]?.url || ''
      },
      extendedData: {
        title: formData.title
      }
    };
    if (openModal === FuncType.CREATE) createLandscape(payload);
    if (openModal === FuncType.UPDATE) updateLandscape(currentId, payload);
    setOpenModal('');
  };

  useHelmet({
    title: t('landscapes:landscapes_page')
  });

  return (
    <PlainLayout
      headerprops={{
        title: t('sidebar:sidebar.landscapes'),
        extra: [
          <Button
            type="primary"
            key="new-user-btn"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setOpenModal(FuncType.CREATE);
            }}
          >
            {t('button.new_pageName', { pageName: t('sidebar:sidebar.landscapes') })}
          </Button>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit overflow-hidden"
    >
      <>
        <Table
          rowKey="landscapeId"
          loading={
            landscapeListState.loading ||
            createLandscapeState.loading ||
            updateLandscapeState.loading ||
            deleteLandscapeState.loading
          }
          columns={columns}
          dataSource={landscapeList.list}
          pagination={
            !landscapeList?.pagination?.total ||
              (landscapeList?.pagination?.total && landscapeList?.pagination?.total <= PERPAGE)
              ? false
              : {
                pageSize: PERPAGE,
                total: landscapeList?.pagination?.total
                  ? Number(landscapeList?.pagination.total)
                  : 1,
                showSizeChanger: false,
                onChange: (value) => {
                  handleChangeLocation &&
                    handleChangeLocation({ ...locationCurrent, currentPage: value });
                }
              }
          }
          scroll={{
            y: innerAppHeight - 200,
            x: HORIZONTAL_SCROLL
          }}
        />

        <ModalUpload
          open={!loading && (openModal === FuncType?.CREATE || openModal === FuncType?.UPDATE)}
          onSubmitForm={handleSubmitModal}
          title={
            openModal === FuncType.CREATE
              ? t('landscapes:create_landscape')
              : t('landscapes:update_landscapes')
          }
          loading={createLandscapeState?.loading || updateLandscapeState?.loading}
          onCancel={() => setOpenModal('')}
          showedFields={['locale', 'whiteIcon', 'blackIcon']}
          mediaData={mediaData}
          mediaWatch={mediaWatch}
          form={form}
          selectionType="radio"
          width={600}
        />
        <ModalConfirmation
          content={t('common:modal.confirm_content_delete')}
          modalOpen={openModal === FuncType?.DELETE}
          onChangeOpenModal={() => setOpenModal('')}
          callBack={() => deleteLandscape(currentId)}
          title={t('landscapes:delete_activity')}
        />
      </>
    </PlainLayout>
  );
};

export default Landscape;
