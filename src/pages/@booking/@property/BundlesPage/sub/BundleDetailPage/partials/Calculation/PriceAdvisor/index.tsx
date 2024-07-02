/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalculatorOutlined, UndoOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  FormInstance,
  Input,
  Modal,
  Row,
  Select,
  SelectProps,
  Space,
  Tooltip
} from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { DATE_FORMAT_1 } from 'configs/const/format';
import { FuncType } from 'configs/const/general';
import dayjs from 'dayjs';
import { useAsyncAction, useDetailDisplay, useDidMount } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { getOwnHotelInfo, getRatesAdvisor } from 'services/@HQrevenue';
import { OwnHotelInfoType } from 'services/@HQrevenue/type';
import { getUnitGroupsByIdService } from 'services/UnitGroups';
import { UnitGroupDetailAppType } from 'services/UnitGroups/type';
import { capitalize } from 'utils/text';
import { calculatePrice } from '../../../helper';
import { InitBaseType, InitialBundleType } from '../../../types';
import TableSheet from './TableSheet';
import { useModifiedData } from './hook';
import { useTranslation } from 'react-i18next';
import { getApiTokenHQrevenue } from 'services/@strapi/strapiService';
import { HQrevenueInfoType, ResponseStrapiType } from 'services/@strapi/type';

export interface PricingAdvisorProps {
  pageAction: (typeof FuncType)[keyof typeof FuncType];
  form: FormInstance<InitialBundleType>;
  code?: string;
  period?: {
    start: number;
    end: number;
  };
}

