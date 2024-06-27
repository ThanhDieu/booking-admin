import { GuestInfo } from '@types';
import { Space, Typography } from 'antd';
import { countries } from 'constant';

interface Props {
  guest: GuestInfo;
  isOffer?: boolean;
}

const GuestSummaryComponent = ({ guest, isOffer }: Props) => {
  return (
    <div>
      <div>
        <Typography.Title level={5} className="mb-0">
          {guest?.title} {guest?.firstName} {guest?.middleInitial} {guest?.lastName}
        </Typography.Title>
      </div>
      <div className="flex gap-10">
        <Space direction="vertical" size={0} className="min-w-[200px]">
          <Typography.Text className={isOffer ? 'text-sm' : 'text-base'}>
            {guest?.email}
          </Typography.Text>
          <Typography.Text className={isOffer ? 'text-sm' : 'text-base'}>
            +{guest?.phone}
          </Typography.Text>
          <Typography.Text className={isOffer ? 'text-sm' : 'text-base'}>
            {guest?.company?.name} {guest?.company?.taxId}
          </Typography.Text>
          <Typography.Text className={isOffer ? 'text-sm' : 'text-base'}>
            {guest?.address?.addressLine1} {guest?.address?.addressLine2}, {guest?.address?.city},{' '}
            {countries[guest?.address?.countryCode as keyof typeof countries]}
          </Typography.Text>
        </Space>
      </div>
    </div>
  );
};

export default GuestSummaryComponent;
