/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CheckCircleOutlined,
  EditOutlined,
  HomeOutlined,
  LeftOutlined,
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Button, DatePicker, Popover, Select, Space, Table, Tag, Typography } from 'antd';
import clsx from 'clsx';
import { ThemeType, daysOfWeek, whenList } from 'configs/const/general';
import { PERPAGE } from 'constant/size';
import { useAsyncAction, useDataDisplayV2, useDidMount } from 'hooks';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getServicesByPropertyServiceV2 } from 'services/ServiceList';
import { AvailabilityType, ServiceDetailAppType } from 'services/ServiceList/type';
import { useAppDispatch, useAppSelector } from 'store';
import { addReservation, updateExtraServices } from 'store/orion/Booking';
import { updateExtraServiceOffer } from 'store/orion/Offer';
import { calculateServicePrice } from 'utils/calculate';
import { currencyFormatter } from 'utils/currency';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import i18n from 'i18n';
import { whenOptions } from 'configs/const/select';
import { modeKeys } from '../modals/ModalAddService';
import dayjs from 'dayjs';
interface Props {
  openTabelService?: boolean;
  setOpenTableService?: React.Dispatch<React.SetStateAction<boolean>>;
  currentCardRes?: number;
  numberOfNight: number;
  isOffer?: boolean;
}

