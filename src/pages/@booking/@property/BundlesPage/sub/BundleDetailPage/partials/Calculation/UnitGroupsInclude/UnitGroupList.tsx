import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Form, FormInstance, FormListFieldData, Typography } from 'antd';
import { FuncType } from 'configs/const/general';
import { useAsyncAction, useDataDisplay, useDidMount } from 'hooks';
import { useMemo } from 'react';
import { getUnitGroupsByPropertyServiceV2 } from 'services/UnitGroups';
import { UnitGroupDetailAppType } from 'services/UnitGroups/type';
import { queryCase } from 'utils/queryParams';
import { InitBaseType, InitialBundleType } from '../../../types';
import UnitGroupItem from './UnitGroupItem';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

export interface UnitGroupListProps {
  pageAction: (typeof FuncType)[keyof typeof FuncType];
  category: 'base' | 'upgrade';
  code?: string;
  form: FormInstance<InitialBundleType>;
  period?: {
    start: number;
    end: number;
  };
}

export default function UnitGroupList({
  pageAction,
  category,
  code = '',
  form,
  period
}: UnitGroupListProps) {
  const { t } = useTranslation(['bundles']);
  const baseWatcher = Form.useWatch<InitBaseType[]>('base', form);
  const upgradeWatcher = Form.useWatch<InitBaseType[]>('upgrade', form);
  const periodsWatcher = Form.useWatch<Dayjs[][]>('periods', form) || [];

  //* Handle api service
  // Action
  /**
   * @param propertyId
   */
  const [fetchUnitGroups, stateUnitGroups] = useAsyncAction(getUnitGroupsByPropertyServiceV2);

  // Data
  const unitGroups = useDataDisplay<UnitGroupDetailAppType>(stateUnitGroups);

  // Call
  useDidMount(
    async (controller) => {
      if (periodsWatcher && periodsWatcher.length && periodsWatcher[0]) {
        if (!periodsWatcher[periodsWatcher.length - 1]) return;

        const flattenPeriods = periodsWatcher
          ?.flat()
          ?.map((period) => period && dayjs(period).unix())
          .join();
        const query = queryCase({
          propertyId: code,
          ratePlanInclude: true,
          periods: flattenPeriods,
          perPage: 100
        });
        code && fetchUnitGroups(query, controller?.signal);
      }
    },
    [periodsWatcher]
  );
  //* End Handle api service

  //* Handle interface
  // Render
  const renderBundleBase = useMemo(() => {
    return (
      <>
        <Col span={24}>
          <Title level={3} className="inline-block font-medium mb-[8px]">
            {t('bundles:unitGroup_and_ratePlan')}
          </Title>
        </Col>
        <Form.List name={category}>
          {(fields) =>
            fields?.map((field: FormListFieldData) => (
              <div className="w-full flex flex-wrap" key={field.name}>
                <UnitGroupItem
                  loading={stateUnitGroups.loading}
                  variant={category}
                  pageAction={pageAction}
                  form={form}
                  field={field}
                  watchHook={[baseWatcher]}
                  dependence={[period]}
                  data={unitGroups}
                />
              </div>
            ))
          }
        </Form.List>
      </>
    );
  }, [period?.start, unitGroups, baseWatcher]);

  const renderBundleUpgrades = useMemo(() => {
    const unitGroupBaseFounded = unitGroups?.find(
      (value) => baseWatcher && value?.extId === baseWatcher[0]?.unit_group
    );

    const unitGroupUpgradeFounded = unitGroups
      ?.map((el1) => ({
        item: el1,
        match: upgradeWatcher?.some((el2) => el2.unit_group === el1.extId)
      }))
      .filter((i) => i.match)
      .map((i) => i.item);

    const baseRank = unitGroupBaseFounded && unitGroupBaseFounded?.rank;
    const upgradeRank = unitGroupUpgradeFounded ? unitGroupUpgradeFounded.map((i) => i.rank) : [];

    const maxRank = unitGroups?.reduce((rank, currentObject) => {
      return Math.max(rank, currentObject?.rank || 0);
    }, 0);
    const isRankHighest =
      baseRank === maxRank && unitGroups?.filter((item) => item.rank === maxRank);

    return (
      <>
        <Col span={24}>
          <Title level={3} className="inline-block font-medium mb-[8px]">
            {t('bundles:upgrade')}
          </Title>
        </Col>

        {pageAction === FuncType.UPDATE && upgradeWatcher && !(upgradeWatcher as [])?.length ? (
          <Col span={24} className="mb-6">
            <Text>{t('bundles:no_item')}</Text>
          </Col>
        ) : null}

        {(baseWatcher && baseRank && !isRankHighest) ||
        (isRankHighest && isRankHighest.length > 1) ? (
          <Form.List name={category}>
            {(fields, { add, remove }) => {
              return (
                <>
                  {fields?.map((field: FormListFieldData) => (
                    <div className="w-full flex flex-wrap" key={field?.name}>
                      <UnitGroupItem
                        variant={category}
                        pageAction={pageAction}
                        form={form}
                        field={field}
                        fields={fields}
                        watchHook={[upgradeWatcher]}
                        dependence={[period, baseRank, upgradeRank]}
                        data={unitGroups}
                      />
                      {pageAction !== FuncType.UPDATE ? (
                        <Col>
                          <MinusCircleOutlined
                            className="absolute left-0 top-1/2 -translate-y-1/2"
                            onClick={() => {
                              remove(field.name);
                              const newArr = form
                                .getFieldValue('upgrade')
                                ?.map((item: InitBaseType, index: number) => {
                                  return {
                                    ...item,
                                    category: index + 1
                                  };
                                });

                              form.setFieldValue('upgrade', newArr);
                            }}
                          />
                        </Col>
                      ) : null}

                      {fields?.length > 1 && field.name !== fields.length - 1 ? (
                        <Divider className="mt-0" />
                      ) : null}
                    </div>
                  ))}
                  {pageAction !== FuncType.UPDATE ? (
                    upgradeWatcher?.length !==
                    unitGroups?.filter((unitGroup) => (unitGroup?.rank || 0) > baseRank)?.length ? (
                      <div className="w-full">
                        <Col span={8}>
                          <Form.Item>
                            <Button
                              disabled={
                                upgradeWatcher &&
                                upgradeWatcher.length > 0 &&
                                !upgradeWatcher[upgradeWatcher?.length - 1]?.unit_group
                              } //unitgroup field must be filled before click add
                              type="dashed"
                              onClick={() => {
                                add({
                                  category:
                                    fields.length < 1 ? 1 : fields[fields?.length - 1]?.name + 2,
                                  standard: 0,
                                  discount: 0,
                                  price: 0
                                });
                              }}
                              block
                              icon={<PlusOutlined />}
                            >
                              {t('bundles:add_item')}
                            </Button>
                          </Form.Item>
                        </Col>
                      </div>
                    ) : null
                  ) : null}
                </>
              );
            }}
          </Form.List>
        ) : (
          <Col span={24} className="mb-6">
            <Text>
              {baseRank
                ? isRankHighest && isRankHighest.length === 1
                  ? t('bundles:cannot_upgrade')
                  : ''
                : t('bundles:at_least_one_unit_group')}
            </Text>
          </Col>
        )}
      </>
    );
  }, [period?.start, unitGroups, baseWatcher, upgradeWatcher]);
  //* End handle interface

  return category === 'base' ? renderBundleBase : renderBundleUpgrades;
}
