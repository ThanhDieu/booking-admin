/* eslint-disable @typescript-eslint/no-explicit-any */
import { Space } from 'antd';
import Card from 'antd/es/card/Card';
import { GuestSummaryComponent } from 'components/common';
import { OfferDetailProps } from '../../index.types';

const GuestPage = ({ offerDetail }: OfferDetailProps) => {

  const guestInfo = offerDetail?.booker;

  return (
    <Space direction="vertical" className="w-full">
      <Card>
        <GuestSummaryComponent guest={guestInfo} />
      </Card>
    </Space>
  );
};

export default GuestPage;
