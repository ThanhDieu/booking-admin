/* eslint-disable @typescript-eslint/no-explicit-any */
import { Modal, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { filterBundle } from 'configs/const/general';
import { useAsyncAction, useDataDisplayV2, useDidMount } from 'hooks';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getBundlesService } from 'services/Bundle';
import { BundleListType } from 'services/Bundle/type';
import { QueryCaseType, queryCase } from 'utils/queryParams';

const { Text } = Typography

interface ModalBundleListProps {
  loading: boolean;
  open: boolean;
  onSelect: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  onCancel: () => void;
  onSubmit: () => void;
}

const PERPAGE = 8;
const ModalBundleList = ({
  loading,
  open,
  onSelect: handleSelect,
  onCancel: handleCancel,
  onSubmit: handleModalSubmit
}: ModalBundleListProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common'])
  const [currentLocation, setCurrentLocation] = useState<QueryCaseType>({
    perPage: PERPAGE,
    currentPage: 1,
    isHolidayPackage: false,
    online: true,
    status: filterBundle.APPROVED
  });

  const [fetchData, stateBundles] = useAsyncAction(getBundlesService);
  const data = useDataDisplayV2<BundleListType>(stateBundles);

  // Call
  const handleChangeLocation = (
    {
      currentPage = currentLocation.currentPage,
      perPage = currentLocation.perPage,
      isHolidayPackage = currentLocation.isHolidayPackage,
      online = currentLocation.online,
      isTemplate = currentLocation.isTemplate,
      status = currentLocation.status
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const query = queryCase({
      currentPage,
      perPage,
      isHolidayPackage,
      online,
      isTemplate,
      status
    });

    fetchData(query, controller?.signal);

    navigate(`?${query}`);
    setCurrentLocation({
      ...currentLocation,
      currentPage,
      isHolidayPackage,
      online,
      isTemplate,
      status
    });
  };

  useDidMount((controller) => {
    handleChangeLocation(
      {
        ...currentLocation,
        currentPage: 1
      },
      controller
    );
  }, []);

  const columns: ColumnsType<BundleListType> = [
    {
      title: t('common:table.property'),
      dataIndex: 'property',
      render: (_, record) => {
        return <Text key={_}>{record?.property.name}</Text>
      },
      width: '30%'
    }
    ,
    {
      title: t('common:table.title'),
      dataIndex: 'title'
    }
  ];

  return (
    <Modal
      title={`${t('common:table.property')}${t('common:modal.list')}`}
      open={open}
      onCancel={handleCancel}
      onOk={handleModalSubmit}
      width={992}
      okButtonProps={{ loading: loading }}
    >
      <Table
        loading={stateBundles.loading}
        rowSelection={{
          type: 'checkbox',
          onChange: (_, selectedRows: BundleListType[]) => {
            handleSelect(selectedRows?.map((item) => item.bundleId) || []);
          }
        }}
        pagination={
          !data?.pagination?.total || (data?.pagination?.total && data?.pagination?.total < PERPAGE)
            ? false
            : {
              pageSize: currentLocation?.perPage || PERPAGE,
              total: data?.pagination?.total ? Number(data?.pagination.total) : 1,
              showSizeChanger: false,
              disabled: stateBundles.loading,
              current: currentLocation.currentPage,
              onChange: (page: number) => {
                handleChangeLocation({
                  ...currentLocation,
                  currentPage: page
                });
              }
            }
        }
        columns={columns}
        dataSource={data.list}
        rowKey={'bundleId'}
      />
    </Modal>
  );
};

export default ModalBundleList;
