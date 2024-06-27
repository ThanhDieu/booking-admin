/* eslint-disable @typescript-eslint/no-explicit-any */
import { RightOutlined } from '@ant-design/icons';
import { Button, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { DATE_FORMAT_5 } from 'configs/const/format';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GetBundlePriceTypeV2, TimeSliceBundlePriceDetailType } from 'services/Bundle/type';
import { OfferBundleType } from 'services/Offer/type';
import { useAppDispatch, useAppSelector } from 'store';
import { StateAccommodation, changeState, updateBundleSelected } from 'store/orion/Booking';
import { updateBundleOfferSelected } from 'store/orion/Offer';
import { currencyFormatter } from 'utils/currency';

interface Props {
  customBundlePrices: GetBundlePriceTypeV2[];
  isOffer?: boolean;
  isNewsletter?: boolean;
}

const TableDetailBundlePrice = ({
  customBundlePrices,
  isOffer = false,
  isNewsletter = false
}: Props) => {
  const dispatch = useAppDispatch();
  const { payloadSearch } = useAppSelector((state) => state.orion.booking);
  const { t, i18n } = useTranslation(['common', 'offer']);
  const { bundleOfferSelected } = useAppSelector((state) => state.orion.offer);

  const checkDisableSelect = useCallback(
    (record: GetBundlePriceTypeV2) => {
      const indexBundle = bundleOfferSelected?.findIndex(
        (item) => item?.bundlePriceId === record?.bundlePriceId
      );
      const isEnough =
        bundleOfferSelected[indexBundle]?.count >=
        bundleOfferSelected[indexBundle]?.unitGroup?.availableUnits;
      return isEnough;
    },
    [bundleOfferSelected]
  );

  const columnBundlePrice = [
    {
      title: '',
      dataIndex: 'name',
      key: 'extId',
      width: '31%'
    },
    {
      title: '',
      dataIndex: 'description',
      key: 'description',
      width: '31%',
      ellipsis: true
    },
    {
      title: '',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (totalPrice: number, records: GetBundlePriceTypeV2) => {
        return (
          <div className="flex items-center justify-between">
            <Typography.Text>
              {currencyFormatter(totalPrice, 'EUR')} {records?.currency}
            </Typography.Text>
            <Button
              disabled={isOffer && checkDisableSelect(records)}
              icon
              type={'link'}
              className="flex items-center"
              onClick={() => {
                if (isOffer) {
                  const data: OfferBundleType = {
                    ...records,
                    totalGuest:
                      (payloadSearch?.adults ?? 0) + (payloadSearch?.children.length ?? 0),
                    count: 1,
                    adults: payloadSearch?.adults ?? 0
                  };
                  if (payloadSearch?.children?.length) data['children'] = payloadSearch?.children;
                  dispatch(
                    updateBundleOfferSelected({
                      data: { ...data }
                    })
                  );
                } else {
                  dispatch(updateBundleSelected({ ...(records as any) }));
                  dispatch(changeState(StateAccommodation.ExtraInfo));
                }
              }}
            >
              {t('offer:select_bundle')}
              <RightOutlined className="mt-1" />
            </Button>
          </div>
        );
      }
    }
  ];

  const columnDetailBundlePrice: ColumnsType<TimeSliceBundlePriceDetailType> = [
    {
      title: t('common:table.from'),
      key: 'from',
      dataIndex: 'from',
      render: (from: number) => {
        return <Typography.Text>{dayjs(from * 1000).format(`${DATE_FORMAT_5}`)}</Typography.Text>;
      }
    },
    {
      title: t('common:table.to'),
      key: 'to',
      dataIndex: 'to',
      render: (to: number) => {
        return <Typography.Text>{dayjs(to * 1000).format(`${DATE_FORMAT_5}`)}</Typography.Text>;
      }
    },
    {
      title: t('common:table.price'),
      key: 'totalPrice',
      dataIndex: 'totalPrice',
      render: (price: number, record: TimeSliceBundlePriceDetailType) => {
        return (
          <Typography.Text>
            {currencyFormatter(price, 'EUR')} {record?.currency}
          </Typography.Text>
        );
      }
    },
    {
      title: t('common:table.included_service'),
      key: 'services',
      dataIndex: ['includedServices', 'name'],
      render: (names: string[], record: TimeSliceBundlePriceDetailType) => {
        return (
          <Typography.Text>
            {record?.includedServices?.map((service, idx) =>
              record?.includedServices?.length && idx !== record.includedServices.length - 1
                ? `${service?.name},  `
                : service?.name
            )}
          </Typography.Text>
        );
      }
    }
  ];

  const renderBundlePriceDetail = (record: GetBundlePriceTypeV2) => {
    const addCurrency = record?.timeSliceDefinitions?.map((item) => {
      return {
        ...item,
        currency: record.currency
      };
    });
    return (
      <div className="flex flex-col">
        <Typography.Title level={5} className="ml-9 mb-3">
          {record?.bundleName}
        </Typography.Title>
        <Table columns={columnDetailBundlePrice} dataSource={addCurrency} rowKey="from" />
      </div>
    );
  };

  return (
    <Table
      columns={columnBundlePrice}
      dataSource={customBundlePrices.map((bundle) => {
        return {
          ...bundle,
          description: bundle?.unitGroup?.extendedData?.description[i18n?.language]
        };
      })}
      showHeader={false}
      pagination={false}
      rowKey="bundlePriceId"
      expandable={
        !isNewsletter
          ? {
              expandedRowRender: (record) => {
                return renderBundlePriceDetail(record);
              }
            }
          : {}
      }
    />
  );
};

export default TableDetailBundlePrice;
