/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, Modal, Table, Typography } from 'antd';
import { TableRowSelection } from 'antd/es/table/interface';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useAsyncAction, useDataDisplay, useDidMount } from 'hooks';
import useView from 'hooks/useView';
import { useEffect, useMemo, useState } from 'react';
import { getRatesService, getRatePlanListService } from 'services/RatePlan';
import { AllRateOfRatePlanAppType, RatePlanDetailAppType } from 'services/RatePlan/type';
import { convertTimeToSecTimestamp } from 'utils/dayjs';
import mergeNestedObj from 'utils/mergeNestedObj';
import { displayRole } from 'utils/view';
import { TableRateProps } from '../../../index.types';
import DatePickerComponent from 'components/common/DatePickerComponent';
import { DATE_FORMAT_4 } from 'configs/const/format';

const dateUpdateFormat = 'D MMM';
const numColumns = 10;

const TableRate = ({ startDate, setStartDate }: TableRateProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>({});
  const [rowSelection, setRowSelection] = useState<TableRowSelection<any> | undefined>({});
  const [currentPrice, setCurrentPrice] = useState<string | number | undefined>('');
  const view = displayRole(useView().currentView);

  /////// Services area ///////
  const [getRatePlanList, ratePlanListState] = useAsyncAction(getRatePlanListService);
  const [getAllRate, allRateState] = useAsyncAction(getRatesService);

  /////// Rate plan list ///////
  useDidMount(() => {
    if (view.code) {
      getRatePlanList(view.code);
    }
  });

  const ratePlanList = useDataDisplay<RatePlanDetailAppType>(ratePlanListState);

  //TODO
  const filterTimeSlice = ratePlanList?.filter((ratePlan: RatePlanDetailAppType) => {
    return ratePlan?.data?.timeSliceDefinition?.template === 'OverNight';
  });
  const nestedObj = useMemo(() => {
    return mergeNestedObj(filterTimeSlice);
  }, [ratePlanList]);

  useEffect(() => {
    const controller = new AbortController();
    if (view.code) {
      getAllRate(
        view.code,
        convertTimeToSecTimestamp(startDate ? startDate?.startOf('D') : startDate),
        convertTimeToSecTimestamp(startDate, numColumns)
      );
    }
    return () => {
      controller.abort();
    };
  }, [startDate]);

  const rateList = useDataDisplay<AllRateOfRatePlanAppType>(allRateState);

  /////// Function take right rates ///////
  const takeRateFc = (id: string, date: string) => {
    let price;
    if (rateList) {
      const ratePlan = rateList?.filter((item: any) => {
        return item?.ratePlanId === id;
      });

      const index = ratePlan[0]?.rates?.findIndex((rate) => {
        const formatDateEl = dayjs(rate?.data?.from).format(DATE_FORMAT_4);
        return formatDateEl === date;
      });
      price = ratePlan[0]?.rates[index]?.data?.price?.amount
        ? ratePlan[0]?.rates[index]?.data?.price?.amount
        : 'Not set';
      // TODO check warning
      // setCurrentPrice(price);
    } else {
      price = 'Not set';
      // TODO check warning
      // setCurrentPrice(price);
    }

    return price;
  };

  /////// Columns ///////
  const columns = [
    {
      title: (
        <div className="flex gap-3">
          {/* TODO */}
          {/* <Tooltip title="Select">
            <div
              onClick={() => {
                setRowSelection((prev) => (typeof prev === 'object' ? undefined : {}));
              }}
            >
              <XIcon name="dottedSquare" />
            </div>
          </Tooltip> */}
          <Typography.Text>Rates / EUR</Typography.Text>
        </div>
      ),
      dataIndex: 'name',
      render: (_: any, record: any) => (
        <div className="flex justify-between">
          <div className="flex flex-col">
            <Typography.Text style={{ color: 'rgb(52,98,189)' }}>{record.name}</Typography.Text>
            <Typography.Text>
              {record?.data?.code} / {record?.data?.unitGroup?.name}
            </Typography.Text>
          </div>
          {/* TODO */}
          {/* <Dropdown menu={{ items: MenuEditPriceItem() }} placement="topLeft" trigger={['click']}>
            <EllipsisOutlined className="rotate-90 cursor-pointer" />
          </Dropdown> */}
        </div>
      )
    },

    ...[...Array(numColumns)].map((_, index) => {
      const currentDate = startDate?.add(index, 'day');
      const formatedDate = currentDate?.format(DATE_FORMAT_4);
      const formatedDay = currentDate?.format('ddd');

      return {
        title: (
          <div className="flex flex-col items-center justify-center ">
            <Typography.Text
              type={formatedDay === 'Sat' || formatedDay === 'Sun' ? 'warning' : 'secondary'}
            >
              {formatedDay}
            </Typography.Text>
            <Typography.Text>{formatedDate}</Typography.Text>
          </div>
        ),
        dataIndex: `data${index + 1}`,
        key: `data${index + 1}`,
        width: '8%',
        render: (_: any, record: any) => (
          <>
            {index !== numColumns - 1 && (
              <div className="mx-1">
                <div
                  className={clsx(
                    'group m-auto relative z-[999] flex h-[50px] w-full translate-x-1/2 items-center justify-center rounded text-center',
                    currentPrice !== 'Not set'
                      ? 'bg-[#fcfdff] hover:bg-[#90caf9] '
                      : 'bg-[#eee] hover:bg-[#e0e0e0]',
                    !record?.data?.isDerived ? 'cursor-pointer' : ''
                  )}
                  style={{
                    border: currentPrice !== 'Not set' ? '1px solid #90caf9' : '1px solid #bdbdbd'
                  }}
                // TODO
                // onClick={() => {
                //   !record?.data?.isDerived && setIsModalOpen(true);
                //   setCurrentRecord({
                //     ...record,
                //     price: takeRateFc(record?.data?.id, formatedDate),
                //     from: currentDate?.format(dateUpdateFormat),
                //     to: currentDate?.add(1, 'day').format(dateUpdateFormat)
                //   });
                // }}
                >
                  <Typography.Text
                    className={clsx(
                      'text-[#bdbdbd]',
                      currentPrice !== 'Not set'
                        ? 'group-hover:text-[#363942]'
                        : ' group-hover:text-[#9e9e9e]'
                    )}
                  >
                    {takeRateFc(record?.data?.id, formatedDate)}
                  </Typography.Text>
                </div>
              </div>
            )}
          </>
        )
      };
    })
  ];

  const initialFormPrice = {
    price: currentRecord?.price
  };

  return (
    <>
      <DatePickerComponent
        dateFormat={DATE_FORMAT_4}
        startDate={startDate}
        setStartDate={setStartDate}
        className=" pb-6"
      />
      <Table
        // TODO
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={startDate ? nestedObj : []}
        pagination={false}
        className="table-rate"
      />

      {/* Modal update price */}
      <Modal
        onCancel={() => setIsModalOpen(false)}
        title={
          <div className="flex flex-col ">
            <Typography.Text>{`${currentRecord.from}-${currentRecord.to}`}</Typography.Text>
            <Typography.Text>{currentRecord.name}</Typography.Text>
          </div>
        }
        open={isModalOpen}
        footer={
          <>
            <Button type="primary" onClick={() => setIsModalOpen(false)}>
              Update
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </>
        }
      >
        <Form initialValues={initialFormPrice} layout="vertical">
          <Form.Item label="Single occupancy price" name="price">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default TableRate;
