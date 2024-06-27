/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Table, Typography } from 'antd';
import { PERPAGE } from 'constant/size';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { BundleListType, GetBundlePriceTypeV2 } from 'services/Bundle/type';
import { BundleNewsletterSelect } from 'services/Newsletter/type';
import { currencyFormatter } from 'utils/currency';
import { QueryCaseType } from 'utils/queryParams';
import TableDetailBundlePrice from './TableDetailBundlePrice';

interface Props {
  bundles: {
    list: never[] | BundleListType[];
    pagination: PaginationType | undefined;
  };
  loading?: boolean;
  handleChangeLocation: ({
    currentPage,
    arrival,
    departure,
    adults,
    propertyId
  }: QueryCaseType) => void;
  currentLocation: QueryCaseType;
  isOffer?: boolean;
  isNewsletter?: boolean;
  handleChooseBundle?: (record: any, selected: boolean) => void;
  newsLetterBundleSelected?: BundleNewsletterSelect[];
  initialBundlistArrKey?: string[];
}

const BundleListResult = ({
  bundles,
  loading,
  handleChangeLocation,
  currentLocation,
  isOffer = false,
  isNewsletter = false,
  handleChooseBundle,
  newsLetterBundleSelected,
  initialBundlistArrKey
}: Props) => {
  const { t, i18n } = useTranslation(['reservation', 'common']);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  const columns: any = [
    {
      title: t('common:table.bundle_price'),
      key: 'bundle',
      dataIndex: 'name',
      width: '30%'
    },
    {
      title: t('common:table.description'),
      key: 'description',
      dataIndex: 'description',
      width: '30%',
      ellipsis: true,
      render: (description: string) => (
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{description}</ReactMarkdown>
      )
    },
    {
      title: t('reservation:price'),
      key: 'priceMin',
      dataIndex: 'priceMin',
      render: (minPrice: number, record: GetBundlePriceTypeV2) =>
        isNewsletter && (
          <Typography.Text>
            {currencyFormatter(minPrice, record?.currency ?? 'EUR')} {record?.currency ?? 'EUR'}
          </Typography.Text>
        )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    onSelect: (record: any, selected: boolean) => {
      handleChooseBundle && handleChooseBundle(record, selected);
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
      handleChooseBundle && handleChooseBundle(changeRows, selected);
    }
  };

  useEffect(() => {
    if (initialBundlistArrKey?.length) setSelectedRowKeys([...initialBundlistArrKey]);
    const currentBundleList = newsLetterBundleSelected?.filter(
      (el) => el.propertyId === currentLocation.propertyId
    );
    if (!currentBundleList?.length) setSelectedRowKeys([]);
    const bundleSelectedIdArr = currentBundleList?.length
      ? currentBundleList[0]?.bundles?.map((bundle) => bundle?.bundleId ?? '')
      : [];
    setSelectedRowKeys([...bundleSelectedIdArr]);
  }, [newsLetterBundleSelected, initialBundlistArrKey]);

  useEffect(() => {
    if (initialBundlistArrKey?.length) {
      const filteredData = bundles.list?.filter((item) =>
        initialBundlistArrKey.includes(item.bundleId)
      ) as any;
      filteredData?.length && handleChooseBundle && handleChooseBundle(filteredData, true);
    }
  }, [bundles.list]);

  return (
    <Card>
      <Typography.Title level={4}>{t('reservation:bundle_list')}</Typography.Title>
      <Table
        columns={columns}
        dataSource={bundles?.list.map((bundle) => {
          return {
            ...bundle,
            name: bundle?.extendedData?.title[i18n.language] ?? bundle?.name,
            description: bundle?.extendedData?.description[i18n.language] ?? ''
          };
        })}
        rowKey="bundleId"
        loading={loading}
        pagination={
          !bundles?.pagination?.total ||
          (bundles?.pagination?.total && bundles?.pagination?.total < PERPAGE)
            ? false
            : {
                pageSize: PERPAGE,
                total: bundles?.pagination?.total ? Number(bundles?.pagination.total) : 1,
                showSizeChanger: false,
                onChange: (page: number) =>
                  handleChangeLocation({ ...currentLocation, currentPage: page })
              }
        }
        expandable={
          !isNewsletter
            ? {
                expandRowByClick: true,
                expandedRowRender: (record) => {
                  const customBundlePrices = record?.bundlePrices.map((item) => {
                    return {
                      ...item,
                      bundleName: record?.extendedData?.title[i18n.language] ?? record?.name,
                      name: item?.unitGroup?.extendedData?.name[i18n.language] ?? item?.name
                    };
                  });
                  return (
                    <div>
                      <TableDetailBundlePrice
                        isNewsletter
                        customBundlePrices={customBundlePrices as any}
                        isOffer={isOffer}
                      />
                    </div>
                  );
                }
              }
            : undefined
        }
        rowSelection={
          isNewsletter
            ? {
                ...rowSelection
              }
            : undefined
        }
        scroll={{
          y: 250
        }}
      />
    </Card>
  );
};

export default BundleListResult;
