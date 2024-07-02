/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined } from '@ant-design/icons';
import { App, Button, Image, Skeleton, Switch, Table, Tag, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import { SearchComponent, TagCustomComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import { ImageDefault } from 'components/shared';
import renderMenuLabel from 'components/shared/i18nextRender';
import { ViewMode } from 'configs/const/auth';
import { sorterType } from 'configs/const/general';
import { serviceTypeOptions } from 'configs/const/options';
import { COPYRIGHT, paths } from 'constant';
import { HORIZONTAL_SCROLL, PERPAGE } from 'constant/size';
import { useAppSize, useAsyncAction, useDidMount, useHelmet } from 'hooks';
import { useDataDisplayV2 } from 'hooks/useDisplay';
import useView from 'hooks/useView';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  deleteServiceService,
  getServicesByPropertyServiceV2,
  updateServiceService
} from 'services/ServiceList';
import { ServiceDetailAppType } from 'services/ServiceList/type';
import { TagDetailAppType } from 'services/Tags/type';
import { useAppSelector } from 'store';
import { checkDomainUrl, fallbackImageStrapiResolution } from 'utils/media';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { addSpaceInString } from 'utils/text';

const ServiceListPage = () => {
  const { t, i18n } = useTranslation(['common', 'services']);
  const currentLanguage = i18n.language;

  const { currentView, currentViewObj } = useView();
  const { message } = App.useApp();
  const { innerAppHeight } = useAppSize();
  const navigate = useNavigate();
  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1
  });

  const { data: mediaData } = useAppSelector((state) => state.booking.media);

  // SERVICES
  const [fetchServicesByProperty, stateServicesByProperty] = useAsyncAction(
    getServicesByPropertyServiceV2
  );

  const [deleteService] = useAsyncAction(deleteServiceService, {
    onSuccess: () => {
      currentViewObj?.code && handleChangeLocation({});
      message.success('Success!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  const [updateService, updateServiceState] = useAsyncAction(updateServiceService, {
    onSuccess: () => {
      message.success('Updated!', 2);
      currentViewObj?.code && handleChangeLocation({});
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  //  pagination
  const handleChangeLocation = (
    {
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      sorts = locationCurrent.sorts,
      serviceType = locationCurrent.serviceType,
      name = locationCurrent.name
    }: QueryCaseType,
    signal?: AbortSignal
  ) => {
    const query = queryCase({
      propertyId: currentViewObj?.code || '',
      currentPage,
      perPage,
      sorts,
      serviceType,
      name
    });
    fetchServicesByProperty(query, signal);
    navigate(
      `${currentView !== ViewMode.Account ? `/${currentViewObj?.code}` : ``}/${paths.services
      }?${query}`
    );
    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      sorts,
      serviceType,
      name
    });
  };

  useDidMount((controller) => {
    if (currentViewObj?.code) {
      handleChangeLocation({}, controller?.signal);
    }
  });

  // FUNCTIONS
  const handleChange: TableProps<ServiceDetailAppType>['onChange'] = (
    pagination,
    filters,
    sorter: any
  ) => {
    const filterValue = filters.serviceType?.length ? String(filters.serviceType[0]) : '';
    const order = sorter?.order
      ? sorter?.order === sorterType.ASC
        ? sorter.columnKey
        : `-${sorter?.columnKey}`
      : '';
    handleChangeLocation({
      ...locationCurrent,
      sorts: order,
      currentPage: pagination.current,
      serviceType: filterValue
    });
  };
  // DATA
  const serviceList = useDataDisplayV2<ServiceDetailAppType>(stateServicesByProperty);

  // UI
  const columns: ColumnsType<ServiceDetailAppType> = [
    {
      title: renderMenuLabel('table.image', 'common'),
      key: 'media',
      dataIndex: 'media',
      width: '5%',
      render: (values: string) => {
        const foundImage =
          values !== undefined
            ? mediaData?.find((value: any) => value?.url === values[0])
            : undefined;

        if (!foundImage) return <ImageDefault />;

        return (
          <Image
            src={`${checkDomainUrl(foundImage?.url)}${foundImage?.formats && Object.keys(foundImage?.formats)?.length
              ? fallbackImageStrapiResolution(foundImage?.formats)
              : foundImage?.url
              }`}
            alt={foundImage ? foundImage?.alternativeText : ' '} //" "prevent showing empty box when have no image
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
      sorter: true,
      render: (value, record) => (
        <>
          <Tag>{record.data?.code}</Tag>
          <span>{value[currentLanguage] ?? record?.name ?? ''}</span>
        </>
      ),
      width: '20%'
    },
    {
      title: renderMenuLabel('table.type', 'common'),
      key: 'serviceType',
      dataIndex: 'type',
      width: '15%',
      filters: serviceTypeOptions,
      filterMultiple: false,
      filteredValue: locationCurrent?.serviceType ? [locationCurrent.serviceType] : [],
      render: (type: string) => {
        return <Typography.Text>{addSpaceInString(type)}</Typography.Text>;
      }
    },
    {
      title: renderMenuLabel('table.popular', 'common'),
      key: 'popular',
      dataIndex: 'popular',
      render: (value, record) => (
        <Switch
          // disabled={true}
          checked={value}
          checkedChildren="YES"
          unCheckedChildren="NO"
          onChange={() => {
            const { tags, popular, media, extId, disabled } = record;
            extId &&
              updateService(extId, {
                popular: !popular,
                tagIds: tags?.length ? tags.map((tag) => tag.tagId || '') : undefined,
                media,
                disabled
              });
          }}
        />
      )
    },
    {
      title: renderMenuLabel('table.price', 'common'),
      dataIndex: 'price',
      key: 'price',
      render: (value, record) =>
        `${value.toLocaleString()} ${record?.data?.defaultGrossPrice?.currency}`,
      sorter: true
    },

    {
      title: renderMenuLabel('table.tags', 'common'),
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: TagDetailAppType[]) => {
        return tags?.map((tag) => (
          <TagCustomComponent
            value={tag.title}
            key={tag.tagId}
            classNameCus="m-1"
            color={tag.color}
          />
        ));
      }
    },
    {
      title: renderMenuLabel('button.disable', 'common'),
      key: 'disabled',
      dataIndex: 'disabled',
      render: (value, record) => (
        <Switch
          checked={value}
          checkedChildren="YES"
          unCheckedChildren="NO"
          onChange={() => {
            const { tags, popular, media, extId, disabled } = record;
            extId &&
              updateService(extId, {
                disabled: !disabled,
                tagIds: tags?.length ? tags.map((tag) => tag.tagId || '') : undefined,
                media,
                popular
              });
          }}
        />
      )
    },
    {
      title: renderMenuLabel('table.action', 'common'),
      dataIndex: '',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`${record.extId}`);
            }}
          />
        </>
      )
    }
  ];
  const handleSearch = (value: string) => {
    handleChangeLocation({ name: value.trim(), currentPage: 1 });
  };

  useHelmet({
    title: `${t('services:services')} / ${currentViewObj.name}`
  });

  return (
    <PlainLayout
      headerprops={{
        title: (
          <SearchComponent
            placeholderC={t('common:search.search_by', {
              attribute: `${t('common:table.name').toLowerCase()}`
            })}
            onChange={(value) => handleSearch(value)}
            defaultValue={''}
            allowClear
          />
        )
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <Table
        columns={columns}
        dataSource={serviceList.list}
        rowKey="extId"
        onChange={handleChange}
        pagination={
          !serviceList.pagination?.total ||
            (serviceList.pagination?.total && serviceList.pagination?.total < PERPAGE)
            ? false
            : {
              pageSize: locationCurrent?.perPage || PERPAGE,
              total: serviceList.pagination?.total ? Number(serviceList.pagination.total) : 1,
              showSizeChanger: false,
              current: locationCurrent.currentPage
            }
        }
        scroll={{
          y: innerAppHeight - 180,
          x: HORIZONTAL_SCROLL
        }}
        showSorterTooltip={false}
        loading={stateServicesByProperty.loading || updateServiceState.loading}
      />
    </PlainLayout>
  );
};

export default ServiceListPage;
