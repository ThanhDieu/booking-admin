/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { ViewMode } from 'configs/const/auth';
import { policyType } from 'configs/const/general';
import { paths } from 'constant';
import { PERPAGE } from 'constant/size';
import { useAsyncAction, useDataDisplayV2, useDidMount } from 'hooks';
import useView from 'hooks/useView';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCancellationListService, getNoShowListService } from 'services/Policies';
import { CancellationPolicyAppType, NoShowPolicyAppType } from 'services/Policies/type';
import { QueryCaseType, queryCase } from 'utils/queryParams';

export interface PolicyListProps {
  onDelete?: (id: string) => void;
  type: string;
}

function PolicyList({ onDelete, type }: PolicyListProps) {
  const { t } = useTranslation(['common', 'policies'])
  const { currentViewObj } = useView();
  const navigate = useNavigate();
  const [currentLocation, serCurrentLocation] = useState<QueryCaseType>({ currentPage: 1 });
  const location = useLocation();

  //SERVICE
  const [getCancellationList, cancellationListState] = useAsyncAction(getCancellationListService);
  const [getNoShowList, noShowListState] = useAsyncAction(getNoShowListService);

  const cancellationList = useDataDisplayV2<CancellationPolicyAppType>(cancellationListState);
  const noShowList = useDataDisplayV2<NoShowPolicyAppType>(noShowListState);

  //  pagination
  const handleChangeLocation = (
    { currentPage = currentLocation.currentPage, perPage = currentLocation.perPage }: QueryCaseType,
    signal?: AbortSignal
  ) => {
    const query = queryCase({
      propertyId: currentViewObj?.code,
      currentPage,
      perPage
    });
    if (type === policyType.CANCELLATION && currentViewObj.code)
      getCancellationList(currentViewObj.code, signal);
    if (type === policyType.NO_SHOW && currentViewObj.code)
      getNoShowList(currentViewObj.code, signal);

    navigate(`/${currentViewObj?.code}/${paths.policies}/${type}?${query}`);
    serCurrentLocation({
      ...currentLocation,
      currentPage
    });
  };

  useDidMount(() => {
    handleChangeLocation({});
  });

  const columns: ColumnsType<CancellationPolicyAppType | NoShowPolicyAppType> = [
    {
      title: t('common:table.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: t('common:table.code'),
      dataIndex: ['data', 'code'],
      key: 'code'
    },
    {
      title: t('common:table.description'),
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: t('common:table.action'),
      key: 'action',
      align: 'right',
      width: 200,
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`${record?.extId}`)}
          />
          {/* <Popconfirm placement="bottomLeft" title="Sure to delete?" okText="Yes" cancelText="No">
            <Button  type="text" danger icon={<DeleteOutlined />}></Button>
          </Popconfirm> */}
        </>
      )
    }
  ];

  const pagination =
    !cancellationList.pagination?.total ||
      cancellationList.pagination?.total < PERPAGE ||
      !noShowList.pagination?.total ||
      noShowList.pagination?.total < PERPAGE
      ? false
      : {
        pageSize: currentLocation?.perPage || PERPAGE,
        total:
          cancellationList.pagination?.total || noShowList.pagination?.total
            ? Number(cancellationList.pagination.total || noShowList.pagination?.total)
            : 1,
        showSizeChanger: false
      };

  return (
    <Table
      rowKey="extId"
      columns={columns}
      dataSource={type === policyType.CANCELLATION ? cancellationList.list : noShowList.list}
      pagination={pagination}
    />
  );
}

export default PolicyList;
