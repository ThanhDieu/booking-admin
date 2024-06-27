/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Skeleton, Table, Typography, Image } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { ColumnsType } from 'antd/es/table';
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
  createActivitiesService,
  deleteActivitiesSrevice,
  getActivitiesService,
  getActivityDetailService,
  updateActivitiesService
} from 'services/Activity';
import { ActivityType } from 'services/Activity/type';
import { useAppSelector } from 'store';
import { checkDomainUrl, fallbackImageError } from 'utils/media';
import { QueryCaseType, queryCase } from 'utils/queryParams';

const ActivitiesPage = () => {
  const { t, i18n } = useTranslation(['common', 'sidebar', 'activities']);

  const { languages: languageSetting, loading } = useAppSelector(
    (state) => state.orion.languageSetting
  );
  const { mandatoryLocaleList } = useLocaleSegmentOption();

  const [openModal, setOpenModal] = useState<string>('');
  const [currentId, setCurrentId] = useState<string>('');
  const [form] = useForm();
  const mediaWatch = useWatch([], form);
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    perPage: PERPAGE
  });
  const { innerAppHeight } = useAppSize();

  //SERVICE
  const [getActivitiesList, activitiesListState] = useAsyncAction(getActivitiesService);
  //  pagination
  const handleChangeLocation = (
    { currentPage = locationCurrent.currentPage, perPage = locationCurrent.perPage }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      currentPage,
      perPage
    });
    getActivitiesList(query, controller?.signal);

    navigate(`/${paths.activities}?${query}`);
    setLocationCurrent({
      ...locationCurrent,
      currentPage
    });
  };

  const [createActivity, createActivityState] = useAsyncAction(createActivitiesService, {
    onSuccess: () => {
      handleChangeLocation({ ...locationCurrent });
      message.success('Created!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  const [updateActivity, updateActivityState] = useAsyncAction(updateActivitiesService, {
    onSuccess: () => {
      handleChangeLocation({ ...locationCurrent });
      message.success('Updated!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  const [getActivityDetail, activityDetailState] = useAsyncAction(getActivityDetailService);
  const [deleteActivity, deleteState] = useAsyncAction(deleteActivitiesSrevice, {
    onSuccess: () => {
      handleChangeLocation({ ...locationCurrent });
      message.success('Deleted!', 2);
    },
    onFailed: (error: any) => {
      if (error) message.error(error.message, 3);
    }
  });

  const activitiesList = useDataDisplayV2<ActivityType>(activitiesListState);
  const activityDetail = useDetailDisplay<ActivityType>(activityDetailState);

  const { data: mediaData } = useAppSelector((state) => state.orion.media);

  useDidMount((controller) => {
    handleChangeLocation({}, controller);
  });

  const defaultMedia = useMemo(() => {
    return {
      icon: mediaData?.filter((media) => activityDetail?.icon === media?.url) || [],
      image: mediaData?.filter((media) => activityDetail?.media === media?.url) || [],
      light: mediaData?.filter((media) => activityDetail?.light === media?.url) || [],
      dark: mediaData?.filter((media) => activityDetail?.dark === media?.url) || []
    };
  }, [mediaData, activityDetail]);

  const initialValue = {
    locale: 'en',
    icon: '',
    light: '',
    dark: '',
    image: '',
    title: {
      en: ''
    },
    code: ''
  } as any;

  const initialUpdateForm = {
    locale: 'en',
    icon: defaultMedia.icon ?? '',
    whiteIcon: defaultMedia.light ?? '',
    blackIcon: defaultMedia.dark ?? '',
    image: defaultMedia.image ?? '',
    title: activityDetail?.extendedData?.title ?? { en: activityDetail?.title || '' },
    code: activityDetail?.code ?? ''
  } as any;

  useEffect(() => {
    mandatoryLocaleList?.length
      ? mandatoryLocaleList?.map((lang) => (initialValue['title'][lang] = ''))
      : null;

    //set value to form
    if (openModal === FuncType?.UPDATE) form.setFieldsValue(initialUpdateForm);
    if (openModal === FuncType?.CREATE) form.setFieldsValue(initialValue);
  }, [activityDetail, defaultMedia, openModal, languageSetting]);

  const handleSubmitModal = async (formData: any) => {
    const payload = {
      code: formData?.code || '',
      name: formData?.title.en || '',
      title: formData?.title.en || '',
      icon: formData?.icon?.length
        ? formData?.icon[0]?.url
        : initialUpdateForm?.icon?.length
          ? initialUpdateForm?.icon[0]?.url
          : '',
      light: formData?.whiteIcon?.length ? formData?.whiteIcon[0]?.url : '',
      dark: formData?.blackIcon?.length ? formData?.blackIcon[0]?.url : '',
      media: formData?.image?.length ? formData?.image[0]?.url : '',
      extendedData: {
        title: formData.title
      }
    };
    if (openModal === FuncType.CREATE) createActivity(payload);
    if (openModal === FuncType.UPDATE) updateActivity(currentId, payload);
    setOpenModal('');
  };

  const columns: ColumnsType<ActivityType> = [
    {
      title: renderMenuLabel('table.code', 'common'),
      key: 'code',
      dataIndex: 'code'
    },
    {
      title: renderMenuLabel('table.title', 'common'),
      key: 'name',
      render: (_, item: ActivityType) => (
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
      dataIndex: ['light'],
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
      dataIndex: ['dark'],
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
      title: renderMenuLabel('table.image', 'common'),
      key: 'media',
      dataIndex: 'media',
      render: (media) => {
        const foundImage =
          media !== undefined ? mediaData?.find((value: any) => value?.url === media) : undefined;
        return (
          <Avatar
            shape="square"
            size="large"
            src={foundImage ? `${checkDomainUrl(media)}${media}` : '/no-image.png'}
          />
        );
      }
    },
    {
      title: renderMenuLabel('table.action', 'common'),
      key: 'action',
      align: 'right',
      dataIndex: '',
      render: (_, item: ActivityType) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={async () => {
              await getActivityDetail(item?.activityId);
              await setCurrentId(item?.activityId);
              setOpenModal(FuncType.UPDATE);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={async () => {
              await setCurrentId(item?.activityId);
              setOpenModal(FuncType.DELETE);
            }}
          />
        </>
      )
    }
  ];

  useHelmet({
    title: t('activities:activities_page')
  });
  return (
    <PlainLayout
      headerprops={{
        title: t('sidebar:sidebar.activities'),
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
            {t('activities:create_activity')}
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
          rowKey="activityId"
          loading={
            activitiesListState.loading ||
            createActivityState.loading ||
            updateActivityState.loading ||
            deleteState.loading
          }
          columns={columns}
          dataSource={activitiesList.list}
          pagination={
            !activitiesList?.pagination?.total ||
              (activitiesList?.pagination?.total && activitiesList?.pagination?.total <= PERPAGE)
              ? false
              : {
                pageSize: PERPAGE,
                total: activitiesList?.pagination?.total
                  ? Number(activitiesList?.pagination.total)
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
          actionType={openModal}
          open={!loading && (openModal === FuncType?.CREATE || openModal === FuncType?.UPDATE)}
          onSubmitForm={handleSubmitModal}
          title={
            openModal === FuncType.CREATE
              ? t('activities:create_activity')
              : t('activities:update_activities')
          }
          width={800}
          loading={createActivityState?.loading || updateActivityState?.loading}
          onCancel={() => setOpenModal('')}
          showedFields={['locale', 'whiteIcon', 'blackIcon', 'activityImage', 'code']}
          mediaData={mediaData}
          mediaWatch={mediaWatch}
          form={form}
          selectionType="radio"
        />
        <ModalConfirmation
          content={t('common:modal.confirm_content_delete')}
          modalOpen={openModal === FuncType?.DELETE}
          onChangeOpenModal={() => setOpenModal('')}
          callBack={() => deleteActivity(currentId)}
          title={t('activities:delete_activity')}
        />
      </>
    </PlainLayout>
  );
};

export default ActivitiesPage;
