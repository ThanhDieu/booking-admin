/* eslint-disable @typescript-eslint/no-unused-vars */
import { RadiusSettingOutlined } from '@ant-design/icons';
import { Card, Space, Table, Tag, Typography, theme } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { A_THOUSAND } from 'configs/const/general';
import { useMemo } from 'react';
import { PropertyDetailAppType } from 'services/Properties/type';
import { useAppSelector } from 'store';
import { formatTime } from 'utils/dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import renderMenuLabel from 'components/shared/i18nextRender';
dayjs.extend(relativeTime);

const { useToken } = theme;
const timeToNow = (value: { start: number; end: number }) => {
  return dayjs(value.start * A_THOUSAND).to(dayjs(value.end * A_THOUSAND));
};

const MaintenanceChart: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const { token } = useToken();
  const { properties, loading: propertyLoading } = useAppSelector((state) => state.booking?.property);
  const propertyUnavailable = useMemo(() => {
    return properties?.data?.filter(
      (property) =>
        property.unavailableBookingOnline &&
        Object.keys(property.unavailableBookingOnline).length > 0
    );
  }, [properties?.data]);

  const columns: ColumnsType<PropertyDetailAppType> = [
    {
      title: t('common:table.name'),
      dataIndex: ['name'],
      key: 'en',
      width: '35%',
      render: (value: string, record) => {
        return (
          <>
            <Typography.Text className="block">{value}</Typography.Text>
            <Typography.Text className="text-[11px] text-slate-500">{record.extId}</Typography.Text>
          </>
        );
      },
      sorter: (a, b) => {
        return a.name && b.name ? a.name.localeCompare(b.name) : 0;
      }
    },
    {
      title: renderMenuLabel('table.start_date', 'common'),
      dataIndex: ['unavailableBookingOnline', 'start'],
      key: 'start',
      sorter: (a, b) =>
        (a.unavailableBookingOnline?.start || 0) - (b.unavailableBookingOnline?.start || 0),
      render: (value: number) => <Typography.Text>{formatTime(value)}</Typography.Text>
    },
    {
      title: renderMenuLabel('table.end_date', 'common'),
      dataIndex: ['unavailableBookingOnline', 'end'],
      key: 'end',
      sorter: (a, b) =>
        (a.unavailableBookingOnline?.end || 0) - (b.unavailableBookingOnline?.end || 0),
      render: (value: number) => <Typography.Text>{formatTime(value)}</Typography.Text>
    },
    {
      title: renderMenuLabel('table.relative_time', 'common'),
      dataIndex: ['unavailableBookingOnline'],
      // sorter: (a, b) =>
      //   (a.unavailableBookingOnline?.end || 0) - (b.unavailableBookingOnline?.end || 0),
      render: (value) => <Tag color={token?.colorPrimary}>{value ? timeToNow(value) : 0}</Tag>,
      // filters: filterTimeOption,
      ellipsis: true
      // onFilter: (value: number, record) =>
      //   record.unavailableBookingOnline?.end &&
      //   Number(timeToNow(record.unavailableBookingOnline?.end).includes(value?.toString()))
    }
  ];

  return (
    <Card
      title={
        <Space>
          <RadiusSettingOutlined />
          <Typography.Text>{t('dashboard_page.table_manage.title')}</Typography.Text>
        </Space>
      }
      size="small"
    >
      <Table
        columns={columns}
        dataSource={propertyUnavailable}
        scroll={{
          y: 200
        }}
        pagination={false}
        rowKey="extId"
        showSorterTooltip={false}
        loading={propertyLoading}
      />
    </Card>
  );
};

export default MaintenanceChart;
