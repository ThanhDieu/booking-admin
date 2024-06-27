import { Card, Typography } from 'antd';
import { OverviewItem } from 'pages/@orion/OfferPage/partials';
import { useTranslation } from 'react-i18next';
import { BundleNewsletterSelect } from 'services/Newsletter/type';
import { useAppSelector } from 'store';
import { currencyFormatter, getCurrencySymbol } from 'utils/currency';

interface Props {
  bundleOfferSelected: BundleNewsletterSelect[];
}

const PresentBundleListCard = ({ bundleOfferSelected }: Props) => {
  const { t } = useTranslation(['offer']);

  return (
    <Card>
      <div className="flex flex-col">
        <Typography.Title level={3}>{t('offer:bundles_selected')}</Typography.Title>

        <div className="flex flex-col gap-3">
          {bundleOfferSelected?.length
            ? bundleOfferSelected?.map((item) => {
                return (
                  <div className="flex flex-col" key={item.propertyId}>
                    <Typography.Title level={5}>
                      {item?.bundles[0]?.property?.name ?? ''}
                    </Typography.Title>
                    <div className="flex flex-col gap-2">
                      {item?.bundles?.map((bundle) => (
                        <OverviewItem
                          key={bundle?.bundleId}
                          price={currencyFormatter(bundle?.priceMin)}
                          currencySymbol={getCurrencySymbol(bundle?.currency || 'EUR').symbol}
                          title={bundle?.name ?? ''}
                          // subTitle={bundle?.unitGroup?.name ?? ''}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    </Card>
  );
};

export default PresentBundleListCard;
