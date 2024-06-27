
import { Space, Tag, Typography } from 'antd';
import GeneralResvationInfo, {
  GeneralReservationInfoProps
} from 'components/common/GeneralReservationInfo';
import XIcon from 'components/shared/Icon';
import { DATE_TIME_FORMAT_1 } from 'configs/const/format';
import { A_THOUSAND } from 'configs/const/general';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useTranslation } from 'react-i18next';
import { formatPriceByLocales } from 'utils/format';
import { addSpaceInString, capitalize } from 'utils/text';
import { OfferDetailProps } from '../../index.types';
import { statusColor } from '../../partials/TableOffer';
dayjs.extend(utc);
dayjs.extend(tz);

const HeaderSection = ({ offerDetail }: OfferDetailProps) => {
  const { t } = useTranslation(['common', 'bundles']);

  const renderItemShortenInfo: GeneralReservationInfoProps[] = [
    {
      icon: <XIcon name="arrival" className=" text-xl" />,
      value: offerDetail?.arrival
        ? dayjs(offerDetail.arrival * A_THOUSAND).format(DATE_TIME_FORMAT_1)
        : ''
    },
    {
      icon: <XIcon name="departure" className=" text-xl" />,
      value: offerDetail?.departure
        ? dayjs(offerDetail.departure * A_THOUSAND).format(DATE_TIME_FORMAT_1)
        : ''
    },

    {
      icon: <XIcon name="info" className=" text-xl" />,
      value: offerDetail?.validity
        ? dayjs(offerDetail.validity * A_THOUSAND).format(DATE_TIME_FORMAT_1)
        : ''
    },
    {
      icon: <XIcon name="tagRoom" className=" text-xl" />,
      value: offerDetail?.offerId
    }
  ];

  const price = formatPriceByLocales(
    offerDetail?.price,
    offerDetail?.property?.currency
  );
  const total = formatPriceByLocales(
    (offerDetail?.price - offerDetail?.discount),
    offerDetail?.property?.currency
  );
  const discount = formatPriceByLocales(
    offerDetail?.discount,
    offerDetail?.property?.currency
  );

  return (
    <Space className=" w-full justify-between mt-5">
      <Space direction="vertical">
        <Space size="small" align='center' className='mb-3' >
          <Typography.Title level={2} className='mb-0'>
            {offerDetail?.offerId}, {offerDetail?.booker?.firstName}{' '}
            {offerDetail?.booker?.lastName}
          </Typography.Title>
          <Tag color={statusColor(offerDetail?.status || '')}>{capitalize(addSpaceInString(offerDetail?.status || ''))}</Tag>
        </Space>
        <GeneralResvationInfo items={renderItemShortenInfo} />
      </Space>
      <Space direction="vertical">
        <Space size="large" className="flex items-start ">
          <Space direction="vertical" size='small'>
            <Space direction="vertical" className="items-end" size={0}>
              <Typography.Text>{t('common:table.price')?.toUpperCase()}</Typography.Text>
              <Typography.Text className="text-3xl">
                {price} {offerDetail?.property?.currency}
              </Typography.Text>

            </Space>
            <Space className="flex justify-between " size={0}>
              <Typography.Text className='pe-2'>{t('bundles:discount')?.toUpperCase()}: </Typography.Text>
              <Typography.Text>
                {offerDetail?.discount && Number(offerDetail.discount) > 0 ? `${discount}` : 0}  {offerDetail?.property?.currency}
              </Typography.Text>
            </Space>
          </Space>
          <Space direction="vertical" className="items-end " size={0}>
            <Typography.Text type="danger">{t('common:table.total_price')?.toUpperCase()}</Typography.Text>
            <Typography.Text type="danger" className="text-3xl">
              {total} {offerDetail?.property?.currency}
            </Typography.Text>
          </Space>
        </Space>
      </Space>
    </Space>
  );
};

export default HeaderSection;
