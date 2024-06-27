import { Card, Divider, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';
import { currencyFormatter, getCurrencySymbol } from 'utils/currency';
import OverviewItem from './OverviewItem';

interface Props {
  summaryBundle: number;
  summaryService: number;
  numberOfNight: number;
  currentStep?: number;
}

const OverviewBundleOfferCard = ({
  summaryBundle,
  summaryService,
  numberOfNight,
  currentStep
}: Props) => {
  const { t } = useTranslation(['offer', 'bundles']);

  const { bundleOfferSelected, extraServiceOffer, offerInfo } = useAppSelector(
    (state) => state.orion.offer
  );
  const subTotal = summaryBundle + summaryService;
  const grandTotal = subTotal - (offerInfo?.discount ?? 0);

  return (
    <Card>
      <div className="flex flex-col gap-5 ">
        <Typography.Title level={3}>{t('offer:room_and_service')}</Typography.Title>
        {/* BUNDLE SELECTED */}
        <div className="flex flex-col justify-between ">
          <Typography.Title level={4}>{t('offer:bundles_selected')}</Typography.Title>
          <div className="flex flex-col gap-3">
            {bundleOfferSelected?.map((bundle) => {
              const currencySymbol = getCurrencySymbol(bundle?.currency || 'EUR').symbol;
              const price = currencyFormatter(bundle?.totalPrice * bundle.count);
              return (
                <OverviewItem
                  key={bundle.key}
                  price={price}
                  currencySymbol={currencySymbol}
                  title={bundle.bundleName ?? ''}
                  subTitle={bundle?.unitGroup?.name ?? ''}
                  count={bundle?.count}
                />
              );
            })}
          </div>
        </div>

        {/* SERVICE SELECTED */}
        {extraServiceOffer.length > 0 && (
          <div className="flex flex-col justify-between">
            <Typography.Title level={5}>{t('offer:services_selected')}</Typography.Title>
            <div className="flex flex-col gap-3">
              {extraServiceOffer?.map((service) => {
                const isOneDay = service?.mode
                  ? service?.mode === 'Arrival' || service?.mode === 'Departure'
                  : true;
                const currencySymbol = getCurrencySymbol('EUR').symbol;
                const price = currencyFormatter(
                  service?.price * (service?.count ?? 1) * (isOneDay ? 1 : numberOfNight)
                );

                return (
                  <OverviewItem
                    key={service.key}
                    price={price}
                    currencySymbol={currencySymbol}
                    title={service.name ?? ''}
                    count={service?.count ?? 1}
                  />
                );
              })}
            </div>
          </div>
        )}
        <Divider />
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <OverviewItem
              title={t('offer:subtotal')}
              price={currencyFormatter(subTotal)}
              currencySymbol={getCurrencySymbol('EUR').symbol}
              isBoldPrice
            />
            <OverviewItem
              title={`${t('bundles:discount')} `}
              price={currencyFormatter(offerInfo?.discount ?? 0)}
              isBoldPrice
              currencySymbol={getCurrencySymbol('EUR').symbol}
            />
            <OverviewItem
              title={currentStep === 1 ? t('offer:estimate_total') : t('offer:grand_total')}
              price={currencyFormatter(grandTotal)}
              currencySymbol={getCurrencySymbol('EUR').symbol}
              isBoldPrice
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OverviewBundleOfferCard;
