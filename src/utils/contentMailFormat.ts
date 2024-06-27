import { DATE_FORMAT_3 } from 'configs/const/format';
import { IBE_BOOKING_LINK_NEWSLETTER, IBE_BOOKING_LINK_OFFER } from 'constant/paths';
import dayjs from 'dayjs';
import { DataNewsletterPayload } from 'services/Newsletter/type';
import { OfferDetailType } from 'services/Offer/type';
import { currencyFormatter } from './currency';
import { converHtmlToPlainText } from './text';

export const contendMailOfferFormat = (offer?: OfferDetailType) => {
  const currency = offer?.property?.currency ?? 'EUR';
  return {
    ops: [
      //offername
      { insert: `Offer name: `, attributes: { bold: true } },
      { insert: `${offer?.name}\n` },
      //period
      { insert: `Travel dates: `, attributes: { bold: true } },
      {
        insert: `${dayjs((offer?.arrival ?? 0) * 1000).format(DATE_FORMAT_3)} - ${dayjs(
          (offer?.departure ?? 0) * 1000
        ).format(DATE_FORMAT_3)}\n`
      },
      //price
      {
        insert: `Price: `,
        attributes: { bold: true }
      },
      {
        insert: `${currencyFormatter(
          (offer?.price ?? 0) - (offer?.discount ?? 0),
          currency
        )} ${currency}\n`
      },
      //validity
      {
        insert: `Validity: `,
        attributes: { bold: true }
      },
      {
        insert: `${dayjs((offer?.validity ?? 0) * 1000).format(DATE_FORMAT_3)}\n`
      },
      //link
      {
        insert: `Click here for more detail`,
        attributes: {
          link: `${IBE_BOOKING_LINK_OFFER}/${offer?.offerId}`
        }
      }
    ]
  };
};

export const contentMailewsletterFormat = (newsletter: DataNewsletterPayload) => {
  const bundleQuill = newsletter?.bundles?.map((bundle) => {
    const bundleLink = `${IBE_BOOKING_LINK_NEWSLETTER}/${bundle.bundleId}`;
    return [
      { insert: `Bundle name: `, attributes: { bold: true } },
      { insert: `${bundle.name}` },
      {
        insert: `Click here for more infomation\n`,
        attributes: {
          link: bundleLink
        }
      }
    ];
  });

  const formatContentToQuill = {
    ops: [
      { insert: `${newsletter?.name}\n\n`, attributes: { bold: true, header: 2 } },
      { insert: `${converHtmlToPlainText(newsletter?.intro)}\n\n` },
      ...bundleQuill.flat(),
      { insert: `\n` },
      { insert: `${converHtmlToPlainText(newsletter?.outro)}\n` }
    ]
  };

  return formatContentToQuill;
};
