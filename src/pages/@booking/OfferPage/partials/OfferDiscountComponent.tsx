/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Form, FormInstance, InputNumber } from 'antd';
import { useTranslation } from 'react-i18next';
import { currencyFormatter, currencyParser } from 'utils/currency';

interface Props {
  handleChangeValueDiscount: (value?: number | null) => void;
  form: FormInstance<any>;
}

const OfferDiscountComponent = ({ handleChangeValueDiscount, form }: Props) => {
  const { t } = useTranslation(['common', 'offer']);
  const totalPrice = Form.useWatch('totalPrice', form);

  return (
    <>
      <Col span={3}>
        <Form.Item label={t('common:table.total_price')} name="totalPrice">
          <InputNumber
            disabled
            addonAfter={'€'}
            formatter={(value: any) => value && currencyFormatter(value)}
          />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item
          rules={[
            {
              type: 'number',
              max: Number(currencyParser(totalPrice?.toString() ?? 0)),
              message: `${t('offer:discount_validation')} ${totalPrice} €`
            }
          ]}
          label={t('bundles:discount')}
          name="discount"
        >
          <InputNumber
            min={0}
            addonAfter="€"
            onChange={(value: number | null) => handleChangeValueDiscount(value)}
            parser={currencyParser}
          />
        </Form.Item>
      </Col>
      <Col span={3}>
        <Form.Item label={t('offer:grand_total')} name="finalPrice">
          <InputNumber
            disabled
            addonAfter={'€'}
            formatter={(value: any) => value && currencyFormatter(value)}
          />
        </Form.Item>
      </Col>
    </>
  );
};

export default OfferDiscountComponent;