export default function PricingAdvisor({
  pageAction,
  code = '',
  form,
  period
}: PricingAdvisorProps) {
  const { t } = useTranslation(['bundles', 'common']);
  const [showModal, setShowModal] = useState(false);
  const [channelIdSelected, setChannelIdSelected] = useState<number>();
  const [loading, setLoading] = useState<boolean>();

  const [formPA] = useForm<{ unit_group_advisor: string; price_advisor: number }>();
  const priceWatcher = useWatch('price_advisor', formPA);
  const baseWatcher = Form.useWatch<InitBaseType[]>('base', form);

  //* Handle api service
  // Action
  const [fetchUnitGroupById, stateUnitGroupById] = useAsyncAction(getUnitGroupsByIdService);
  const [fetchApiTokenHQrevenue, stateApiTokenHQrevenue] = useAsyncAction(getApiTokenHQrevenue);
  const [fetchOwnHotelInfo, stateOwnHotelInfo] = useAsyncAction(getOwnHotelInfo);
  const [fetchRatesAdvisor, stateRatesAdvisor] = useAsyncAction(getRatesAdvisor, {
    onSuccess: () => {
      setLoading(false);
    },
    onFailed: () => {
      setLoading(false);
    }
  });

  // Data
  const apiTokenHQrevenueData = useMemo(() => {
    if (!stateApiTokenHQrevenue || stateApiTokenHQrevenue?.data?.status !== 200) return;
    const responseStrapi = stateApiTokenHQrevenue?.data?.data as any as ResponseStrapiType;
    const apiToken = responseStrapi.data.flatMap(
      (item) => (item.attributes as HQrevenueInfoType).entries
    );

    return apiToken;
  }, [stateApiTokenHQrevenue?.data?.data]);

  const ownHotelInfoData = useMemo(() => {
    if (!stateOwnHotelInfo || stateOwnHotelInfo?.data?.status !== 200) return;
    return stateOwnHotelInfo?.data?.data as any as OwnHotelInfoType;
  }, [stateOwnHotelInfo?.data?.data]);

  const channels = useMemo(() => {
    if (ownHotelInfoData) return ownHotelInfoData?.channels;
  }, [ownHotelInfoData]);

  const competitors = useMemo(() => {
    if (ownHotelInfoData) return ownHotelInfoData?.competitors;
  }, [ownHotelInfoData]);

  // Call
  useDidMount((controller) => {
    fetchApiTokenHQrevenue(controller?.signal);
  }, []);

  useDidMount(
    (controller) => {
      if (pageAction !== FuncType.UPDATE && apiTokenHQrevenueData && apiTokenHQrevenueData.length) {
        const token = apiTokenHQrevenueData.find((item) => item.name === code);
        token && fetchOwnHotelInfo(token?.value, controller?.signal);
      }
    },
    [apiTokenHQrevenueData]
  );

  useDidMount(
    (controller) => {
      if (
        pageAction !== FuncType.UPDATE &&
        baseWatcher &&
        baseWatcher.length &&
        baseWatcher[0].unit_group
      ) {
        fetchUnitGroupById(baseWatcher[0].unit_group, controller?.signal);
      }
    },
    [!!baseWatcher && !!baseWatcher.length && baseWatcher[0].unit_group]
  );

  useDidMount(
    (controller) => {
      if (
        period &&
        channelIdSelected &&
        competitors &&
        competitors.length &&
        apiTokenHQrevenueData &&
        apiTokenHQrevenueData.length
      ) {
        const { start, end } = period;

        if (start && end) {
          const start_date = dayjs.unix(start).format(DATE_FORMAT_1) || '';
          const end_date = dayjs.unix(end).format(DATE_FORMAT_1) || '';

          setLoading(true);

          const hotelIds = competitors?.map((hotel) => `&HotelIds=${hotel.id}`).join('');
          const query = `channelId=${channelIdSelected}&startTargetDate=${start_date}&endTargetDate=${end_date}${hotelIds}`;
          const token = apiTokenHQrevenueData.find((item) => item.name === code);

          token && fetchRatesAdvisor(query, token.value, controller?.signal);
        }
      }
    },
    [period, channelIdSelected, competitors, apiTokenHQrevenueData]
  );

  const modifiedData = useModifiedData(stateRatesAdvisor, 10);
  const priceAdvisorData = useMemo(() => {
    if (modifiedData && modifiedData.length && competitors && competitors.length) {
      const mappedData = modifiedData?.map((item) => {
        const matchingCompetitor = competitors?.find(
          (competitor) => competitor.id === item.hotelId
        );
        return {
          ...item,
          hotelName: matchingCompetitor ? matchingCompetitor.name : 'Unknown Hotel'
        };
      });
      return mappedData;
    }
  }, [modifiedData, competitors]);

  const unitGroupSelected = useDetailDisplay<UnitGroupDetailAppType>(stateUnitGroupById);
  //* End handle api service

  const handleModalSubmit = () => {
    if (baseWatcher && baseWatcher.length) {
      const { standard, overwrite } = baseWatcher[0];
      const minOverwrite = (standard || 0) * 0.3;
      const newOverwrite = priceWatcher < minOverwrite ? minOverwrite : priceWatcher || overwrite;

      form.setFieldValue('base', [
        {
          ...baseWatcher[0],
          overwrite: newOverwrite,
          discount: calculatePrice(standard, newOverwrite),
          price: newOverwrite
        }
      ]);
    }
    setShowModal(false);
  };

  const handleChangeChanelId = (value: number) => {
    value && setChannelIdSelected(value);
  };

  const initialValues = {
    unit_group_advisor: '',
    price_advisor: 0
  };

  useEffect(() => {
    if (baseWatcher && baseWatcher.length && unitGroupSelected)
      formPA.setFieldsValue({
        unit_group_advisor: unitGroupSelected.title,
        price_advisor: baseWatcher[0].price
      });
  }, [baseWatcher, unitGroupSelected]);

  const chanelIdsOptions: SelectProps['options'] = useMemo(
    () =>
      channels?.map((chanelId) => ({
        label: capitalize(chanelId?.name?.toLowerCase()),
        value: chanelId?.id
      })),
    [channels]
  );

  return (
    <>
      <Col span={16} hidden={pageAction === FuncType.UPDATE || !period?.start}>
        <div className="flex items-center justify-end w-full h-full">
          <Tooltip
            title={!!baseWatcher && !baseWatcher[0]?.rate_plan && 'Please selected base bundle'}
            destroyTooltipOnHide={!!baseWatcher && !baseWatcher[0]?.rate_plan}
          >
            <Button
              className="leading-none mr-9"
              icon={<CalculatorOutlined />}
              onClick={() => setShowModal(true)}
              disabled={!!baseWatcher && !baseWatcher[0]?.rate_plan}
            >
              {t('bundles:price_advisor')}
            </Button>
          </Tooltip>
        </div>
      </Col>

      {showModal ? (
        <Modal
          width={priceAdvisorData && priceAdvisorData.length ? 'auto' : '50%'}
          style={{ minWidth: 768, maxWidth: 1280 }}
          title={t('bundles:price_advisor')}
          open={showModal}
          centered
          onCancel={() => setShowModal(false)}
          footer={null}
        >
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Select
              style={{ width: 200 }}
              onChange={handleChangeChanelId}
              options={chanelIdsOptions}
              loading={stateOwnHotelInfo.loading}
              placeholder={t('bundles:tooltip_select_bundle')}
            />

            <TableSheet
              data={priceAdvisorData || []}
              loading={loading}
              form={formPA}
              watchHook={priceWatcher}
            />

            <Form form={formPA} initialValues={initialValues} layout="vertical">
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item name={'unit_group_advisor'} label={t('bundles:base_bundle')}>
                    <Input readOnly />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name={'price_advisor'} label={t('bundles:price')}>
                    <Input readOnly />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Form.Item label={' '}>
                    <Button
                      icon={<UndoOutlined />}
                      onClick={() => {
                        if (baseWatcher && baseWatcher.length) {
                          formPA.setFieldValue('price_advisor', baseWatcher[0].price);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label=" " className="flex justify-end">
                    <Space>
                      <Button onClick={() => setShowModal(false)}>{t('bundles:abort')}</Button>
                      <Button type="primary" onClick={handleModalSubmit}>
                        {t('bundles:apply_new_price')}
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Space>
        </Modal>
      ) : null}
    </>
  );
}
