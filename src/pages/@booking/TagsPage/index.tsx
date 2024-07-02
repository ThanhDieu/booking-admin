/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusOutlined } from '@ant-design/icons';
import { App, Button, Tabs, TabsProps } from 'antd';
import { DefaultOptionType } from 'antd/es/cascader';
import { ModalCreateUpdateAmenities } from 'components/common';
import { PlainLayout } from 'components/layout';
import { ViewMode } from 'configs/const/auth';
import { FuncType, GeneralName, tagType } from 'configs/const/general';
import { paths } from 'constant';
import { useAsyncAction, useDataDisplayV2, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  createTagsService,
  deleteTagsService,
  getTagsListService,
  updateTagsService
} from 'services/Tags';
import { TagDetailAppType } from 'services/Tags/type';
import { useAppSelector } from 'store';
import { formatSelectOption } from 'utils/format';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { TagList } from './partials';

const TagsPage = () => {
  const { t } = useTranslation(['common', 'tags', 'sidebar']);
  const { currentView, currentViewObj } = useView();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { properties } = useAppSelector((state) => state.booking?.property);
  const { loading: loadingSettingLang } = useAppSelector((state) => state.booking.languageSetting);

  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    type: tagType.SERVICE
  });
  const [openModal, setOpenModal] = useState<string>('');
  const [currentItem, setCurrentItem] = useState<TagDetailAppType>();

  const [fetchTags, stateTags] = useAsyncAction(getTagsListService);

  //  pagination
  const handleChangeLocation = (
    {
      type = locationCurrent.type,
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      sorts = locationCurrent.sorts,
      status = locationCurrent.status,
      isGlobal = locationCurrent.isGlobal
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      type,
      propertyId: currentView === ViewMode.Account ? '' : currentViewObj?.code || '',
      currentPage,
      perPage,
      sorts,
      status,
      isGlobal: currentView !== ViewMode.Account ? isGlobal : 'true'
    });
    fetchTags(query, controller?.signal);
    navigate(
      `${currentView !== ViewMode.Account ? `/${currentViewObj?.code}` : ``}/${paths.tags}?${query}`
    );
    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      type,
      sorts,
      status,
      isGlobal
    });
  };

  // DOING
  useDidMount(
    (controller) => {
      if (locationCurrent.type) {
        const newLocation = {
          ...locationCurrent,
          currentPage: 1,
          status: '',
          sorts: '',
          isGlobal: ''
        };
        handleChangeLocation(newLocation, controller);
      } else {
        handleChangeLocation(
          { currentPage: locationCurrent.currentPage, type: tagType.SERVICE },
          controller
        );
      }
    },
    [locationCurrent.type]
  );

  // data
  const tagList = useDataDisplayV2<TagDetailAppType>(stateTags);
  const hotelOptions = useMemo(() => {
    if (currentView === ViewMode.Account) {
      const options = properties?.data?.length
        ? formatSelectOption(properties.data, 'name', 'extId')
        : [];

      return [
        {
          label: 'All',
          value: 'all'
        },
        ...(options as DefaultOptionType[])
      ];
    }
    return currentViewObj
      ? [
        {
          label: currentViewObj.name,
          value: `${currentViewObj.code}@${currentViewObj.name}`
        }
      ]
      : [];
  }, [properties?.data, currentView]);

  // events
  const [updateTag, updateTagState] = useAsyncAction(updateTagsService, {
    onSuccess: () => {
      setOpenModal('');
      handleChangeLocation({});
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const [createTag, createTagState] = useAsyncAction(createTagsService, {
    onSuccess: () => {
      setOpenModal('');
      handleChangeLocation({});
      message.success('Success!', 2);
    },
    onFailed: (error: any) => {
      message.error(error?.message, 2);
    }
  });

  const handleCreateTag = async (formdata: TagDetailAppType) => {
    await createTag(formdata);
    handleTabsChange(formdata.type);
  };

  const [deleteTag] = useAsyncAction(deleteTagsService, {
    onSuccess: () => {
      handleChangeLocation({});
      message.success('Success!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  // FUNCTIONS
  const handleTabsChange = (key: string) => {
    // handleChangeLocation({
    //   ...locationCurrent,
    //   type: key,
    //   currentPage: 1,
    //   status: '',
    //   sorts: '',
    //   isGlobal: ''
    // });
    setLocationCurrent({
      type: key
    });
  };

  const handleSelectedTag = (record: TagDetailAppType) => {
    setCurrentItem(record);
    setOpenModal(FuncType.UPDATE);
  };

  const handleUpdateStatusTag = (id: string, formData: any) => {
    if (id) updateTag(id, formData);
    else message.error(t('common:modal.have_something_wrong'), 2);
  };

  const handleDeleteTag = (id: string) => {
    if (id) deleteTag(id);
    else message.error(t('common:modal.have_something_wrong'), 2);
  };

  // UI
  const items: TabsProps['items'] = Object.values(tagType).map((type) => {
    const localizedLabel = t('sidebar:sidebar.' + type.toLowerCase());
    return {
      key: type,
      label: localizedLabel,
      children: (
        <TagList
          tagList={tagList.list}
          onSelect={handleSelectedTag}
          onUpdateStatus={handleUpdateStatusTag}
          onDelete={handleDeleteTag}
          pagination={tagList.pagination}
          locationCurrent={locationCurrent}
          onChangeLocation={handleChangeLocation}
          loading={stateTags.loading}
        />
      )
    };
  });

  useHelmet({
    title:
      currentView === ViewMode.Account
        ? t('tags:tags_page')
        : `${t('tags:tags')} / ${currentViewObj.name}`
  });

  return (
    <PlainLayout
      headerprops={{
        // title: <SearchComponent />,
        extra: [
          <Button
            type="primary"
            key="new-user-btn"
            icon={<PlusOutlined />}
            onClick={() => {
              setOpenModal(FuncType.CREATE);
            }}
          >
            {t('common:button.new_pageName', { pageName: 'Tag' })}
          </Button>
        ]
      }}
      className={`bg-inherit`}
    >
      <Tabs
        items={items}
        onChange={handleTabsChange}
        defaultActiveKey={locationCurrent.type}
        activeKey={locationCurrent.type}
      />

      {/* Update - Create Tag modal */}
      {(openModal === FuncType.UPDATE || openModal === FuncType.CREATE) && !loadingSettingLang && (
        <ModalCreateUpdateAmenities
          isHasInputLocale
          openModal={openModal}
          onChangeOpenModal={() => setOpenModal('')}
          handleUpdate={(id, formData) => updateTag(id, formData as TagDetailAppType)}
          handleCreate={(formData) => handleCreateTag(formData as TagDetailAppType)}
          title={openModal === FuncType.UPDATE ? t('tags:update_tag') : t('tags:create_tag')}
          preValueUpdate={openModal === FuncType.UPDATE ? currentItem : undefined}
          variant={GeneralName.Tag as keyof typeof GeneralName}
          propertyList={hotelOptions}
          loading={updateTagState.loading || createTagState.loading}
          haveDescription
        />
      )}
    </PlainLayout>
  );
};

export default TagsPage;
