/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  CoffeeOutlined,
  TagsOutlined,
  GlobalOutlined,
  FireOutlined,
  RocketOutlined,
  HomeOutlined,
  BookOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { Badge, Divider, Empty, Input, List, Space, Spin, Tag, Typography } from 'antd';
import { paths } from 'constant';
import { useAsyncAction, useDataDisplay, useDidMount } from 'hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getGlobalSearchService } from 'services/Global';
import { GlobalSearchItemTypeV2 } from 'services/Global/type';
import { QueryCaseType, queryCase } from 'utils/queryParams';

const LIST_ICONS = {
  tasks: <CalendarOutlined />,
  bundles: <AppstoreAddOutlined />,
  tags: <TagsOutlined />,
  properties: <CoffeeOutlined />,
  services: <AppstoreOutlined />,
  activities: <RocketOutlined />,
  landscapes: <FireOutlined />,
  unitGroups: <HomeOutlined />,
  units: <HomeOutlined />,
  reservations: <BookOutlined />,
  vouchers: <GiftOutlined />
};

export interface GlobalSearchProps {
  onClickResult: () => void;
}
const GlobalSearch = (props: GlobalSearchProps) => {
  const { t } = useTranslation(['common','sidebar']);
  const { onClickResult: handleClickResult } = props;
  const navigate = useNavigate();
  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1,
    search: ''
  });
  const [searchValue, setSearchValue] = useState<string>('');
  const [globalSearch, stateGlobalSearch] = useAsyncAction(getGlobalSearchService);

  const dataList = useDataDisplay<GlobalSearchItemTypeV2>(stateGlobalSearch);

  const handleChangeLocation = (
    {
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      search = locationCurrent.search
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      currentPage,
      perPage,
      search
    });
    globalSearch(query, controller?.signal);

    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      perPage
    });
  };

  const handleSearch = (value: string) => {
    if (value)
      setLocationCurrent({
        search: value?.trim().toLowerCase()
      });
  };

  const handleNavigate = (pathName: string) => {
    navigate(pathName);
    handleClickResult();
  };

  const caseResultsNavigate = (value: GlobalSearchItemTypeV2, type: string) => {
    switch (type) {
      case paths.properties:
        return `/${value?.Property}/${paths.detail}`;
      case paths.bundles:
        return value?.Disabled
          ? `/${value?.Property}/${paths.bundles}/${
              value.IsTemplate ? paths.bundlesTemplate : paths.bundlesOverview
            }`
          : `/${value?.Property}/${paths.bundles}/${
              value.IsTemplate ? paths.bundlesTemplate : paths.bundlesOverview
            }/${value.Id}`;
      case paths.services:
        return `/${value?.Property}/${paths.services}/${value.Id}`;
      case paths.units:
        return `/${value?.Property}/inventory/${paths.units}/${value.Id}`;
      case 'unitGroups':
        return `/${value?.Property}/inventory/${paths.unitGroups}/${value.Id}`;
      case paths.tasks:
        return `/${value?.Property}/${paths.tasks}?bundleId=${value.Id}`;
      case paths.tags:
        return `${typeof value?.Properties === 'string' ? `/${value?.Properties}` : ''}/${
          paths.tags
        }?tagId=${value.Id}&type=${value.Type}${value.IsGlobal ? `&isGlobal=true` : ''}`;
      case paths.reservations:
        return `/${value?.Property}/${paths.reservations}/${value.Id}`;
      default:
        return `/${type}`;
    }
  };

  useDidMount(
    (controller) => {
      if (locationCurrent.search)
        handleChangeLocation(
          {
            ...locationCurrent,
            currentPage: 1,
            search: searchValue || '',
            perPage: 500
          },
          controller
        );
    },
    [locationCurrent.search]
  );

  return (
    <div>
      <Input.Search
        className="w-full mt-[30px]"
        onSearch={(value) => handleSearch(value)}
        onChange={(e) => setSearchValue(e?.target?.value)}
        placeholder={
          locationCurrent.search ||
          t('common:search.search_by', { attribute: `id or ${t('common:table.name')}` })
        }
        value={searchValue}
        allowClear
      />
      <Divider orientation="left">{t('common:search.results')}</Divider>
      <Spin spinning={stateGlobalSearch.loading && searchValue !== ''}>
        <div className="max-h-[450px] overflow-auto">
          {dataList?.length && Object.values(dataList[0]).length ? (
            Object.values(dataList[0]).map((result: any, index: number) => {
              const type = Object.keys(dataList[0])?.length ? Object.keys(dataList[0])[index] : '';
              return (
                <Space key={type} direction="vertical" className="w-full gap-0">
                  <Typography.Text className="w-full inline-flex justify-between text-[#999] bg-[#CED5DD] mb-2 p-2 ">
                    {type.toUpperCase()}
                  </Typography.Text>
                  <List
                    className=""
                    dataSource={result}
                    size="small"
                    renderItem={(value: GlobalSearchItemTypeV2) => {
                      return (
                        <List.Item
                          onClick={() => {
                            const detail = caseResultsNavigate(value, type);
                            handleNavigate(`${detail}`);
                          }}
                          className="cursor-pointer hover:bg-slate-200 px-2	"
                        >
                          <List.Item.Meta
                            avatar={LIST_ICONS[type as keyof typeof LIST_ICONS]}
                            title={
                              <div className="flex justify-between">
                                <Badge
                                  count={
                                    value?.IsGlobal ? (
                                      <GlobalOutlined
                                        className="text-[12px]"
                                        style={{ color: '#ff2347' }}
                                      />
                                    ) : (
                                      ''
                                    )
                                  }
                                >
                                  <Typography.Link className="p-1">
                                    {value?.Name ?? value?.GuestFullName ?? value.Code}{' '}
                                    {value?.IsTemplate && <Tag>{t('sidebar:sidebar.template')}</Tag>}
                                  </Typography.Link>
                                </Badge>
                                <Typography.Text className="text-xs">
                                  {value?.Property}
                                </Typography.Text>
                              </div>
                            }
                            description={`${value.Id ?? ''}`}
                          />
                        </List.Item>
                      );
                    }}
                  />
                </Space>
              );
            })
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      </Spin>
    </div>
  );
};

export default GlobalSearch;
