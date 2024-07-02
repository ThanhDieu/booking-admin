/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined, GlobalOutlined } from '@ant-design/icons';
import { Badge, Button, Image, Skeleton, Switch, Table, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import { SortOrder } from 'antd/es/table/interface';
import { TagCustomComponent } from 'components/common';
import { ViewMode } from 'configs/const/auth';
import { sorterType } from 'configs/const/general';
import { HORIZONTAL_SCROLL, PERPAGE } from 'constant/size';
import { useAppSize } from 'hooks';
import useView from 'hooks/useView';
import { TagDetailAppType } from 'services/Tags/type';
import { checkDomainUrl, fallbackImageError } from 'utils/media';
import { QueryCaseType } from 'utils/queryParams';
import { DeleteTagModal } from '.';
import renderMenuLabel from 'components/shared/i18nextRender';
import { useAppSelector } from 'store';
import { ExpandTag, ImageDefault } from 'components/shared';
import { useTranslation } from 'react-i18next';

export interface TagListProps {
  tagList: TagDetailAppType[];
  onSelect?: (record: TagDetailAppType) => void;
  onUpdateStatus?: (id: string, formData: any) => void;
  onDelete: (id: string) => void;
  locationCurrent?: QueryCaseType;
  onChangeLocation?: (value: QueryCaseType) => void;
  pagination?: PaginationType;
  loading?: boolean;
}

function TagList(props: TagListProps) {
  const { data: mediaData } = useAppSelector((state) => state.booking.media);
  const { i18n } = useTranslation(['common', 'sidebar', 'activities']);

  const { currentView } = useView();
  const {
    tagList,
    onSelect: handleSelect,
    onUpdateStatus: handleUpdateStatus,
    onDelete: handleDelete,
    locationCurrent,
    onChangeLocation: handleChangeLocation,
    pagination,
    loading
  } = props;
  const { innerAppHeight } = useAppSize();

  // FUNCTIONS
  const handleChangeTable: TableProps<TagDetailAppType>['onChange'] = (
    pagination,
    filters,
    sorter: any
  ) => {
    const status = filters.status?.length ? String(filters.status[0]) : '';
    const isGlobal = filters.title?.length ? String(filters.title[0]) : '';
    const order = sorter?.order
      ? sorter?.order === sorterType.ASC
        ? sorter.columnKey
        : `-${sorter?.columnKey}`
      : '';
    handleChangeLocation &&
      handleChangeLocation({
        ...locationCurrent,
        sorts: order,
        currentPage: pagination.current,
        status,
        isGlobal
      });
  };

  const formatSorter = (name: string): SortOrder => {
    if (locationCurrent?.sorts) {
      if (locationCurrent?.sorts === name) return sorterType.ASC as SortOrder;
      if (locationCurrent?.sorts === `-${name}`) return sorterType.DES as SortOrder;
      return null;
    }
    return null;
  };

  // UI
  const columns: ColumnsType<TagDetailAppType> = [
    {
      title: renderMenuLabel('table.title', 'common'),
      key: 'title',
      width: '15%',
      sorter: true,
      filters:
        currentView !== ViewMode.Account
          ? [
            { text: 'Global', value: 'true' },
            { text: 'Local', value: 'false' }
          ]
          : undefined,
      ellipsis: true,
      filterMultiple: false,
      filteredValue: locationCurrent?.isGlobal ? [locationCurrent?.isGlobal] : [],
      sortOrder: formatSorter('title'),
      render: (_, record) => {
        const formatLocaleTitle = record?.extendedData?.title[i18n.language]
          ? record.extendedData.title[i18n.language]
          : record?.title ?? '';
        return (
          <Badge
            count={
              currentView !== ViewMode.Account && record.isGlobal ? (
                <GlobalOutlined style={{ color: '#ff2347' }} />
              ) : (
                ''
              )
            }
          >
            <TagCustomComponent
              value={formatLocaleTitle}
              key={record.tagId}
              classNameCus="m-1"
              color={record.color}
            />
          </Badge>
        );
      }
    },
    {
      title: renderMenuLabel('table.icon', 'common'),
      dataIndex: 'icon',
      key: 'icon',
      width: '10%',
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
      title: renderMenuLabel('table.count', 'common'),
      dataIndex: 'count',
      key: 'count',
      width: '10%',
      sorter: true,
      sortOrder: formatSorter('count')
    },
    {
      title: renderMenuLabel('table.status', 'common'),
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (value, record) => (
        <Switch
          disabled={currentView !== ViewMode.Account && record.isGlobal}
          checked={value}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          onChange={() => {
            const { tagId, status, color, description, isGlobal, properties, title, type, icon } =
              record;
            handleUpdateStatus &&
              tagId &&
              handleUpdateStatus(tagId, {
                color,
                description,
                isGlobal,
                propertyIds: properties?.length
                  ? properties.map((property) => property?.extId)
                  : [],
                title,
                status: !status,
                type,
                icon
              });
          }}
        />
      ),
      filters: [
        { text: 'Enabled', value: 'true' },
        { text: 'Disabled', value: 'false' }
      ],
      ellipsis: true,
      filterMultiple: false,
      filteredValue: locationCurrent?.status ? [locationCurrent?.status] : []
    },
    {
      title: renderMenuLabel('table.description', 'common'),
      key: 'description',
      width: '35%',
      render: (_, record) => {
        const formatLocaleDes = record?.extendedData?.description[i18n.language]
          ? record.extendedData.description[i18n.language]
          : record?.description ?? '';
        return <Typography.Text className="text-desc p-0">{formatLocaleDes}</Typography.Text>;
      }
    },
    currentView === ViewMode.Account
      ? {
        title: renderMenuLabel('table.properties', 'common'),
        dataIndex: 'properties',
        key: 'properties',
        width: '25%',
        render: (values: { extId: string; name: string }[]) =>
          values?.length ? <ExpandTag currentTagList={values} showNumber={2} toggle /> : []
      }
      : {},
    {
      title: renderMenuLabel('table.action', 'common'),
      key: 'action',
      align: 'right',
      width: 200,
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleSelect && handleSelect(record)}
            disabled={currentView !== ViewMode.Account && record.isGlobal}
          />

          <DeleteTagModal
            currentItem={record}
            onConfirmDelete={(id: string) => handleDelete && handleDelete(id)}
            disabled={Boolean(currentView !== ViewMode.Account && record.isGlobal)}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              disabled={currentView !== ViewMode.Account && record.isGlobal}
              danger
            />
          </DeleteTagModal>
        </>
      )
    }
  ];

  return (
    <Table
      rowKey="tagId"
      columns={columns}
      dataSource={tagList}
      showSorterTooltip={false}
      onChange={handleChangeTable}
      pagination={
        !pagination?.total || (pagination?.total && pagination?.total < PERPAGE)
          ? false
          : {
            pageSize: locationCurrent?.perPage || PERPAGE,
            total: pagination?.total ? Number(pagination.total) : 1,
            showSizeChanger: false,
            current: locationCurrent?.currentPage
          }
      }
      scroll={{
        y: innerAppHeight - 200,
        x: HORIZONTAL_SCROLL
      }}
      loading={loading}
    />
  );
}

export default TagList;
