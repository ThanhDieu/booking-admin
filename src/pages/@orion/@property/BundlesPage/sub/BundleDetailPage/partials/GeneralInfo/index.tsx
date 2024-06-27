/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, Col, Form, FormInstance, Input, Row, Segmented, Typography } from 'antd';
import { SegmentedValue } from 'antd/es/segmented';
import { TextEditor } from 'components/common';
import { FuncType, ThemeType, filterBundle } from 'configs/const/general';
import { languages } from 'constant';
import { useLocaleSegmentOption } from 'hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'store';
import { InitialBundleType } from '../../types';
import ActivitiesSelectBox from './ActivitiesSelectBox';
import LandscapesSelectBox from './LandscapesSelectBox';
import MediaSelectBox from './MediaSelectBox';
import TagsSelectBox from './TagsSelectBox';
import SpecialBundlesSelectBox from './SpecialBundlesSelectBox';

export interface GeneralInfoPartialProps {
  code?: string;
  editPermission?: boolean;
  name?: string;
  isMultiple?: boolean;
}

interface GeneralInfoProps {
  pageAction: (typeof FuncType)[keyof typeof FuncType];
  code?: string;
  form: FormInstance<InitialBundleType>;
  errorTileList: string[];
}

function GeneralInfo({
  pageAction,
  code = '',
  form,

  errorTileList
}: GeneralInfoProps) {
  const { t } = useTranslation(['common', 'bundles']);
  const statusWatcher = Form.useWatch('status', form);
  const { selected } = useAppSelector((state) => state.app.theme);
  const { segmentOptions, mandatoryLocaleList } = useLocaleSegmentOption();

  const [editPermission, isReadOnly] = useMemo(() => {
    if (pageAction !== FuncType.UPDATE) return [];

    if (statusWatcher === filterBundle.APPROVED) {
      return [false, true];
    }
    return [];
  }, [statusWatcher]);

  const handleLocaleChange = async (localeVal: SegmentedValue) => {
    form.setFieldValue('locale', localeVal);

    form.setFieldValue(['title', localeVal], form.getFieldValue(['title', localeVal]) || '');
    form.setFieldValue(
      ['description', localeVal],
      form.getFieldValue(['description', localeVal]) || ''
    );
  };

  return (
    <Card>
      <Row gutter={24}>
        {errorTileList.length > 0 && (
          <Typography.Text className="text-xs text-[#ff4d4f] pl-3">
            {t('common:error.required_select_language') + ' '}
            {errorTileList.map((lang, idx) => {
              return `${(languages as any)[lang]} ${idx !== errorTileList.length - 1 ? ', ' : ''}`;
            })}
          </Typography.Text>
        )}
        <Col span={24} className="mb-2">
          <Form.Item noStyle name={'locale'} dependencies={['title']}>
            <Segmented options={segmentOptions} onChange={handleLocaleChange} />
          </Form.Item>
        </Col>

        <Col span={24}>
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
                        <Input readOnly={isReadOnly} />
                      </Form.Item>
                    );
                  })
                : null
            }
          </Form.Item>
        </Col>

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
                        <TextEditor
                          readOnly={isReadOnly}
                          className="bundle-text-editor"
                          style={{ backgroundColor: selected === ThemeType.DARK ? '#000' : '#fff' }}
                        />
                      </Form.Item>
                    );
                  })
                : null
            }
          </Form.Item>
        </Col>
        <SpecialBundlesSelectBox editPermission={editPermission} />
        <ActivitiesSelectBox editPermission={editPermission} />
        <ActivitiesSelectBox
          editPermission={editPermission}
          name="mainActivity"
          isMultiple={false}
        />
        <LandscapesSelectBox editPermission={editPermission} />
        <TagsSelectBox code={code} editPermission={editPermission} />

        <MediaSelectBox form={form} isReadOnly={isReadOnly} />
      </Row>
    </Card>
  );
}

export default GeneralInfo;
