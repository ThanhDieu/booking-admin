/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Form, Input, Row, Select, TimePicker, Typography } from 'antd';
import { countries, currencies } from 'constant';
import dayjs from 'dayjs';
import { formatObjectList } from 'utils/format';
import { LocationSectionProps } from '../index.types';
import { AddressComponent } from 'components/common';
import { A_THOUSAND, FuncType, countryCodes } from 'configs/const/general';
import { useTranslation } from 'react-i18next';

const countriesLocal = Object.fromEntries(
  Object.entries(countries).filter(([key, value]) => countryCodes.includes(key))
);

const LocationSection = ({ mode, propertyDetail }: LocationSectionProps) => {
  const { t } = useTranslation(['common', 'properties'])
  return (
    <Card>
      <Typography.Title level={4}>Location</Typography.Title>
      <AddressComponent
        countries={countriesLocal}
        required={['addressLine1', 'postalCode', 'city', 'countryCode']}
        status={
          mode === FuncType.UPDATE
            ? ['addressLine1', 'addressLine2', 'postalCode', 'city', 'countryCode']
            : []
        }
      />
      <Row className="gap-8">
        <Col className="flex-1">
          <Form.Item label={t("properties:timezone")} name="timeZone" rules={[{ required: true }]}>
            <Input disabled={mode === FuncType.UPDATE} />
          </Form.Item>
        </Col>
        <Col className="flex-1">
          <Form.Item label={t("properties:default_in")} name="currencyCode" rules={[{ required: true }]}>
            <Select disabled={mode === FuncType.UPDATE} showSearch optionLabelProp="label">
              {formatObjectList(currencies, '@').map((currency) => (
                <Select.Option
                  key={currency.value}
                  value={currency.value}
                  label={currency.value.split('@')[0]}
                >
                  {currency.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row className="gap-8">
        <Col className="flex-1">
          <Form.Item label={t("properties:currency_code")} name="defaultCheckInTime">
            {propertyDetail?.data?.defaultCheckInTime ? (
              <TimePicker
                defaultValue={dayjs(Number(propertyDetail?.data?.defaultCheckInTime) * A_THOUSAND)}
                use12Hours
                format="h:mm a"
                disabled={mode === FuncType.UPDATE}
              />
            ) : (
              <TimePicker
                placeholder={t("properties:placeholder_select_time")}
                use12Hours
                format="h:mm a"
                disabled={mode === FuncType.UPDATE}
              />
            )}
          </Form.Item>
        </Col>
        <Col className="flex-1">
          <Form.Item label={t("properties:default_out")} name="defaultCheckOutTime">
            {propertyDetail?.data?.defaultCheckInTime ? (
              <TimePicker
                defaultValue={dayjs(Number(propertyDetail?.data?.defaultCheckOutTime) * A_THOUSAND)}
                use12Hours
                format="h:mm a"
                disabled={mode === FuncType.UPDATE}
              />
            ) : (
              <TimePicker
                placeholder={t("properties:placeholder_select_time")}
                use12Hours
                format="h:mm a"
                disabled={mode === FuncType.UPDATE}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default LocationSection;
