/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Col, Form, Input, InputNumber, Row, Space, Tag, Typography } from 'antd';
import { AddMediaComponent, GeneralFormComponent, TagFormItemComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import { tagType } from 'configs/const/general';
import { paths } from 'constant';
import { useAsyncAction, useDetailDisplay, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MediaStrapiType } from 'services/@strapi/type';
import { TagDetailAppType } from 'services/Tags/type';
import {
  createUnitGroupService,
  getUnitGroupsByIdService,
  updateUnitGroupService
} from 'services/UnitGroups';
import { UnitGroupDetailAppType, UnitGroupParamsType } from 'services/UnitGroups/type';
import { useAppSelector } from 'store';
import { getCurrencySymbol } from 'utils/currency';
import { formatDefaultSelected, revertValueOption } from 'utils/format';
import { validateMessages } from 'utils/validationForm';

const { Title } = Typography;
export const unitGroupsTypeData = ['Bedroom', 'Meeting room', 'Event space', 'Parking lot'];
export interface UnitDetailPageProps { }

function UnitDetailPage() {
  const { t, i18n } = useTranslation(['common', 'unitGroups']);
  const currentLanguage = i18n.language;

  const unitGroupsCode = useParams().id;
  const { currentViewObj } = useView();
  const { code: codeProperty, name: nameProperty } = currentViewObj;
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { data: mediaData } = useAppSelector((state) => state?.booking?.media);

  const [form] = Form.useForm();
  const mediaWatch = Form.useWatch('media', form);
  // Service area
  const [fetchUnitGroup, stateUnitGroup] = useAsyncAction(getUnitGroupsByIdService);

  //create
  const [createUnitGroup, createState] = useAsyncAction(createUnitGroupService, {
    onSuccess: () => {
      message.success('Success!', 2);
      navigate(`/${codeProperty}/${paths.inventory}/${paths.unitGroups}`, {
        replace: true
      });
    },
    onFailed: (error: any) => {
      if (error) message.error(error?.message, 2);
    }
  });

  //update
  const [updateUnitGroup, updateState] = useAsyncAction(updateUnitGroupService, {
    onSuccess: () => {
      message.success('Success!', 2);
    },
    onFailed: (error: any) => {
      if (error) message.error(error?.message, 2);
    }
  });

  const unitGroupApp = useDetailDisplay<UnitGroupDetailAppType>(stateUnitGroup);

  useDidMount((controller) => {
    if (unitGroupsCode) {
      fetchUnitGroup(unitGroupsCode, controller?.signal);
    }
  });

  // End service area

  // Form area

  const initialValue = {
    id: '',
    code: '',
    description: '',
    type: '',
    maxPersons: 0,
    priority: 0,
    media: []
  };

  const handleSubmit = () => {
    const formData = form.getFieldsValue();
    const params: UnitGroupParamsType = {
      // title: formData?.name,
      // description: formData?.description,
      tagIds: formData.tagIds?.length
        ? formData.tagIds?.map((tag: any) => revertValueOption(tag.value || tag)?.value)
        : [],
      code: formData?.code,
      // maxPersons: formData?.maxPersons,
      propertyId: codeProperty || '',
      media: formData?.media?.length
        ? formData?.media.map((item: MediaStrapiType) => item.url)
        : [],
      maximumDiscount: formData?.maximumDiscount,
      minimumPrice: formData?.minimumPrice
    };

    if (unitGroupApp?.extId) updateUnitGroup(unitGroupApp.extId, params);
    else createUnitGroup(params);
  };

  const foundMedia = useMemo(() => {
    return (
      mediaData?.filter((data: MediaStrapiType) =>
        unitGroupApp?.media?.some((media) => media === data?.url)
      ) || []
    );
  }, [mediaData, unitGroupApp]);
  useEffect(() => {
    if (unitGroupApp) {
      form.setFieldsValue({
        id: unitGroupApp?.extId,
        code: unitGroupApp.data?.code,
        description:
          unitGroupApp?.extendedData?.description[currentLanguage] ??
          unitGroupApp.description ??
          '',
        type: unitGroupApp.data?.type,
        maxPersons: unitGroupApp.data?.maxPersons,
        name: unitGroupApp?.extendedData?.name[currentLanguage] ?? unitGroupApp.name ?? '',
        tagIds: unitGroupApp.tags?.length
          ? formatDefaultSelected<TagDetailAppType>(unitGroupApp.tags, 'title', 'tagId')
          : [],
        media: foundMedia,
        maximumDiscount: unitGroupApp?.maximumDiscount,
        minimumPrice: unitGroupApp?.minimumPrice
      });
    }
  }, [unitGroupApp, foundMedia, currentLanguage]);

  const currencySymbol = useMemo(() => {
    return unitGroupApp?.property?.currency
      ? getCurrencySymbol(unitGroupApp?.property?.currency).symbol
      : '€';
  }, [unitGroupApp?.property?.currency && unitGroupApp?.property?.currency]);

  // UI
  useHelmet({
    title: `${t('unitGroups:unit_group')} / ${nameProperty}`
  });
  return (
    <PlainLayout
      headerprops={{
        title: unitGroupsCode
          ? `${t('unitGroups:edit_unit_group')} - ${unitGroupApp?.name}`
          : t('unitGroups:create_unit_group'),
        // onBack: () => navigate(`/${paths.account}/${paths.units}`, { replace: true }),
        extra: [
          <Button
            type="primary"
            key={'submit'}
            onClick={handleSubmit}
            disabled={updateState.loading || createState.loading}
          >
            {t('common:button.save')}
          </Button>,
          <Button
            key={'cancel'}
            onClick={() =>
              navigate(`/${codeProperty}/${paths.inventory}/${paths.unitGroups}`, { replace: true })
            }
            disabled={updateState.loading || createState.loading}
          >
            {t('common:button.close')}
          </Button>
        ]
      }}
      className={`bg-inherit`}
    >
      <Form
        name="unit-detail-form"
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={initialValue}
        className="mb-3"
        validateMessages={validateMessages}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item name="code" label={t('common:table.code')} rules={[{ required: true }]}>
              <Input disabled={unitGroupsCode ? true : false} />
            </Form.Item>
            <GeneralFormComponent
              span={24}
              status={unitGroupsCode ? ['name', 'description'] : []}
            />
          </Col>
          <Col span={12}>
            <AddMediaComponent form={form} watchHook={mediaWatch} />
            <Row gutter={24}>
              <Col span={24}>
                <Title level={3} className="inline-block font-medium mb-[8px]">
                  {t('unitGroups:inventory_attributes')}
                </Title>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={'maxPersons'}
                  label={t('unitGroups:max_persons')}
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    min={0}
                    className="w-full"
                    disabled={unitGroupsCode ? true : false}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                {/* <Form.Item name={'type'} label="Type" rules={[{ required: true }]}>
                  <Select options={unitGroupsTypeOption} disabled={unitGroupsCode ? true : false} />
                </Form.Item> */}
                <TagFormItemComponent
                  item={{ label: '', isRequired: false, name: 'tagIds' }}
                  propertyCode={codeProperty}
                  tagType={tagType.UNITGROUP}
                  form={form}
                  initialTags={unitGroupApp?.tags ?? []}
                />
              </Col>
              <Col span={6}>
                <Form.Item label={t('unitGroups:minimum_price')} name="minimumPrice">
                  <InputNumber addonAfter={currencySymbol} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label={t('unitGroups:maximum_discount')} name="maximumDiscount">
                  <InputNumber addonAfter="%" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={24} className="mt-[24px]">
          {unitGroupsCode && (
            <Col span={24}>
              <Row gutter={24}>
                <Col span={24}>
                  <Title level={3} className="inline-block font-medium mb-[8px]">
                    {t('unitGroups:units_of')}
                  </Title>
                </Col>
                <Col span={18} className="mb-6">
                  <Space size={[0, 8]} wrap>
                    {unitGroupApp?.units?.map((unit) => (
                      <Tag key={unit.extId} className="cursor-default">
                        {unit.name}
                      </Tag>
                    ))}
                  </Space>
                </Col>
              </Row>
            </Col>
          )}
        </Row>
      </Form>
    </PlainLayout>
  );
}

export default UnitDetailPage;
