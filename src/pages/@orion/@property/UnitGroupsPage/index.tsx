/* eslint-disable @typescript-eslint/no-unused-vars */
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Image, Skeleton, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TagCustomComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import { ImageDefault } from 'components/shared';
import renderMenuLabel from 'components/shared/i18nextRender';
import { ViewMode } from 'configs/const/auth';
import { paths } from 'constant';
import { HORIZONTAL_SCROLL, PERPAGE } from 'constant/size';
import { useAppSize, useAsyncAction, useDataDisplayV2, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { TagDetailAppType } from 'services/Tags/type';
import { deleteUnitGroupService, getUnitGroupsByPropertyServiceV2 } from 'services/UnitGroups';
import { UnitGroupDetailAppType } from 'services/UnitGroups/type';
import { useAppSelector } from 'store';
import { checkDomainUrl, fallbackImageStrapiResolution } from 'utils/media';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { displayRole } from 'utils/view';

const UnitGroupsPage = () => {
  const { t, i18n } = useTranslation(['unitGroups']);
  const { currentView } = useView();
  const { message } = App.useApp();
  const { innerAppHeight } = useAppSize();
  const { code: codeProperty, name: nameProperty } = displayRole(currentView);
  const navigate = useNavigate();
  const currentLanguage = i18n.language;

  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1
  });

  const { data: mediaData } = useAppSelector((state) => state.orion.media);
  const [fetchUnitGroupsByProperty, stateUnitGroupsByProperty] = useAsyncAction(
    getUnitGroupsByPropertyServiceV2
  );
  //delete
  const [deleteUnitGroup] = useAsyncAction(deleteUnitGroupService, {
    onSuccess: () => {
      message.success('Success!', 2);
      handleChangeLocation({});
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  useDidMount((controller) => {
    if (codeProperty) {
      handleChangeLocation({}, controller?.signal);
    }
  });

  const handleChangeLocation = (
    { currentPage = locationCurrent.currentPage, perPage = locationCurrent.perPage }: QueryCaseType,
    signal?: AbortSignal
  ) => {
    const query = queryCase({
      propertyId: currentView === ViewMode.Account ? '' : codeProperty || '',
      currentPage,
      perPage
    });
    fetchUnitGroupsByProperty(query, signal);
    navigate(
      `${currentView !== ViewMode.Account ? `/${codeProperty}` : ``}/${paths.inventory}/${paths.unitGroups
      }?${query}`
    );
    setLocationCurrent({
      ...locationCurrent,
      currentPage
    });
  };

  // data
  const unitGroupsAppList = useDataDisplayV2<UnitGroupDetailAppType>(stateUnitGroupsByProperty);

  // UI
  const columns: ColumnsType<UnitGroupDetailAppType> = [
    {
      title: renderMenuLabel('table.image', 'common'),
      key: 'media',
      dataIndex: 'media',
      render: (values: string) => {
        const foundImage =
          values !== undefined ? mediaData?.find((value) => value.url === values[0]) : undefined;
        if (!foundImage) return <ImageDefault />;

        return (
          <Image
            src={`${checkDomainUrl(foundImage?.url)}${foundImage?.formats && Object.keys(foundImage?.formats)?.length
                ? fallbackImageStrapiResolution(foundImage?.formats)
                : foundImage?.url
              }`}
            alt={foundImage ? foundImage?.alternativeText : ' '}
            width={50}
            height={50}
            style={{ objectFit: 'cover' }}
            preview={false}
            placeholder={<Skeleton.Image className="w-full h-full" active></Skeleton.Image>}
          />
        );
      }
    },
    {
      title: renderMenuLabel('table.name', 'common'),
      key: 'name',
      dataIndex: ['extendedData', 'name'],
      render: (name, record) => (
        <>
          <Tag>{record.data?.code}</Tag>
          <span>{name[currentLanguage] ?? record?.name ?? ''}</span>
        </>
      ),
      width: '30%'
    },
    {
      title: renderMenuLabel('table.occupancy', 'common'),
      key: 'maxPersons',
      dataIndex: 'maxPersons',
      render: (value: number) => <span>{value < 2 ? value : `1 - ${value}`}</span>
    },
    {
      title: renderMenuLabel('table.member_count', 'common'),
      key: 'memberCount',
      dataIndex: ['data', 'memberCount'],
      render: (value: string) => <>{value || 0}</>
    },
    {
      title: renderMenuLabel('table.tags', 'common'),
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: TagDetailAppType[]) =>
        tags?.map((tag) => (
          <TagCustomComponent
            value={tag.title}
            key={tag.tagId}
            classNameCus="m-1"
            color={tag.color}
          />
        )),
      width: '25%'
    },
    {
      title: renderMenuLabel('table.action', 'common'),
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              navigate(record?.extId || '');
            }}
          />
        </>
      )
    }
  ];

  useHelmet({
    title: `${t('unitGroups:unit_groups')} / ${nameProperty} `
  });

  return (
    <PlainLayout
      headerprops={
        {
          // title: <SearchComponent />,
        }
      }
      className={`bg-inherit`}
    >
      <Table
        rowKey="extId"
        columns={columns}
        dataSource={unitGroupsAppList.list}
        showSorterTooltip={false}
        pagination={
          !unitGroupsAppList.pagination?.total ||
            (unitGroupsAppList.pagination?.total && unitGroupsAppList.pagination?.total < PERPAGE)
            ? false
            : {
              pageSize: locationCurrent?.perPage || PERPAGE,
              total: unitGroupsAppList.pagination?.total
                ? Number(unitGroupsAppList.pagination.total)
                : 1,
              showSizeChanger: false,
              onChange: (value) => {
                handleChangeLocation &&
                  handleChangeLocation({ ...locationCurrent, currentPage: value });
              },
              current: locationCurrent.currentPage || 1
            }
        }
        scroll={{
          y: innerAppHeight - 180,
          x: HORIZONTAL_SCROLL
        }}
        loading={stateUnitGroupsByProperty.loading}
      />
    </PlainLayout>
  );
};

export default UnitGroupsPage;
