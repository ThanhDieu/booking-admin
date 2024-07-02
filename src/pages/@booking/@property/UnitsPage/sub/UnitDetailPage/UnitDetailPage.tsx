/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Button, Col, Form, InputNumber, Row, Select, SelectProps, Typography } from 'antd';
import { GeneralFormComponent, TagFormItemComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import { tagType } from 'configs/const/general';
import { paths } from 'constant';
import { useAsyncAction, useDataDisplay, useDetailDisplay, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TagDetailAppType } from 'services/Tags/type';
import { getUnitGroupsByPropertyServiceV2 } from 'services/UnitGroups';
import { UnitGroupDetailAppType } from 'services/UnitGroups/type';
import { createUnitsService, getUnitByIdService, updateUnitsService } from 'services/Units';
import { UnitDetailAppType, UnitParamsType } from 'services/Units/type';
import { formatDefaultSelected, formatSelectOption, revertValueOption } from 'utils/format';
import { queryCase } from 'utils/queryParams';

const { Title } = Typography;

export interface UnitDetailPageProps { }

function UnitDetailPage() {
  const { t, i18n } = useTranslation(['common', 'units']);
  const currentLanguage = i18n.language;

  const unitId = useParams().id;
  const { currentViewObj } = useView();
  const { code: codeProperty, name: nameProperty } = currentViewObj;
  const navigate = useNavigate();
  const { message } = App.useApp();
  // Service area
  const [fetchUnit, stateUnit] = useAsyncAction(getUnitByIdService);
  const [fetchUnitGroupsByProperty, stateUnitGroupsByProperty] = useAsyncAction(
    getUnitGroupsByPropertyServiceV2
  );

  const [updateUnit, updateState] = useAsyncAction(updateUnitsService, {
    onSuccess: () => {
      message.success('Updated!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });
  const [createUnit, createState] = useAsyncAction(createUnitsService, {
    onSuccess: () => {
      navigate(`/${codeProperty}/${paths.inventory}/${paths.units}`, { replace: true });
      message.success('Updated!', 2);
    },
    onFailed: () => {
      // message.error('Failed!', 2);
    }
  });

  // data
  const unitApp = useDetailDisplay<UnitDetailAppType>(stateUnit);

  const unitGroupsPropertyAppList =
    useDataDisplay<UnitGroupDetailAppType>(stateUnitGroupsByProperty);

  useDidMount((controller) => {
    if (unitId) {
      fetchUnit(unitId, controller?.signal);
    }
    const query = queryCase({ propertyId: codeProperty, perPage: 20 });
    if (codeProperty) fetchUnitGroupsByProperty(query, controller?.signal);
  });
  // End service area

  // Form area
  const [form] = Form.useForm();

  const initialValue = {
    name: '',
    description: '',
    unitGroupId: '',
    maxPersons: 0
  };

  const handleSubmit = () => {
    const formData = form.getFieldsValue();
    const param: UnitParamsType = {
      // title: formData.name,
      // comment: formData.description,
      size: formData.size,
      // unitGroupId: revertValueOption(formData.unitGroupId?.value || formData.unitGroupId),
      // propertyId: codeProperty,
      // code: formData.name,
      // maxPersons: formData.maxPersons,
      tagIds: formData.tagIds?.length
        ? formData.tagIds?.map((tag: any) => revertValueOption(tag.value || tag)?.value)
        : []
    };

    if (unitId) {
      updateUnit(unitId, param);
    } else {
      createUnit(param);
    }
  };

  useEffect(() => {
    if (unitApp) {
      form.setFieldsValue({
        name: unitApp?.title || unitApp?.name,

        description:
          unitApp?.extendedData?.description[currentLanguage] ?? unitApp?.data?.description ?? '',
        unitGroupId: unitApp?.unitGroup
          ? formatDefaultSelected<UnitGroupDetailAppType>(unitApp?.unitGroup, 'name', 'extId')
          : '',
        maxPersons: unitApp?.maxPersons || unitApp?.data?.maxPersons,
        size: unitApp?.size,
        tagIds: unitApp.tags?.length
          ? formatDefaultSelected<TagDetailAppType>(unitApp.tags, 'title', 'tagId')
          : []
      });
    }
  }, [unitApp, unitGroupsPropertyAppList, currentLanguage]);
  // End form area

  // Select option area
  const unitGroupsOption: SelectProps['options'] = useMemo(
    () =>
      formatSelectOption<UnitGroupDetailAppType>(unitGroupsPropertyAppList || [], 'name', 'extId'),
    [unitGroupsPropertyAppList]
  );

  // End select option area

  useHelmet({
    title: `${t('units:unit')} / ${nameProperty}`
  });

  return (
    <PlainLayout
      headerprops={{
        title: unitId
          ? `${t('units:edit_unit')} - ${unitApp?.name as string}`
          : t('units:create_unit'),
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
              navigate(`/${codeProperty}/${paths.inventory}/${paths.units}`, { replace: true })
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
      >
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <GeneralFormComponent status={unitId ? ['name', 'description'] : []} span={24} />
          </Col>

          <Col span={12}>
            <Row gutter={24}>
              <Col span={24}>
                <Title level={3} className="inline-block font-medium mb-[8px]">
                  {t('units:unit_group_and_occupancy')}
                </Title>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'unitGroupId'}
                  label={t('units:assign_unit_to_unit_group')}
                  rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
                >
                  <Select options={unitGroupsOption} showSearch disabled={Boolean(unitId)} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={'maxPersons'}
                  label={t('units:max_persons')}
                  rules={[{ required: true, message: t('common:form.please_enter_this_field') }]}
                >
                  <InputNumber className="w-full" min={0} disabled={Boolean(unitId)} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={'size'} label="Size">
                  <InputNumber className="w-full" min={0} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <TagFormItemComponent
                  propertyCode={codeProperty}
                  tagType={tagType.UNIT}
                  item={{ label: t('units:unit_tag'), isRequired: false, name: 'tagIds' }}
                  initialTags={unitApp?.tags ?? []}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </PlainLayout>
  );
}

export default UnitDetailPage;
