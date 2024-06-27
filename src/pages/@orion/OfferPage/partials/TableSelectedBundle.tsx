import { DeleteOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OfferBundleType } from 'services/Offer/type';
import { useAppDispatch, useAppSelector } from 'store';
import { updateBundleOfferSelected, updateCountBundleOfferSelected } from 'store/orion/Offer';
import { calculateTotal } from 'utils/calculate';
import { currencyFormatter, getCurrencySymbol } from 'utils/currency';

interface Props {
  isDisplay?: boolean;
}
const TableSelectedBundle = ({ isDisplay = false }: Props) => {
  const { t } = useTranslation(['reservation', 'bundles', 'offer', 'common']);
  const { bundleOfferSelected } = useAppSelector((state) => state.orion.offer);

  const dispatch = useAppDispatch();

  //FUNCTIONAL

  //DATA
  const summaryBundle = useMemo(
    () => calculateTotal(bundleOfferSelected, ['totalPrice', 'totalGuest']),
    [bundleOfferSelected]
  );

  //COLUMNS
  const columns: ColumnsType<OfferBundleType> = [
    {
      title: 'No.',
      key: 'No.',
      width: '5%',
      render: (_, record, idx) => <Typography.Text>{idx + 1}</Typography.Text>
    },
    {
      title: t('reservation:bundle_name'),
      key: 'bundleName',
      dataIndex: ['bundleName']
    },
    {
      title: t('bundles:unit_group'),
      key: 'unitgroup',
      dataIndex: ['unitGroup', 'name']
    },
    {
      title: t('reservation:guests'),
      key: 'guests',
      dataIndex: ['totalGuest']
    },
    {
      title: t('bundles:price'),
      key: 'price',
      dataIndex: ['totalPrice'],
      render: (price, record) => (
        <Typography.Text>
          {currencyFormatter(price, record?.currency)} {record?.currency}
        </Typography.Text>
      )
    },
    {
      title: t('common:table.quantity'),
      key: 'count',
      dataIndex: 'count',
      width: '10%',
      render: (count, record, idx) => {
        const maximumQuality = record?.unitGroup?.availableUnits;
        return (
          <Space>
            <Button
              size="small"
              type="text"
              disabled={count === 1}
              icon={<LeftOutlined />}
              onClick={() =>
                dispatch(updateCountBundleOfferSelected({ bundleIdx: idx, action: 'dec' }))
              }
            />
            {count}
            <Button
              size="small"
              type="text"
              icon={<RightOutlined />}
              disabled={count > (maximumQuality ?? 1) - 1}
              onClick={() =>
                dispatch(updateCountBundleOfferSelected({ bundleIdx: idx, action: 'inc' }))
              }
            />
          </Space>
        );
      }
    },
    {
      title: !isDisplay && t('common:table.action'),
      key: 'remove',
      align: 'right',
      dataIndex: 'key',
      render: (key) => {
        return isDisplay ? null : (
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => dispatch(updateBundleOfferSelected({ data: undefined, removeId: key }))}
          />
        );
      }
    }
  ];
  return (
    <Card>
      <div className="flex flex-col gap-5 justify-center mb-4">
        {!isDisplay && (
          <Typography.Title level={4} className="mb-0">
            {t('offer:bundles_selected')}{' '}
          </Typography.Title>
        )}
        <div className="flex gap-5">
          <Typography.Text strong>
            {t('common:table.total_price')}:{' '}
            {getCurrencySymbol(bundleOfferSelected[0]?.currency ?? 'EUR').symbol}
            {currencyFormatter(summaryBundle.totalPrice, bundleOfferSelected[0]?.currency ?? 'EUR')}
          </Typography.Text>
          <Typography.Text strong>
            {t('common:table.total_guests')}: {summaryBundle.totalGuest}{' '}
            {summaryBundle.totalGuest > 1 ? t('common:general.people') : t('common:general.person')}
          </Typography.Text>
        </div>
      </div>
      <Table
        pagination={false}
        scroll={{
          y: 250
        }}
        dataSource={bundleOfferSelected}
        columns={columns}
        rowKey="key"
        childrenColumnName="antdChildren" //prevent antd take children to define tree in table
      />
    </Card>
  );
};

export default TableSelectedBundle;
