/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { EllipsisOutlined, KeyOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Table, Tag, Typography } from 'antd';
import { ColumnsType, TableProps } from 'antd/es/table';
import renderMenuLabel from 'components/shared/i18nextRender';
import { ViewMode } from 'configs/const/auth';
import { TIME_FORMAT_1, TIME_FORMAT_3 } from 'configs/const/format';
import { sorterType, statusReservationType } from 'configs/const/general';
import { paths } from 'constant';
import { PERPAGE } from 'constant/size';
import dayjs from 'dayjs';
import { useAppSize } from 'hooks';
import useView from 'hooks/useView';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ReservationDetailAppType } from 'services/Reservation/type';
import { useAppDispatch, useAppSelector } from 'store';
import { updateView } from 'store/booking/Auth';
import { formatPriceByLocales } from 'utils/format';
import { QueryCaseType } from 'utils/queryParams';
import { addSpaceInString } from 'utils/text';
import { ModalList, actionListFunction } from '.';
import MenuActionItem from './MenuAction';
interface Props {
  locationCurrent: QueryCaseType;
  handleChangeLocation: ({
    propertyId,
    currentPage,
    perPage,
    sorts,
    status
  }: QueryCaseType) => void;
  reservationList: {
    list: never[] | ReservationDetailAppType[];
    pagination: PaginationType | undefined;
  };
  loading?: boolean;
}

