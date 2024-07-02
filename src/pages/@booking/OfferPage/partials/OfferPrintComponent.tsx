import { Typography } from 'antd';
import logo from 'assets/images/logo-sonnenhotels.png';
import { GuestSummaryComponent, PropertyInfoComponent } from 'components/common';
import { OfferInforType } from 'services/Offer/type';
import OverviewBundleOfferCard from './OverviewBundleOfferCard';

interface Props {
  offerInfo?: OfferInforType;
  propertyId: string;
  summaryBundle: { [x: string]: number };
  summaryService: number;
  numberOfNight: number;
}

const OfferPrintComponent = ({
  offerInfo,
  propertyId,
  summaryBundle,
  summaryService,
  numberOfNight
}: Props) => {
  return (
    <div className="flex flex-col p-5 gap-8 hidden-print">
      {/* LOGO */}
      <div>
        <img src={logo} alt="avatar" className="w-fit h-16 " />
      </div>
      {/* INFO */}
      <div className="flex justify-between items-start">
        <div>
          <Typography.Title level={3}>Hotel details</Typography.Title>
          <PropertyInfoComponent propertyId={propertyId} />
        </div>
        <div>
          <Typography.Title level={3}>Guest details</Typography.Title>
          {offerInfo && <GuestSummaryComponent guest={offerInfo} />}
        </div>
      </div>
      {/* OFFER */}
      <div>
        <OverviewBundleOfferCard
          summaryBundle={summaryBundle.totalPrice}
          summaryService={summaryService}
          numberOfNight={numberOfNight}
        />
      </div>
    </div>
  );
};

export default OfferPrintComponent;