const TableDisplayServicePrice = ({
  openTabelService,
  setOpenTableService,
  currentCardRes,
  numberOfNight,
  isOffer = false
}: Props) => {
  const { t } = useTranslation(['reservation', 'common']);

  //STORE
  const dispatch = useAppDispatch();
  const { extraServices, payloadSearch, reservations, bundleSelected } = useAppSelector(
    (state) => state.orion.booking
  );
  const { extraServiceOffer } = useAppSelector((state) => state.orion.offer);
  const { selected } = useAppSelector((state) => state.app.theme);

  const [tempSelected, setTempSelected] = useState<ServiceDetailAppType[]>(
    isOffer
      ? extraServiceOffer
      : currentCardRes !== undefined && reservations[currentCardRes]
      ? [...reservations[currentCardRes].extraServices]
      : []
  );
  const [locationCurrent, setLocationCurrent] = useState<QueryCaseType>({
    currentPage: 1
  });

  const [getServiceList, stateGetServiceList] = useAsyncAction(getServicesByPropertyServiceV2);

  //  pagination
  const handleChangeLocation = (
    { currentPage = locationCurrent.currentPage, perPage = locationCurrent.perPage }: QueryCaseType,
    signal?: AbortSignal
  ) => {
    const query = queryCase({
      propertyId: payloadSearch?.propertyId ?? '',
      currentPage,
      perPage
    });

    getServiceList(query, signal);

    setLocationCurrent({
      ...locationCurrent,
      currentPage
    });
  };

  const getDate = (value: number) => {
    return dayjs(value * 1000);
  };

  const disabledDate = (current: any, availability: keyof typeof daysOfWeek) => {
    const date = dayjs(current);
    const currentDate = dayjs(getDate(payloadSearch.arrival));
    const targetDate = dayjs(getDate(payloadSearch.departure));
    return (
      date.isBefore(currentDate) ||
      date.isAfter(targetDate) ||
      !Object.values(availability).includes(daysOfWeek[date.day()])
    );
  };

  useDidMount((controller) => {
    handleChangeLocation({}, controller?.signal);
  });
  const services = useDataDisplayV2<ServiceDetailAppType>(stateGetServiceList);
  const [tableData, setTableData] = useState<ServiceDetailAppType[]>(services?.list);
  const currentLanguage = i18n.language;
  const listIncludedService = useMemo(() => {
    const result = new Set(
      bundleSelected?.timeSliceDefinitions?.flatMap((timeSlice) => {
        return timeSlice?.includedServices?.map((i) => i?.name);
      })
    );
    return Array.from(result);
  }, [bundleSelected]);

  useEffect(() => {
    const result = [...services.list]?.map((service) => {
      const count =
        currentCardRes !== undefined && reservations.length > 0
          ? reservations[currentCardRes]?.extraServices.map((i) => {
              return i.key === service.extId ? i.count : 1;
            })[0]
          : (isOffer ? extraServiceOffer : extraServices).map((i) => {
              return i.key === service.key ? i.count : 1;
            })[0];

      return {
        ...service,
        key: service?.extId,
        count: count || 1
      };
    });
    setTableData(result);
  }, [services?.list]);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any) => {
      setTempSelected(selectedRows);
    }
  };

  const handleChangeCount = (key: string, action: 'decrease' | 'increase') => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.key === key && item?.count
          ? { ...item, count: action === 'increase' ? item.count + 1 : item.count - 1 }
          : item
      )
    );
    setTempSelected((prevData) =>
      prevData.map((item) =>
        item.key === key && item?.count
          ? { ...item, count: action === 'increase' ? item.count + 1 : item.count - 1 }
          : item
      )
    );
  };

  const handleChangeMode = (key: string, value: string) => {
    if (key !== '') {
      setTableData((prevData) =>
        prevData.map((item) => (item.key === key ? { ...item, when: value } : item))
      );
      setTempSelected((prevData) =>
        prevData.map((item) => (item.key === key ? { ...item, when: value } : item))
      );
    }
  };

  const handleChangeDate = (key: string, value: string) => {
    if (key !== '') {
      setTableData((prevData) =>
        prevData.map((item) => (item.key === key ? { ...item, serviceDate: value } : item))
      );
      setTempSelected((prevData) =>
        prevData.map((item) => (item.key === key ? { ...item, serviceDate: value } : item))
      );
    }
  };

  const initialService: any = useMemo(() => {
    if (reservations.length > 0 && currentCardRes !== undefined) {
      return reservations[currentCardRes].extraServices?.map((res) => {
        if (res.key) return res.key;
      });
    } else {
      return (isOffer ? extraServiceOffer : extraServices)?.map((res) => {
        if (res.key) return res.key;
      });
    }
  }, [reservations, extraServices]);

  const totalPriceServices = calculateServicePrice(
    openTabelService ? tempSelected ?? extraServices : tempSelected ?? extraServiceOffer,
    numberOfNight
  );

  const listServiceName = (
    openTabelService ? tempSelected ?? extraServices : tempSelected ?? extraServiceOffer
  )?.map((service) => service?.extendedData?.name[currentLanguage]);

  const columns: any = [
    {
      title: t('common:table.quantity'),
      key: 'count',
      dataIndex: 'count',
      width: '10%',
      render: (count: number, record: ServiceDetailAppType) => {
        const isSelected = tempSelected?.findIndex((item) => item?.key === record?.key);
        return (
          <Space>
            <Button
              size="small"
              type="text"
              disabled={isSelected === -1 || count === 1}
              icon={<LeftOutlined />}
              onClick={() => record?.key && handleChangeCount(record?.key, 'decrease')}
            />
            {isSelected !== -1 ? count : 1}
            <Button
              size="small"
              type="text"
              disabled={isSelected === -1}
              icon={<RightOutlined />}
              onClick={() => record?.key && handleChangeCount(record?.key, 'increase')}
            />
          </Space>
        );
      }
    },
    {
      title: t('common:table.name'),
      key: 'name',
      dataIndex: 'name',
      width: '25%',
      render: (name: string, record: ServiceDetailAppType) => {
        const label = record?.extendedData?.name[currentLanguage] ?? record?.name;
        const description =
          record?.extendedData?.description[currentLanguage] ?? record?.description;

        return (
          <Space direction="vertical" size={0}>
            <div className="flex gap-2">
              {listIncludedService?.findIndex((el) => el === name) !== -1 && (
                <Popover content="Service is already included in the bundle." placement="topLeft">
                  <CheckCircleOutlined />
                </Popover>
              )}
              <Typography.Text>{label}</Typography.Text>
            </div>
            <Typography.Text className="text-xs">{description}</Typography.Text>
          </Space>
        );
      }
    },
    {
      title: t('common:table.when'),
      key: 'daysOfWeek',
      dataIndex: ['data', 'availability'],
      render: (availability: AvailabilityType, record: ServiceDetailAppType) => {
        const defaultMode =
          availability.mode.toLowerCase() === modeKeys[0].toLowerCase() ? whenList[0] : whenList[1];
        const getModeservice = record.when ?? defaultMode;
        const isSelected = tempSelected?.findIndex((item) => item?.key === record?.key);
        // const isDisabled = isSelected === -1 || defaultMode === whenList[1];
        return (
          <>
            <Select
              disabled
              defaultValue={getModeservice}
              style={{ width: 120 }}
              bordered={false}
              options={whenOptions}
              onChange={(value) => handleChangeMode(record.key ?? '', value)}
            />
          </>
        );
      }
    },
    {
      title: t('common:table.date'),
      key: 'date',
      dataIndex: ['data', 'availability'],
      render: (availability: AvailabilityType, record: ServiceDetailAppType) => {
        const defaultMode =
          availability.mode.toLowerCase() === modeKeys[0].toLowerCase() ? whenList[0] : whenList[1];
        const getModeservice = record.when ?? defaultMode;

        const avaiabilityDate =
          availability.mode.toLowerCase() === modeKeys[1].toLowerCase()
            ? payloadSearch.arrival
            : payloadSearch.departure;
        const defaultdate = getModeservice === whenList[1] ? avaiabilityDate : null;
        const formatDate = getDate(defaultdate).format('MMM DD,YYYY');
        switch (getModeservice) {
          case whenList[0]:
            return (
              <Typography.Text>
                {getDate(payloadSearch.arrival).format('MMM DD,YYYY') +
                  ' - ' +
                  getDate(payloadSearch.departure).format('MMM DD,YYYY')}
              </Typography.Text>
            );
          case whenList[1]:
            return (
              <>
                {defaultMode === whenList[1] ? (
                  <Typography.Text>{formatDate}</Typography.Text>
                ) : (
                  <DatePicker
                    disabledDate={(current) => disabledDate(current, availability.daysOfWeek)}
                    defaultValue={getDate(defaultdate)}
                  />
                )}
              </>
            );
          case whenList[2]:
            return (
              <DatePicker.RangePicker
                disabledDate={(current) => disabledDate(current, availability.daysOfWeek)}
                defaultValue={[getDate(payloadSearch.arrival), getDate(payloadSearch.departure)]}
              />
            );
        }
      }
    },
    {
      title: t('common:table.delivered_to'),
      key: 'delivered',
      dataIndex: ['data', 'pricingUnit'],
      render: (_: any, record: ServiceDetailAppType) => {
        return (
          <>
            {record?.data?.pricingUnit === 'Person' ? (
              <Space size={0}>
                <UserOutlined /> {` (${payloadSearch?.adults} adult)`}
              </Space>
            ) : (
              <>
                <HomeOutlined /> (unit)
              </>
            )}
            {}
          </>
        );
      }
    },
    {
      title: t('common:table.total_price'),
      key: 'price',
      dataIndex: ['data', 'defaultGrossPrice', 'amount'],
      render: (_: any, record: ServiceDetailAppType) => {
        const isOneDay = record?.mode
          ? record?.mode === 'Arrival' || record?.mode === 'Departure'
          : true;

        const total =
          record?.count && record?.data?.defaultGrossPrice?.amount
            ? (
                record?.count *
                record?.data?.defaultGrossPrice?.amount *
                (isOneDay ? 1 : numberOfNight)
              ).toFixed(2)
            : record?.data?.defaultGrossPrice?.amount.toFixed(2);
        return (
          <Space direction="vertical">
            <Typography.Text>
              {currencyFormatter(record?.data?.defaultGrossPrice?.amount)}{' '}
              {record?.data?.defaultGrossPrice?.currency}
            </Typography.Text>
            <Typography.Text>
              {t('common:form.total') + ": " + currencyFormatter(total)} {record?.data?.defaultGrossPrice?.currency}
            </Typography.Text>
          </Space>
        );
      }
    }
  ];

  return (
    <>
      <Space
        className={clsx(
          ' justify-between p-5 min-[1400px]:w-full w-3/4 max-[1200px]:w-full rounded-lg',
          selected === ThemeType.DEFAULT ? 'bg-white' : 'bg-[#090C08] '
        )}
      >
        <div className="flex flex-col">
          <Typography.Text strong className="text-lg">
            {t('reservation:extra_service')}{' '}
            {(tempSelected.length > 0 || reservations.length > 0) && (
              <span>- {currencyFormatter(totalPriceServices)} EUR</span>
            )}
          </Typography.Text>
          {!isOffer && (
            <Typography.Text>
              {listServiceName.map((name, idx) => {
                if (idx !== listServiceName.length - 1) {
                  return `${name}, `;
                } else {
                  return name;
                }
              })}
            </Typography.Text>
          )}
        </div>
        {!openTabelService && !isOffer && (
          <Button
            icon={
              stateGetServiceList.loading ? (
                <LoadingOutlined />
              ) : extraServices.length > 0 ? (
                <EditOutlined />
              ) : (
                <PlusOutlined />
              )
            }
            className=" text-orange-500"
            type="text"
            onClick={() => {
              setOpenTableService && setOpenTableService(true);
            }}
          >
            {extraServices.length > 0
              ? t('reservation:edit_extra_service')
              : t('reservation:add_service')}
          </Button>
        )}
        {((!stateGetServiceList.loading && openTabelService) || isOffer) && (
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setOpenTableService && setOpenTableService(false);
                if (isOffer) {
                  dispatch(updateExtraServiceOffer(tempSelected));
                } else {
                  dispatch(updateExtraServices(tempSelected));
                  const res = currentCardRes !== undefined && {
                    ...reservations[currentCardRes],
                    extraServices: tempSelected
                  };
                  res && dispatch(addReservation({ res: res, idx: currentCardRes }));
                }
              }}
            >
              {t('common:button.confirm')}
            </Button>
            {!isOffer && (
              <Button
                type="text"
                onClick={() => {
                  setTableData(services.list);
                  setOpenTableService && setOpenTableService(false);
                  setTempSelected([]);
                }}
              >
                {t('common:button.close')}
              </Button>
            )}
          </Space>
        )}
      </Space>
      {((!stateGetServiceList.loading && openTabelService) || isOffer) && (
        <Table
          loading={stateGetServiceList.loading}
          className="min-[1400px]:w-full w-3/4  max-[1200px]:w-full"
          dataSource={tableData}
          columns={columns}
          rowKey="extId"
          rowSelection={{
            ...rowSelection,
            defaultSelectedRowKeys: [...initialService]
          }}
          scroll={{
            y: 400
          }}
          pagination={
            !services.pagination?.total ||
            (services.pagination?.total && services.pagination?.total < PERPAGE)
              ? false
              : {
                  pageSize: locationCurrent?.perPage || PERPAGE,
                  total: services.pagination?.total ? Number(services.pagination.total) : 1,
                  showSizeChanger: false,
                  current: locationCurrent.currentPage,
                  onChange: (page: number) => {
                    handleChangeLocation({
                      ...locationCurrent,
                      currentPage: page
                    });
                  }
                }
          }
        />
      )}
    </>
  );
};

export default TableDisplayServicePrice;
