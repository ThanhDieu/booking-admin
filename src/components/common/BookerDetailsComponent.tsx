/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Checkbox, Col, DatePicker, Form, FormInstance, Input, Row, Select } from 'antd';
import { bookerTitleOptions, genderOptions } from 'configs/const/options';
import { languages } from 'constant';
import { useTranslation } from 'react-i18next';
import { isRequired } from 'utils/array';
import { formatObjectList } from 'utils/format';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ThemeType } from 'configs/const/general';
import { useAppSelector } from 'store';
import clsx from 'clsx';
import { useState } from 'react';

interface Props {
  required?: string[];
  shorten?: boolean;
  isOffer?: boolean;
  autoFill?: (value: boolean) => void;
  form?: FormInstance<any>;
}
const IndexComponent: React.FC<Props> = ({
  required,
  shorten,
  isOffer = false,
  autoFill,
  form
}) => {
  const { t } = useTranslation(['common']);
  const { selected } = useAppSelector((state) => state.app.theme);
  const [customePhoneNumber, setCustomePhoneNumber] = useState<string>('');
  const classPhoneInputCustom =
    selected === ThemeType.DARK
      ? `!bg-[#060B11]  text-[#fff]  !border-[#424242]`
      : `!bg-[#ffffff]  text-[#090C08]  !border-1-[#d9d9d9]`;

  function handlePhoneChange(
    value: string,
    country: any,
    event: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string
  ): void {
    const formattedPhoneNumber = `+(${country.dialCode})${formattedValue
      .replace(`+${country.dialCode}`, '')
      .replace('(', '')
      .replace(')', '')}`;
    setCustomePhoneNumber(formattedPhoneNumber);
    form?.setFieldValue('phone', formattedPhoneNumber);
  }

  return (
    <Card>
      {autoFill ? (
        <Row gutter={24}>
          <Col span={6} style={{ marginBottom: '24px' }}>
            <Checkbox
              onChange={(e) => {
                autoFill(e.target.checked);
              }}
            >
              {t('common:form.auto_fill')}
            </Checkbox>
          </Col>
        </Row>
      ) : null}

      <Row gutter={24}>
        <Col span={6}>
          <Form.Item
            label={t('common:form.title')}
            name="title"
            rules={[
              {
                required: isRequired('title', required),
                message: t('common:error.required_message', { content: t('common:form.title') })
              }
            ]}
          >
            <Select options={bookerTitleOptions} placeholder="Select title" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label={t('common:form.first_name')}
            name="firstName"
            rules={[
              {
                required: isRequired('firstName', required),
                message: t('common:error.required_message', {
                  content: t('common:form.first_name')
                })
              }
            ]}
          >
            <Input name="firstName" />
          </Form.Item>
        </Col>
        {!shorten && (
          <Col span={6}>
            <Form.Item
              label={t('common:form.middle_name')}
              name="middleInitial"
              rules={[
                {
                  required: isRequired('middleInitial', required),
                  message: t('common:error.required_message', {
                    content: t('common:form.middle_name')
                  })
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        )}
        <Col span={6}>
          <Form.Item
            label={t('common:form.last_name')}
            name="lastName"
            rules={[
              {
                required: isRequired('lastName', required),
                message: t('common:error.required_message', {
                  content: t('common:form.last_name')
                })
              }
            ]}
          >
            <Input name="lastName" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label={t('common:form.email')}
            name="email"
            rules={[
              {
                required: isRequired('email', required),
                type: 'email',
                message: t('common:error.required_message', {
                  content: t('common:form.email')
                })
              }
            ]}
          >
            <Input name="email" />
          </Form.Item>
        </Col>
        {(!shorten || isOffer) && (
          <Col span={12}>
            <Form.Item
              label={t('common:form.phone')}
              name="phone"
              rules={[
                {
                  required: isRequired('phone', required),
                  message: t('common:error.required_message', {
                    content: t('common:form.phone')
                  })
                },
                { min: 10, message: t('common:form.invalid_phone_number') }
              ]}
            >
              <PhoneInput
                preferredCountries={['de']}
                buttonClass={classPhoneInputCustom}
                dropdownClass={clsx(
                  'selected !== ThemeType.DARK?!bg-[#fff]:!bg-[rgb(40,46,54)]',
                  classPhoneInputCustom
                )}
                inputClass={classPhoneInputCustom}
                inputStyle={{ height: '32px' }}
                country={'de'}
                value={customePhoneNumber}
                onChange={handlePhoneChange}
              />
            </Form.Item>
          </Col>
        )}

        {!shorten && (
          <Col span={8}>
            <Form.Item
              label={t('common:form.date_of_birth')}
              name="birthDate"
              rules={[
                {
                  required: isRequired('birthDate', required),
                  message: t('common:error.required_message', {
                    content: t('common:form.date_of_birth')
                  })
                }
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </Col>
        )}

        {!shorten && (
          <Col span={8}>
            <Form.Item
              label={t('common:form.gender')}
              name="gender"
              rules={[
                {
                  required: isRequired('gender', required),
                  message: t('common:error.required_message', {
                    content: t('common:form.gender')
                  })
                }
              ]}
            >
              <Select options={genderOptions} placeholder="Select gender" />
            </Form.Item>
          </Col>
        )}
        {!shorten && (
          <Col span={8}>
            <Form.Item
              label={t('common:form.language')}
              name="preferredLanguage"
              rules={[
                {
                  required: isRequired('preferredLanguage', required),
                  message: t('common:error.required_message', {
                    content: t('common:form.language')
                  })
                }
              ]}
            >
              <Select options={formatObjectList(languages, '@')} showSearch />
            </Form.Item>
          </Col>
        )}

        {!shorten && (
          <Col span={12}>
            <Form.Item
              label={t('common:form.company_name')}
              name="companyName"
              rules={[
                {
                  required: isRequired('companyName', required),
                  message: t('common:error.required_message', {
                    content: t('common:form.company_name')
                  })
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        )}
        {!shorten && (
          <Col span={12}>
            <Form.Item
              label={t('common:form.tax_id')}
              name="taxId"
              rules={[
                {
                  required: isRequired('taxId', required),
                  message: t('common:error.required_message', {
                    content: t('common:form.tax_id')
                  })
                },
                { pattern: new RegExp(/^[0-9]+$/), message: 'The input is not number' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        )}

        {!shorten && (
          <Col span={24}>
            <Form.Item
              label={t('common:form.guest_comment')}
              name="guestComment"
              rules={[
                {
                  required: isRequired('bookerComment', required),
                  message: t('common:error.required_message', {
                    content: t('common:form.guest_comment')
                  })
                }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        )}
      </Row>
    </Card>
  );
};
export default IndexComponent;
