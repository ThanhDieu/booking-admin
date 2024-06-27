import { Card, Divider, Space, Typography } from 'antd';
import logo from 'assets/images/logo-sonnenhotels.png';
import { GuestSummaryComponent, PropertyInfoComponent } from 'components/common';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';
import { calculateTotal } from 'utils/calculate';

interface Props {
  numberOfNight: number;
  arrival: string;
  departure: string;
}

const OverviewInfoOfferCard = ({ numberOfNight, arrival, departure }: Props) => {
  const { t } = useTranslation(['offer', 'reservation', 'common']);

  const { bundleOfferSelected, offerInfo } = useAppSelector((state) => state.orion.offer);
  const { payloadSearch } = useAppSelector((state) => state.orion.booking);
  const countAllGuest = useMemo(
    () => calculateTotal(bundleOfferSelected, ['adults', 'children']),
    [bundleOfferSelected]
  );

  return (
    <Card>
      <div className="flex flex-col gap-5 ">
        {/* ROOM INFO */}
        <div className="flex flex-col gap-6 justify-between ">
          <Typography.Title level={3}>{t('offer:stay_info')}</Typography.Title>
          <div className="flex flex-col">
            <Typography.Text className="text-base">{arrival + ' - ' + departure}</Typography.Text>
            <Typography.Text className="text-base">
              {numberOfNight} {t('common:general.nights').toLowerCase()}
            </Typography.Text>
            <Typography.Text className="text-base">
              {countAllGuest.adults ?? 0} {t('reservation:adults').toLowerCase()},{' '}
              {countAllGuest.children ?? 0} {t('reservation:children').toLowerCase()}
            </Typography.Text>
          </div>
          {/* GUEST INFO */}
          {offerInfo && <GuestSummaryComponent guest={offerInfo} />}
          {/* HOTEL INFO */}
          <Divider />
          <Space direction="vertical">
            <img src={logo} alt="avatar" className="w-fit h-16 " />
            <PropertyInfoComponent propertyId={payloadSearch?.propertyId} />
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default OverviewInfoOfferCard;
