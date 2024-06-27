/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Form, FormInstance, Input, Segmented, Typography } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { languages } from 'constant';
import { useLocaleSegmentOption } from 'hooks';
import { useTranslation } from 'react-i18next';

interface LocaleFormType {
  errorTileList: string[];
  form: FormInstance<any>;
  haveDescription?: boolean;
}
const LocaleForm = ({ errorTileList, form, haveDescription = false }: LocaleFormType) => {
  const { t } = useTranslation(['common']);
  const { segmentOptions, mandatoryLocaleList } = useLocaleSegmentOption();

  const handleLocaleChange = async (localeVal: SegmentedValue) => {
    form.setFieldValue('locale', localeVal);

    form.setFieldValue(['title', localeVal], form.getFieldValue(['title', localeVal]) || '');
    {
      haveDescription &&
        form.setFieldValue(
          ['description', localeVal],
          form.getFieldValue(['description', localeVal]) || ''
        );
    }
  };

  return (
    <div className=" my-5">
      <Col span={24} className="mb-2">
        <Form.Item noStyle name={'locale'} dependencies={['title']}>
          <Segmented options={segmentOptions} onChange={handleLocaleChange} />
        </Form.Item>
      </Col>
      {errorTileList.length > 0 && (
        <Typography.Text className="text-xs  text-[#ff4d4f] ">
          {t('common:error.required_select_language') + ' '}
          {errorTileList.map((lang, idx) => {
            return `${(languages as any)[lang]} ${idx !== errorTileList.length - 1 ? ', ' : ''}`;
          })}
        </Typography.Text>
      )}
      <Col span={12}>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.locale !== currentValues.locale}
        >
          {({ getFieldValue }) =>
            getFieldValue('title')
              ? Object.keys(getFieldValue('title'))?.map((localeKey) => {
                  return (
                    <Form.Item
                      key={`title-${localeKey}`}
                      hidden={getFieldValue('locale') !== localeKey}
                      name={['title', localeKey]}
                      label={t('common:table.title')}
                      rules={[
                        {
                          required: mandatoryLocaleList?.includes(localeKey),
                          message: t('common:form.please_enter_this_field')
                        }
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  );
                })
              : null
          }
        </Form.Item>
      </Col>

      {haveDescription && (
        <Col span={24}>
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.locale !== currentValues.locale}
          >
            {({ getFieldValue }) =>
              getFieldValue('description')
                ? Object.keys(getFieldValue('description'))?.map((localeKey) => {
                    return (
                      <Form.Item
                        key={`description-${localeKey}`}
                        hidden={getFieldValue('locale') !== localeKey}
                        name={['description', localeKey]}
                        label={t('common:table.description')}
                      >
                        <Input.TextArea />
                      </Form.Item>
                    );
                  })
                : null
            }
          </Form.Item>
        </Col>
      )}
    </div>
  );
};

export default LocaleForm;
