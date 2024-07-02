/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeleteOutlined } from '@ant-design/icons';
import { BaseAmount, ExtendedDataType, ServiceDate, ServiceResType } from '@types';
import { App, Button, Popconfirm, Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useAsyncAction } from 'hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { removeServiceReservationService } from 'services/Reservation';
import { ReservationDetailAppType } from 'services/Reservation/type';
import { formatPriceByLocales, formatStringByLocale } from 'utils/format';

interface Props {
  services?: ServiceResType[];
  getReservationDetail?: () => void;
  reservationDetail?: ReservationDetailAppType;
  content?: {
    title?: string;
    description?: string;
    subDescription?: string;
    hideAction?: boolean;
    hideExpands?: boolean;
    isBundle?: boolean;
  };
}
const ExtraService = ({ services, getReservationDetail, reservationDetail, content }: Props) => {
  const { message } = App.useApp();
  const { t, i18n } = useTranslation(['common', 'reservation']);

  // SERVICES

  const [removeServiceReservation] = useAsyncAction(removeServiceReservationService, {
    onSuccess: () => {
      message.success('Remove success!', 2);
      getReservationDetail && getReservationDetail();
    },
    onFailed: (error: any) => {
      message.error(error?.message || 'Failed!', 2);
    }
  });

  const customServiceList: ServiceResType[] | undefined = useMemo(() => {
    const newServices = (services || reservationDetail?.data?.services || [])?.map((i, idx) => {
      return {
        ...i,
        code: i.service?.code,
        key: idx //func create unique rowkey,
      };
    });
    return newServices;
  }, [services, reservationDetail?.data?.services]);

  const columns: any = [
    {
      title: t('common:table.name'),
      key: 'name',
      dataIndex: ['service', 'extendedData', 'name'],
      render: (name: ExtendedDataType, record: ServiceResType) => {
        return (
          <Typography.Text>
            {formatStringByLocale(record?.service?.name, name, i18n?.language)}
          </Typography.Text>
        );
      },
      width: '25%'
    },
    content?.isBundle && {
      title: t('reservation:bundle_name'),
      key: 'bundle',
      dataIndex: ['service', 'extendedData', 'bundle'],
      render: (name: ExtendedDataType) => {
        return (
          <Typography.Text>
            {formatStringByLocale('', name, i18n?.language)}
          </Typography.Text>
        );
      },
      width: '15%'
    },
    {
      title: t('common:table.description'),
      key: 'description',
      dataIndex: ['service', 'extendedData', 'description'],
      render: (description: ExtendedDataType, record: ServiceResType) => {
        return (
          <Typography.Text>
            {formatStringByLocale(record?.service?.description, description, i18n?.language)}
          </Typography.Text>
        );
      },
      width: '25%'
    },
    content?.hideExpands && {
      title: t('common:table.availability'),
      key: 'description',
      dataIndex: ['service', 'mode'],
      width: '10%'
    },
    {
      title: t('common:table.quantity'),
      key: 'dates',
      dataIndex: 'dates',
      render: (dates: ServiceDate[]) => {
        return (
          <Typography.Text>
            {dates?.reduce((sum, item) => sum + item.count, 0) || 0}
          </Typography.Text>
        );
      },
      width: '10%'
    },
    {
      title: t('common:table.total_amount'),
      key: 'grossAmount',
      dataIndex: ['totalAmount', 'grossAmount'],
      render: (grossAmount: number, record: ServiceResType) => {
        return (
          <Typography.Text>
            {formatPriceByLocales(grossAmount, record?.totalAmount?.currency)}{' '}
            {record?.totalAmount?.currency || ''}
          </Typography.Text>
        );
      },
      width: '15%'
    },
    !content?.hideAction && {
      title: t('common:table.action'),
      dataIndex: '',
      key: 'action',
      align: 'right',
      render: (_: any, record: ServiceResType) => (
        <>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() =>
              reservationDetail?.extId &&
              record.service.id &&
              removeServiceReservation(reservationDetail.extId, record.service.id)
            }
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      )
    }
  ].filter((column) => column);

  const columnsRowRender: ColumnsType<ServiceDate> = [
    {
      title: t('common:table.date'),
      key: 'serviceDate',
      dataIndex: 'serviceDate',
      render: (serviceDate: string) => <Typography.Text>{serviceDate}</Typography.Text>
    },
    {
      title: t('common:table.availability'),
      key: 'availability',
      dataIndex: '',
      render: () => <Typography.Text>Unlimited</Typography.Text>
    },
    {
      title: t('common:table.quantity'),
      key: 'count',
      dataIndex: 'count',
      render: (count: number) => <Typography.Text>{count}</Typography.Text>
    },
    {
      title: t('common:table.amount'),
      key: 'amount',
      dataIndex: ['amount'],
      render: (amount: BaseAmount) => {
        return (
          <Space className="justify-between">
            <Typography.Text>
              {formatPriceByLocales(amount.grossAmount, amount?.currency)} {amount?.currency || ''}
            </Typography.Text>
          </Space>
        );
      }
    }
  ];

  const rowRender = (dates: ServiceDate[]) => {
    return (
      <Space direction="vertical" style={{ width: '100%' }} size="small" className="pb-3">
        <Space direction="vertical" size="small">
          <Typography.Title level={4} className="ml-12">
            {t('reservation:service_dates')}
          </Typography.Title>
          <Typography.Text>{content?.subDescription || ''}</Typography.Text>
          {/* TODO */}
          {/* <Button className="ml-12" type="primary" size="small" icon={<EditOutlined />} disabled>
            Edit
          </Button> */}
        </Space>

        <Table
          columns={columnsRowRender}
          dataSource={dates}
          pagination={false}
          rowKey="serviceDate"
        />
      </Space>
    );
  };

  return (
    <Space direction="vertical" className="w-full">
      <Typography.Title level={3}>
        {content?.title || t('reservation:extra_service')}
      </Typography.Title>
      <Typography.Text>
        {content?.description || t('reservation:des_extra_service')}
      </Typography.Text>
      <Table
        size="small"
        columns={columns}
        dataSource={customServiceList}
        pagination={false}
        expandable={
          !content?.hideExpands
            ? {
              expandedRowRender: (record: ServiceResType) =>
                record.dates && record.code && rowRender(record.dates)
            }
            : undefined
        }
        rowKey="key"
      />
    </Space>
  );
};

export default ExtraService;
