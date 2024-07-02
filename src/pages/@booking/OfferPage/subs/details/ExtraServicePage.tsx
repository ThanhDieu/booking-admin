/* eslint-disable @typescript-eslint/no-explicit-any */
import { Space } from 'antd';
import { ExtraService } from 'pages/@booking/ReservationsPage/partials';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OfferDetailProps } from '../../index.types';
import { A_THOUSAND, ServiceMode } from 'configs/const/general';
import dayjs from 'dayjs';

const ExtrasPage = ({ offerDetail }: OfferDetailProps) => {
  const { t } = useTranslation(['offer', 'bundles'])

  const numberOfNights = useMemo(
    () => dayjs(offerDetail?.departure * A_THOUSAND).diff(offerDetail?.arrival * A_THOUSAND, 'day'),
    [offerDetail?.arrival, offerDetail?.departure]
  );

  const formatExtraServices = useMemo(() => {
    if (offerDetail?.offerServices?.length) {
      return offerDetail.offerServices.map(offerService => {
        const totalCount = offerService?.service?.mode === ServiceMode.Daily ? (offerService?.count * numberOfNights) : (offerService?.count || 1)
        return {
          ...offerService,
          service: {
            ...offerService?.service,
            code: offerService?.service?.extId,

          },
          dates: [{
            count: offerService?.count,
          }],
          totalAmount: {
            grossAmount: Number(offerService?.service?.price || 0) * Number(totalCount),
            currency: offerDetail?.property?.currency
          }
        }
      })
    }
    return []
  }, [offerDetail?.offerServices, offerDetail?.property])

  const bundleServices = useMemo(() => {
    let newServices: any[] = []
    if (offerDetail?.offerBundleUpgrades?.length) {
      offerDetail.offerBundleUpgrades.forEach(offerBundleUpgrade => {
        if (offerBundleUpgrade?.bundleUpgrade?.bundle?.bundleServices?.length) {
          newServices = [...newServices, ...offerBundleUpgrade.bundleUpgrade.bundle.bundleServices.map(sv => ({
            ...sv,
            count: offerBundleUpgrade?.count,
            extendedData: {
              bundle: offerBundleUpgrade?.bundleUpgrade?.bundle?.extendedData?.title
            }
          }))]
        }
      })
    }
    return newServices
  }, [offerDetail?.offerBundleUpgrades])
  const formatBundleServices = useMemo(() => {
    if (bundleServices?.length) {
      return bundleServices.map(offerService => {
        const totalCount = offerService?.mode === ServiceMode.Daily ? (offerService?.count * numberOfNights) : (offerService?.count || 1)
        return {
          ...offerService,
          service: {
            ...offerService,
            code: offerService?.serviceId,
          },
          dates: [{
            count: offerService?.count,
          }],
          totalAmount: {
            grossAmount: Number(offerService?.overwritePrice
              || 0) * Number(totalCount),
            currency: offerDetail?.property?.currency
          }
        }
      })
    }
    return []
  }, [bundleServices])

  return (
    <Space direction="vertical" className="w-full">
      {/* EXTRA SERVICE AREA */}
      <ExtraService services={formatExtraServices as any} content={{ hideAction: true, hideExpands: true, description: t('offer:des_extra_service') }} />

      {/* Bundle services */}
      <ExtraService
        services={formatBundleServices as any}
        content={{
          title: t('bundles:bundle_service'),
          description: t('bundles:des_extra_service'),
          subDescription: '',
          hideAction: true,
          hideExpands: true,
          isBundle: true
        }}
      />

    </Space>
  );
};

export default ExtrasPage;
