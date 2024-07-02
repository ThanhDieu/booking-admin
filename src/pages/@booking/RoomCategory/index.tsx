/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Skeleton, Table, Typography, Image } from 'antd';
import { PlainLayout } from 'components/layout';
import { COPYRIGHT, paths } from 'constant';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { HORIZONTAL_SCROLL, PERPAGE } from 'constant/size';
import {
  useAppSize,
  useAsyncAction,
  useDataDisplayV2,
  useDetailDisplay,
  useDidMount,
  useLocaleSegmentOption
} from 'hooks';
import {
  createRoomCategoryService,
  deleteRoomCategoryService,
  getRoomCategoryDetailService,
  getRoomCategoryService,
  updateRoomCategoryService
} from 'services/RoomCategory';
import { useNavigate } from 'react-router-dom';
import { RoomCategoryType } from 'services/RoomCategory/type';
import { ColumnsType } from 'antd/es/table';
import { ImageDefault } from 'components/shared';
import { useAppSelector } from 'store';
import { useForm, useWatch } from 'antd/es/form/Form';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { FuncType } from 'configs/const/general';
import { ModalConfirmation, ModalUpload } from 'components/common';
import { checkDomainUrl, fallbackImageError } from 'utils/media';

const RoomCategory = () => {
  const { t, i18n } = useTranslation(['common', 'sidebar', 'roomCategory']);

  const navigate = useNavigate();
  const { message } = App.useApp();

  const { data: mediaData } = useAppSelector((state) => state.booking.media);
  const { languages: languageSetting, loading } = useAppSelector(
    (state) => state.booking.languageSetting
  );
  const { mandatoryLocaleList } = useLocaleSegmentOption();

  const [form] = useForm();
  const [openModal, setOpenModal] = useState<string>('');
  const mediaWatch = useWatch([], form);
  const [currentId, setCurrentId] = useState<string>('');

  const { innerAppHeight } = useAppSize();

  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: PERPAGE
  });

  //SERVICE
  const [getRoomCategoryList, roomCategoryListState] = useAsyncAction(getRoomCategoryService);
  const [getRoomCategoryDetail, roomCategoryDetailState] = useAsyncAction(
    getRoomCategoryDetailService
  );

  const [deleteRoomCategory, deleteRoomCategoryState] = useAsyncAction(deleteRoomCategoryService, {
    onSuccess: () => {
      handleChangeLocation({ ...locationCurrent });
      message.success('Deleted!', 2);
    },
    onFailed: (error: any) => {
      if (error) message.error(error.message, 3);
    }
  });

  const [createRoomCategory, createRoomCategoryState] = useAsyncAction(createRoomCategoryService, {
    onSuccess: () => {
      handleChangeLocation({ ...locationCurrent });
      message.success('Created!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const [updateRoomCategoryList, updateRoomCategoryListState] = useAsyncAction(
    updateRoomCategoryService,
    {
      onSuccess: () => {
        handleChangeLocation({ ...locationCurrent });
        message.success('Updated!', 2);
      },
      onFailed: () => {
        // message.error('Failed!', 2);
      }
    }
  );

  const handleChangeLocation = (
    { currentPage = locationCurrent.currentPage, perPage = locationCurrent.perPage }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      currentPage,
      perPage
    });
    getRoomCategoryList(query, controller?.signal);

    navigate(`/${paths.roomCategory}?${query}`);
    setLocationCurrent({
      ...locationCurrent,
      currentPage
    });
  };

  //DATA DISPLAY
  const roomCategoryList = useDataDisplayV2<RoomCategoryType>(roomCategoryListState);
  const roomCategoryDetail = useDetailDisplay<RoomCategoryType>(roomCategoryDetailState);

  const defaultIcon = useMemo(() => {
    const whiteIcon =
      mediaData?.filter((media) => roomCategoryDetail?.icons?.light === media?.url) || [];
    const blackIcon =
      mediaData?.filter((media) => roomCategoryDetail?.icons?.dark === media?.url) || [];
    return {
      whiteIcon,
      blackIcon
    };
  }, [mediaData, roomCategoryDetail]);

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
    title: roomCategoryDetail?.extendedData?.title ?? { en: roomCategoryDetail?.title || '' }
  } as any;

  useDidMount((controller) => {
    handleChangeLocation({}, controller);
  });

  const columns: ColumnsType<RoomCategoryType> = [
    {
      title: t('common:table.title'),
      key: 'title',
      render: (_, item: RoomCategoryType) => (
        <Typography.Text>
          {item?.extendedData?.title[i18n.language]
            ? item.extendedData.title[i18n.language]
            : item?.title ?? ''}
        </Typography.Text>
      )
    },
    {
      title: t('common:table.light_icon'),
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
      title: t('common:table.dark_icon'),
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
      title: t('common:table.action'),
      key: 'action',
      align: 'right',
      dataIndex: '',
      render: (_, item: RoomCategoryType) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={async () => {
              await getRoomCategoryDetail(item.specialBundleId);
              await setCurrentId(item.specialBundleId);
              setOpenModal(FuncType.UPDATE);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={async () => {
              await setCurrentId(item.specialBundleId);
              setOpenModal(FuncType.DELETE);
            }}
          />
        </>
      )
    }
  ];

  useEffect(() => {
    mandatoryLocaleList?.length
      ? mandatoryLocaleList?.map((lang) => (initialValue['title'][lang] = ''))
      : null;

    //set value to form
    if (openModal === FuncType?.UPDATE) form.setFieldsValue(initialUpdateForm);
    if (openModal === FuncType?.CREATE) form.setFieldsValue(initialValue);
  }, [roomCategoryDetail, defaultIcon, openModal, languageSetting]);

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
    if (openModal === FuncType.CREATE) createRoomCategory(payload);
    if (openModal === FuncType.UPDATE) updateRoomCategoryList(currentId, payload);
    setOpenModal('');
  };

  return (
    <PlainLayout
      headerprops={{
        title: t('sidebar:sidebar.room-category'),
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
            {t('roomCategory:new_room_category')}
          </Button>
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit overflow-hidden"
    >
      <Table
        loading={
          roomCategoryListState.loading ||
          createRoomCategoryState.loading ||
          updateRoomCategoryListState.loading ||
          deleteRoomCategoryState.loading
        }
        columns={columns}
        rowKey="specialBundleId"
        dataSource={roomCategoryList.list}
        pagination={
          !roomCategoryList?.pagination?.total ||
            (roomCategoryList?.pagination?.total && roomCategoryList?.pagination?.total <= PERPAGE)
            ? false
            : {
              pageSize: PERPAGE,
              total: roomCategoryList?.pagination?.total
                ? Number(roomCategoryList?.pagination.total)
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
            ? t('roomCategory:create_room_category')
            : t('roomCategory:update_room_category')
        }
        loading={createRoomCategoryState?.loading || updateRoomCategoryListState?.loading}
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
        callBack={() => deleteRoomCategory(currentId)}
        title={t('roomCategory:delete_room_category')}
      />
    </PlainLayout>
  );
};

export default RoomCategory;