const TableReservation = ({
  locationCurrent,
  handleChangeLocation,
  reservationList,
  loading
}: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { innerAppHeight } = useAppSize();
  const { currentView, currentViewObj } = useView();
  const [openModal, setOpenModal] = useState<string>('');
  const [reservationItem, setReservationItem] = useState<ReservationDetailAppType>();
  const { t, i18n } = useTranslation(['common']);
  const { properties } = useAppSelector((state) => state.booking.property);

  // FUNCTIONS
  const handleChangeTable: TableProps<ReservationDetailAppType>['onChange'] = (
    pagination,
    filters,
    sorter: any
  ) => {
    const filterStatus = filters.status?.length ? String(filters.status[0]) : '';
    const filterProperty = filters?.unit?.length ? String(filters?.unit[0]) : '';

    const sortOrder = sorter?.order
      ? sorter?.order === sorterType.ASC
        ? sorter.columnKey
        : `-${sorter?.columnKey}`
      : '';

    handleChangeLocation &&
      handleChangeLocation({
        ...locationCurrent,
        currentPage: pagination.current,
        sorts: sortOrder,
        status: filterStatus,
        propertyId: filterProperty
      });
  };

  const handleNavigate = (record: ReservationDetailAppType) => {
    dispatch(updateView(`${record?.data?.property?.code}@${record?.data?.property?.name}`));
    navigate(`/${record?.data?.property?.code}/${paths.reservations}/${record.extId}`);
  };

  const propertiesFilterlist = useMemo(() => {
    return properties?.data
      ?.map((hotel) => ({
        text: hotel?.name ?? '',
        value: hotel?.extId ?? ''
      }))
      .filter((item) => {
        return currentView !== ViewMode.Account ? item.value === currentViewObj?.code : item;
      });
  }, [properties, currentView]);

  // UI
  const columns: ColumnsType<ReservationDetailAppType> = [
    {
      title: t('common:table.status'),
      dataIndex: ['data', 'status'],
      key: 'status',
      filters: Object.values(statusReservationType).map((item) => ({
        text: item ? addSpaceInString(item) : '',
        value: item
      })),
      filterMultiple: false,
      width: '10%',
      render: (value: string) => {
        return (
          <>
            {value === statusReservationType.Canceled ? (
              <Tag color="red">{addSpaceInString(value)}</Tag>
            ) : value === statusReservationType.NoShow ? (
              <Tag color="orange">{addSpaceInString(value)}</Tag>
            ) : value === statusReservationType.CheckedOut ? (
              <Tag color="purple">{addSpaceInString(value)}</Tag>
            ) : (
              <Tag color="green">{addSpaceInString(value)}</Tag>
            )}
          </>
        );
      }
    },
    {
      title: renderMenuLabel('table.reservation_id', 'common'),
      dataIndex: 'extId',
      key: 'extId',
      width: '10%',
      render: (value: string, record: ReservationDetailAppType) => {
        return (
          <Space direction="vertical" size={0} onClick={() => handleNavigate(record)}>
            <Typography.Text className="cursor-pointer hover:text-teal-600">
              {value}
            </Typography.Text>
            {currentView === ViewMode.Account && (
              <Typography.Text className="cursor-pointer" disabled>
                {record?.data?.property?.id}
              </Typography.Text>
            )}
          </Space>
        );
      }
    },
    {
      title: renderMenuLabel('table.name', 'common'),
      dataIndex: ['data', 'primaryGuest', 'firstName'],
      key: 'name',
      render: (value: string, record: ReservationDetailAppType) => {
        return (
          <Space direction="vertical" size={0}>
            <Typography.Text>
              {`${value || ''} ${record?.data?.primaryGuest?.middleInitial || ''} ${record?.data?.primaryGuest?.lastName || ''
                }` || ''}
            </Typography.Text>
            <Typography.Text>{`${record?.data?.adults && record?.data?.adults > 1
                ? `${record?.data?.adults} adults`
                : `${record?.data?.adults} adult`
              }`}</Typography.Text>
          </Space>
        );
      }
    },
    {
      title: renderMenuLabel('table.arrival', 'common'),
      key: 'arrivalTimestamp',
      dataIndex: ['data', 'arrival'],
      sorter: true,
      render: (value: string) => {
        return (
          <Space direction="vertical" size={0}>
            <Typography.Text>{value ? value?.substring(0, 10) : ''}</Typography.Text>
            <Typography.Text>
              {value ? dayjs(value?.substring(0, 19)).format(TIME_FORMAT_1) : ''}
            </Typography.Text>
          </Space>
        );
      }
    },
    {
      title: renderMenuLabel('table.departure', 'common'),
      key: 'departureTimestamp',
      dataIndex: ['data', 'departure'],
      sorter: true,
      render: (value: string) => {
        return (
          <Space direction="vertical" size={0}>
            <Typography.Text>{value ? value?.substring(0, 10) : ''}</Typography.Text>
            <Typography.Text>
              {value ? dayjs(value?.substring(0, 19)).format(TIME_FORMAT_1) : ''}
            </Typography.Text>
          </Space>
        );
      }
    },
    {
      title: renderMenuLabel('table.hotel', 'common'),
      dataIndex: ['property', 'extendedData'],
      key: 'unit',
      filters: propertiesFilterlist ?? [],
      filterMultiple: false,
      render: (value) => (
        <Space size={5}>
          <Typography.Text>{value.name[i18n?.language]}</Typography.Text>
        </Space>
      )
    },
    {
      title: renderMenuLabel('table.unit', 'common'),
      dataIndex: ['data', 'unit', 'name'],
      key: 'unit',
      align: 'center',
      render: (value: string, record: ReservationDetailAppType) =>
        value && (
          <Space size={5}>
            <KeyOutlined />
            <Typography.Text>{value}</Typography.Text>
          </Space>
        )
    },

    {
      title: renderMenuLabel('table.balance', 'common'),
      dataIndex: ['data', 'balance', 'amount'],
      key: 'amount',
      align: 'right',
      width: '10%',

      render: (value: number, record: ReservationDetailAppType) => {
        const balance = formatPriceByLocales(value, record?.data?.totalGrossAmount?.currency);
        return (
          <div className="">
            {value !== 0 ? (
              <Typography.Text type="danger">
                {balance} {record?.data?.totalGrossAmount?.currency}
              </Typography.Text>
            ) : (
              <Typography.Text>
                {balance} {record?.data?.totalGrossAmount?.currency}
              </Typography.Text>
            )}
          </div>
        );
      }
    },
    {
      title: '',
      align: 'right',
      key: 'action',
      width: '10%',
      render: (_: any, record: ReservationDetailAppType) => {
        const actions = actionListFunction(record);
        return (
          <Space
            onClick={(e) => {
              setReservationItem(record);
            }}
          >
            {currentView !== ViewMode.Account && (
              <Dropdown
                menu={{
                  items: MenuActionItem({
                    shows: actions || []
                  }),
                  onClick: ({ key }) => {
                    setOpenModal(key);
                  }
                }}
                trigger={['click']}
                disabled={!actions || (actions && actions.length === 0)}
              >
                <Button
                  type="text"
                  icon={<EllipsisOutlined className="rotate-90 cursor-pointer" />}
                />
              </Dropdown>
            )}

            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={() => {
                handleNavigate(record);
              }}
            />
          </Space>
        );
      }
    }
  ];

  const expandedRowRender = (record: ReservationDetailAppType) => {
    const linkBundleDetail = record?.bundle
      ? `/${record?.property?.extId}/${paths.bundles}/${record?.bundle?.isTemplate ? paths.bundlesTemplate : paths.bundlesOverview
      }/${record?.bundle?.id}`
      : '';

    return (
      <Space className="ml-12 gap-24 justify-center items-start">
        <Space direction="vertical">
          <Typography.Text
            className="cursor-pointer hover:text-teal-600"
            onClick={() => navigate(linkBundleDetail)}
          >
            <span className="font-bold cursor-auto hover:text-[#090C08]">
              {t('common:table.bundle')}:
            </span>{' '}
            {record.bundle?.name}
          </Typography.Text>
          <Typography.Text>
            <span className="font-bold">{t('common:table.unit_group')}:</span>{' '}
            {record?.unitGroup?.name}
          </Typography.Text>
          <Typography.Text>
            <span className="font-bold">{t('common:table.created')}:</span>{' '}
            {record.data?.created?.substring(0, 10) ?? ''}{' '}
            {dayjs(record.data?.created?.substring(0, 19)).format(TIME_FORMAT_3)}
          </Typography.Text>
        </Space>
        <Space direction="vertical">
          <Typography.Text>
            {' '}
            <span className="font-bold">{t('common:table.channel')}:</span>{' '}
            {record?.data?.channelCode}
          </Typography.Text>
          <Typography.Text>
            <span className="font-bold"> {t('common:table.guarantee')}:</span>{' '}
            {record?.data?.guaranteeType}
          </Typography.Text>
          <Typography.Text>
            <span className="font-bold">{t('common:table.comment')}:</span> {record?.data?.comment}
          </Typography.Text>
        </Space>
      </Space>
    );
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={reservationList?.list}
        onChange={handleChangeTable}
        rowKey="extId"
        showSorterTooltip={false}
        pagination={
          !reservationList?.pagination?.total ||
            (reservationList?.pagination?.total && reservationList?.pagination?.total < PERPAGE)
            ? false
            : {
              pageSize: PERPAGE,
              total: reservationList?.pagination?.total
                ? Number(reservationList?.pagination.total)
                : 1,
              showSizeChanger: false,
              onChange: (value) => {
                handleChangeLocation &&
                  handleChangeLocation({ ...locationCurrent, currentPage: value });
              }
            }
        }
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record)
        }}
        className="pt-5"
        loading={loading}
        scroll={{
          y: innerAppHeight - 200
        }}
      />
      {/* // MODALS */}
      <ModalList
        openModal={openModal}
        onChangeModal={setOpenModal}
        reservationItem={reservationItem}
        onChangeLocation={handleChangeLocation}
      />
    </>
  );
};

export default TableReservation;
