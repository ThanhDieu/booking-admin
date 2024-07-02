/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditOutlined } from '@ant-design/icons';
import { Button, Table, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import { PlainLayout } from 'components/layout';
import renderMenuLabel from 'components/shared/i18nextRender';
import { ViewMode } from 'configs/const/auth';
import { sorterType } from 'configs/const/general';
import { paths } from 'constant';
import { HORIZONTAL_SCROLL, PERPAGE } from 'constant/size';
import { useAppSize, useAsyncAction, useDataDisplayV2, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getUnitsByPropertyService } from 'services/Units';
import { UnitDetailAppType } from 'services/Units/type';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { displayRole } from 'utils/view';

const UnitsPage = () => {
  const { t, i18n } = useTranslation(['units', 'common']);
  const currentLanguage = i18n.language;

  const { currentView } = useView();
  const { code: codeProperty, name: nameProperty } = displayRole(currentView);
  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1
  });
  const navigate = useNavigate();
  const { innerAppHeight } = useAppSize();
  const [fetchUnitsByProperty, stateUnitsByProperty] = useAsyncAction(getUnitsByPropertyService);

  //  pagination
  const handleChangeLocation = (
    {
      currentPage = locationCurrent.currentPage,
      perPage = locationCurrent.perPage,
      sorts = locationCurrent.sorts
    }: QueryCaseType,
    signal?: AbortSignal
  ) => {
    const query = queryCase({
      propertyId: currentView === ViewMode.Account ? '' : codeProperty || '',
      currentPage,
      perPage,
      sorts
    });
    fetchUnitsByProperty(query, signal);
    navigate(
      `${currentView !== ViewMode.Account ? `/${codeProperty}` : ``}/${paths.inventory}/${
        paths.units
      }?${query}`
    );
    setLocationCurrent({
      ...locationCurrent,
      currentPage,
      sorts
    });
  };

  useDidMount((controller) => {
    if (codeProperty) {
      handleChangeLocation({}, controller?.signal);
    }
  });

  // FUNCTIONS
  const handleChange: TableProps<UnitDetailAppType>['onChange'] = (
    pagination,
    filters,
    sorter: any
  ) => {
    const order = sorter?.order
      ? sorter?.order === sorterType.ASC
        ? sorter.columnKey
        : `-${sorter?.columnKey}`
      : '';
    handleChangeLocation({
      ...locationCurrent,
      sorts: order,
      currentPage: pagination.current
    });
  };

  // DATA
  const unitAppList = useDataDisplayV2<UnitDetailAppType>(stateUnitsByProperty);

  // UI
  const columns: ColumnsType<UnitDetailAppType> = [
    {
      title: renderMenuLabel('table.name', 'common'),
      key: 'name',
      dataIndex: 'name',
      sorter: true
    },
    {
      title: renderMenuLabel('table.unit_group', 'common'),
      key: 'unitGroup',
      dataIndex: ['unitGroup', 'extendedData', 'name'],
      render: (name, item) => (
        <Typography.Text>{name[currentLanguage ?? item?.name ?? '']}</Typography.Text>
      )
    },
    {
      title: renderMenuLabel('table.occupancy', 'common'),
      key: 'maxPersons',
      dataIndex: 'maxPersons',
      render: (value: number) => <span>{value ? (value < 2 ? value : `1 - ${value}`) : 0}</span>
    },
    {
      title: renderMenuLabel('table.size', 'common'),
      key: 'size',
      dataIndex: 'size',
      render: (value: number) => <span>{value || 0} m²</span>
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
              navigate(record.extId || '');
            }}
          />
          {/* <Popconfirm
            placement="bottomLeft"
            title="Are you sure to delete?"
            onConfirm={() => {
              null;
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm> */}
        </>
      )
    }
  ];

  useHelmet({
    title: `${t('units:units')} / ${nameProperty} `
  });

  return (
    <PlainLayout
      headerprops={
        {
          // title: <SearchComponent />,
          // extra: [
          //   <Button
          //     type="primary"
          //     key="new-units-btn"
          //     icon={<PlusOutlined />}
          //     onClick={() => navigate(`${paths.create}`)}
          //     disabled
          //   >
          //     New unit
          //   </Button>
          // ]
        }
      }
      className={`bg-inherit`}
    >
      <Table
        rowKey="extId"
        columns={columns}
        dataSource={unitAppList.list}
        onChange={handleChange}
        showSorterTooltip={false}
        pagination={
          !unitAppList.pagination?.total ||
          (unitAppList.pagination?.total && unitAppList.pagination?.total < PERPAGE)
            ? false
            : {
                pageSize: locationCurrent?.perPage || PERPAGE,
                total: unitAppList.pagination?.total ? Number(unitAppList.pagination.total) : 1,
                showSizeChanger: false,
                current: locationCurrent.currentPage || 1
              }
        }
        scroll={{
          y: innerAppHeight - 180,
          x: HORIZONTAL_SCROLL
        }}
        loading={stateUnitsByProperty.loading}
      />
    </PlainLayout>
  );
};

export default UnitsPage;
