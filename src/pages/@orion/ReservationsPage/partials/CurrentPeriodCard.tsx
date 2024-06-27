import { KeyOutlined } from '@ant-design/icons';
import { TimeSliceType } from '@types';
import { Card, Space, Typography } from 'antd';
import clsx from 'clsx';
import XIcon from 'components/shared/Icon';
import { DATE_FORMAT_2, TIME_FORMAT_2 } from 'configs/const/format';
import { SPECIAL_NUMBER_DEFAULT } from 'constant/size';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatPriceByLocales } from 'utils/format';

interface Props {
  slice: TimeSliceType;
  idx: number;
}
const CurrentPeriodCard = ({ slice, idx }: Props) => {
  const { t } = useTranslation(['reservation', 'common']);
  const navigate = useNavigate();

  return (
    <Card className="p-0 m-2">
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* DETAIL */}
        <Space className="detail" direction="vertical" size={0}>
          <Space direction="vertical" size={0} className="mb-5">
            {idx > SPECIAL_NUMBER_DEFAULT ? <Typography.Text>
              <span className="font-bold text-lg">{dayjs(slice?.from).format('D')}</span>/
              <span>{dayjs(slice?.to).format('D')}</span>{' '}
              <span className="font-bold text-lg">{dayjs(slice?.from).format('MMM')}</span>
            </Typography.Text> : <Typography.Text>
              {`${dayjs(slice?.from).format(DATE_FORMAT_2)} - ${dayjs(slice?.to).format(DATE_FORMAT_2)}, ${dayjs(slice?.to).diff(slice?.from, 'day')} ${t('common:general.nights')}`}
            </Typography.Text>}
            {idx > SPECIAL_NUMBER_DEFAULT && <Space size={5}>
              <Typography.Text>{dayjs(slice?.from).format('dddd')},</Typography.Text>
              {idx === 0 && (
                <Typography.Text>
                  <XIcon name="planeArrival" />
                </Typography.Text>
              )}
              <Typography.Text>{dayjs(slice?.from).format(TIME_FORMAT_2)}</Typography.Text>
            </Space>}
          </Space>

          <Space direction="vertical">
            {/* <Space> */}
            {slice?.unit?.name ? <Typography.Text className="text-xl" strong>
              <KeyOutlined />
              {slice?.unit?.name}
            </Typography.Text> : ''}
            <Space size={5}>
              <div className="w-2 h-2 bg-orange-400" />
              <Typography.Text className="text-xl">
                {slice?.unitGroup?.name}
              </Typography.Text>
            </Space>
            {/* </Space> */}

            <Space direction="vertical" className={clsx(slice?.ratePlan?.extendedData?.link ? 'cursor-pointer' : '')} size={0} onClick={() => slice?.ratePlan?.extendedData?.link ? navigate(slice.ratePlan.extendedData.link) : null}>
              <Typography.Text className="text-xs text-slate-400">
                {idx > SPECIAL_NUMBER_DEFAULT ? t('reservation:rate_plan') : t('reservation:bundle_name')}
              </Typography.Text>
              <Typography.Text className=" text-emerald-700">
                {slice?.ratePlan?.name}
              </Typography.Text>
            </Space>
            {slice?.ratePlan?.extendedData?.rooms ? <Space direction="vertical" size={0}>
              <Typography.Text className="text-xs text-slate-400">
                {t('common:table.quantity')}
              </Typography.Text>
              <Typography.Text>
                {slice?.ratePlan?.extendedData?.rooms as any}
              </Typography.Text>
            </Space> : ''}
            {slice?.ratePlan?.extendedData?.guest ? <Space direction="vertical" size={0}>
              <Typography.Text className="text-xs text-slate-400">
                {t('reservation:guests')}
              </Typography.Text>
              <Typography.Text>
                {slice?.ratePlan?.extendedData?.guest?.adults} {t('reservation:adults')}{`, `}
                {slice?.ratePlan?.extendedData?.guest?.children} {t('reservation:children')}
              </Typography.Text>
            </Space> : ''}
          </Space>
        </Space>

        {/* PRICE */}
        <Space className="justify-between w-full mt-5">
          <XIcon name="house" className="text-xl text-slate-400" />
          <Typography.Text className="text-xl">
            {formatPriceByLocales(
              slice?.totalGrossAmount?.amount,
              slice?.totalGrossAmount?.currency
            )}{' '}
            {slice?.totalGrossAmount?.currency}
          </Typography.Text>
        </Space>
      </Space>
    </Card>
  );
};

export default CurrentPeriodCard;
