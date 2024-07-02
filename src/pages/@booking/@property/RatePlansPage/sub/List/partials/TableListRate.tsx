/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EllipsisOutlined, LeftOutlined, PlusOutlined } from '@ant-design/icons';
import { Dropdown, MenuProps, Table, Tag, Tooltip, Typography } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import XIcon from 'components/shared/Icon';
import { FuncType, editModalType } from 'configs/const/general';
import { paths } from 'constant';
import { useAsyncAction, useDataDisplay, useDidMount } from 'hooks';
import useView from 'hooks/useView';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRatePlanListService } from 'services/RatePlan';
import { RatePlanDetailAppType } from 'services/RatePlan/type';
import mergeNestedObj from 'utils/mergeNestedObj';
import { displayRole } from 'utils/view';
import RatePlansPageProps from '../../../index.types';
import MenuEditItem from './MenuEditItem';
import ModalEditRatePlan from './ModalEditRatePlan';
export type MenuItem = Required<MenuProps>['items'][number];

const TableListRate = () => {
  const [openModal, setOpenModal] = useState<{ modalType: string; modalTitle: string }>({
    modalType: '',
    modalTitle: ''
  });

  const [rowSelection, setRowSelection] = useState<TableRowSelection<any> | undefined>(undefined);

  const navigate = useNavigate();
  const view = displayRole(useView().currentView);

  /////// Services area ///////
  const [getRatePlanList, ratePlanListState] = useAsyncAction(getRatePlanListService);

  /////// Rate plan list ///////

  useDidMount((controller) => {
    if (view.code) getRatePlanList(view.code);
  });

  const ratePlanList = useDataDisplay<RatePlanDetailAppType>(ratePlanListState);

  const filterTimeSlice = ratePlanList?.filter((ratePlan: RatePlanDetailAppType) => {
    return ratePlan?.data?.timeSliceDefinition?.template === 'OverNight';
  });
  const nestedObj = useMemo(() => {
    return mergeNestedObj(filterTimeSlice);
  }, [ratePlanList]);

  /////// Columns ///////
  const columns = [
    {
      title: (
        <div className="flex gap-3">
          {/* TODO */}
          {/* <Tooltip title={rowSelection ? 'Close Select' : 'Select'}>
            <div
              onClick={() => {
                setRowSelection((prev) => (typeof prev === 'object' ? undefined : {}));
              }}
            >
              {rowSelection ? <LeftOutlined /> : <XIcon name="dottedSquare" />}
            </div>
          </Tooltip> */}
          <Typography.Text>Rates / EUR</Typography.Text>
        </div>
      ),

      dataIndex: 'name',
      render: (_: any, record: any) => (
        <div className="flex justify-between">
          <div className="flex flex-col">
            <Typography.Text
              className="cursor-pointer"
              style={{ color: 'rgb(52,98,189)' }}
              // TODO
              // onClick={() =>
              //   navigate(`/${view.code}/${paths.rates}/${paths.ratePlans}/${record?.data?.id}`)
              // }
            >
              {record.name}
            </Typography.Text>
            <Typography.Text>
              {record?.data.code} / {record?.data?.unitGroup?.name}
            </Typography.Text>
          </div>
        </div>
      )
    },
    // TODO
    // {
    //   title: 'Edit',
    //   dataIndex: '',
    //   render: (_: any, record: any) => (
    //     <Dropdown
    //       menu={{
    //         items: MenuEditItem({ setOpenModal }),
    //         onClick: ({ item, key }) => {
    //           if (key.toLowerCase() === FuncType.DELETE) {
    //             setOpenModal({ modalTitle: 'Confirm deletion', modalType: FuncType.DELETE });
    //           } else if (key.toLowerCase() === FuncType.DUPLICATE) {
    //             //  TODO
    //             //  navigate
    //           }
    //         }
    //       }}
    //       trigger={['click']}
    //     >
    //       <EllipsisOutlined className="rotate-90 cursor-pointer" />
    //     </Dropdown>
    //   )
    // },
    {
      title: (
        <Typography.Text className="text-xs" type="secondary">
          Unit group
        </Typography.Text>
      ),
      dataIndex: '',
      render: (_: any, record: any) => (
        <div className="flex flex-col">
          <Typography.Text>{record?.data.unitGroup?.name}</Typography.Text>
          <div>
            {record?.data.includedServices &&
              record?.data.includedServices.map((el: any, idx: number) => (
                <React.Fragment key={idx}>
                  <Typography.Text className="text-xs relative">
                    {el.service.name}
                    {el?.pricingMode === 'Additional' && (
                      <Tooltip
                        title="Additional service"
                        arrow={false}
                        placement="right"
                        overlayStyle={{ marginTop: 10 }}
                        overlayInnerStyle={{ fontSize: 12 }}
                      >
                        <PlusOutlined className="absolute top-0 m-[-2px]  text-[7px] text-[#f19722] h-2" />
                      </Tooltip>
                    )}
                  </Typography.Text>
                  <span>{record?.data.includedServices[idx + 1] ? ', ' : ''}</span>
                </React.Fragment>
              ))}
          </div>
        </div>
      )
    },
    {
      title: (
        <Typography.Text className="text-xs" type="secondary">
          Minimum guarantee
        </Typography.Text>
      ),
      dataIndex: 'minGuaranteeType',
      render: (text: any, record: RatePlanDetailAppType) => (
        <div className="flex flex-col">
          <Typography.Text>{record?.data?.minGuaranteeType}</Typography.Text>
        </div>
      )
    },
    {
      title: (
        <Typography.Text className="text-xs" type="secondary">
          Cancellation policy
        </Typography.Text>
      ),
      dataIndex: '',
      render: (_: any, record: any) => (
        <Typography.Text>{record?.data?.cancellationPolicy?.id}</Typography.Text>
      )
    },
    {
      title: (
        <Typography.Text className="text-xs" type="secondary">
          Distribution
        </Typography.Text>
      ),
      dataIndex: 'channelCodes',
      render: (text: any, record: RatePlanDetailAppType) => {
        return record?.data?.channelCodes.map((channel: string) => (
          <Tag key={channel} className="m-1">
            {channel}{' '}
          </Tag>
        ));
      }
    }
  ];

  return (
    <>
      <Table
        dataSource={nestedObj}
        columns={columns}
        pagination={false}
        rowKey="key"
        rowSelection={rowSelection}
      />

      {/* Modal edit */}
      {(openModal.modalType === editModalType.RESTRICTION ||
        openModal.modalType === editModalType.ACCOUNTING ||
        openModal.modalType === editModalType.CANCELLATION ||
        openModal.modalType === editModalType.CHANNEL ||
        openModal.modalType === editModalType.GUARANTEE ||
        openModal.modalType === editModalType.PERIODS ||
        openModal.modalType === FuncType.DELETE) && (
        <ModalEditRatePlan
          openModal={openModal.modalType}
          title={openModal.modalTitle}
          onChangeOpenModal={() => setOpenModal({ modalType: '', modalTitle: '' })}
        />
      )}
    </>
  );
};

export default TableListRate;
