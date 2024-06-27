/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CalendarOutlined,
  EditOutlined,
  RightOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Form,
  InputNumber,
  List,
  Popover,
  Skeleton,
  Typography,
  App,
  Spin,
  Space,
  Tag
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import clsx from 'clsx';
import { ViewMode } from 'configs/const/auth';
import { DATE_FORMAT_3 } from 'configs/const/format';
import { FuncType, ThemeType, filterBundle } from 'configs/const/general';
import { paths } from 'constant';
import dayjs from 'dayjs';
import { useAsyncAction, useDetailDisplay, useDidMount } from 'hooks';
import useView from 'hooks/useView';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getBundleSettingService, updateBundleSettingService } from 'services/Bundle';
import { BundleListType, BundleSettingType } from 'services/Bundle/type';
import { useAppDispatch, useAppSelector } from 'store';
import { getBundleListThunk } from 'store/orion/Bundle';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { capitalize } from 'utils/text';

const BundleIBEDisplayList = () => {
  const { t, i18n } = useTranslation(['bundles', 'common']);
  const navigate = useNavigate();

  const [openModalEdit, setOpenModalEdit] = useState<string>('');
  const [form] = useForm();
  const { currentViewObj, currentView } = useView();
  const dispatch = useAppDispatch();
  const { selected } = useAppSelector((state) => state.app.theme);
  const { bundlesList, loading } = useAppSelector((state) => state.orion.bundle);
  const PERPAGE = 5;
  const [currentLocation, setCurrentLocation] = useState<QueryCaseType>({
    perPage: PERPAGE,
    currentPage: 1,
    isExpired: 'false'
  });
  const { message } = App.useApp();

  //SERVICE
  const [getBundleSetting, stateGetBunleSetting] = useAsyncAction(getBundleSettingService);
  const [updateBundleSetting, stateUpdateBundleSetting] = useAsyncAction(
    updateBundleSettingService,
    {
      onSuccess: () => {
        getBundleSetting(currentView !== ViewMode.Account ? currentViewObj?.code : undefined);
        message.success('Updated!', 2);
        setOpenModalEdit('');
      },
      onFailed: (error: any) => {
        if (error) message.error(capitalize(error?.message), 3);
      }
    }
  );

  const handleChangeLocation = (
    {
      currentPage = currentLocation.currentPage,
      perPage = currentLocation.perPage,
      isExpired = currentLocation.isExpired
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    const queries = queryCase({
      propertyId: currentView === ViewMode.Account ? '' : currentViewObj?.code || '',
      currentPage,
      perPage,
      isExpired,
      isHomePage: currentView === ViewMode.Account ? 'true' : '',
      isHotelPage: currentView !== ViewMode.Account ? 'true' : ''
    });

    dispatch(getBundleListThunk({ queries, signal: controller?.signal }));

    setCurrentLocation({
      ...currentLocation,
      currentPage,
      perPage
    });
  };

  const bundleSettingData = useDetailDisplay<BundleSettingType>(stateGetBunleSetting);

  const initialValue = {
    maxCount:
      currentView === ViewMode.Account
        ? bundleSettingData?.homePageMax
        : bundleSettingData?.hotelPageMax
        ? bundleSettingData?.hotelPageMax
        : 0
  };

  const onSubmitEditForm = (formData: any) => {
    const payload = {
      [currentView === ViewMode.Account ? 'homePageMax' : 'hotelPageMax']: formData.maxCount
    };
    updateBundleSetting(
      payload,
      currentView !== ViewMode.Account ? currentViewObj.code : undefined
    );
  };

  const contentEditMaxCount = (
    <Spin spinning={stateUpdateBundleSetting.loading}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmitEditForm}
        className="form-show-bundle-ibe"
        initialValues={initialValue}
      >
        <Form.Item label="Change max count:" name="maxCount">
          <InputNumber min={1} />
        </Form.Item>
        <Button
          size="small"
          type="primary"
          htmlType="submit"
          disabled={stateUpdateBundleSetting.loading}
        >
          Submit
        </Button>
      </Form>
    </Spin>
  );

  useDidMount(
    (controller) => {
      handleChangeLocation({});
      getBundleSetting(
        currentView !== ViewMode.Account ? currentViewObj?.code : undefined,
        controller?.signal
      );
      openModalEdit === FuncType.UPDATE && form.setFieldsValue(initialValue);
    },
    [currentView]
  );

  const renderTag = (data: BundleListType) => {
    let color = 'green';

    if (data?.status === filterBundle.REJECTED) color = 'red';
    if (data?.status === filterBundle.PENDING) color = 'blue';
    if (data?.status === filterBundle.EXPIRED) color = 'gold';

    return (
      <Space size={0}>
        {(data?.status === filterBundle.REJECTED || data?.status === filterBundle.EXPIRED) && (
          <Tag color={color} className="ml-2">
            {capitalize(data?.status || '')}
          </Tag>
        )}
        <Tag color="green">
          {data?.online ? t('common:general.published') : t('common:general.unpublished')}
        </Tag>
        {data.disabled ? (
          <Tag color={'red'} className="">
            {capitalize(filterBundle.INVALID)}
          </Tag>
        ) : null}
      </Space>
    );
  };

  return (
    <Badge.Ribbon
      text={
        <Typography.Text className="text-white">
          <Badge
            className="mt-[-3px]"
            size="small"
            count={
              stateGetBunleSetting.loading ? (
                <Spin />
              ) : (
                `${bundlesList?.pagination?.total || 0}/${
                  !bundleSettingData
                    ? 0
                    : currentView === ViewMode.Account
                    ? bundleSettingData?.homePageMax
                    : bundleSettingData?.hotelPageMax
                }`
              )
            }
          />{' '}
          <Popover
            onOpenChange={(open) => setOpenModalEdit(open ? FuncType.UPDATE : '')}
            trigger={'click'}
            arrow={false}
            content={contentEditMaxCount}
          >
            <EditOutlined />
          </Popover>
        </Typography.Text>
      }
      color="gold"
    >
      <Card
        title={
          <Space>
            <MenuUnfoldOutlined />
            <Typography.Text>
              {t(
                `${
                  currentView === ViewMode.Account
                    ? 'bundles:control_bundle_home_IBE_display'
                    : 'bundles:control_bundle_hotel_IBE_display'
                }`
              )}
            </Typography.Text>
          </Space>
        }
        size="small"
      >
        <List
          loading={stateGetBunleSetting.loading}
          pagination={
            bundlesList?.pagination?.total && bundlesList?.pagination?.total > PERPAGE
              ? {
                  position: 'bottom',
                  align: 'end',
                  size: 'small',
                  pageSize: PERPAGE,
                  total: bundlesList?.pagination?.total ? Number(bundlesList?.pagination.total) : 1,
                  showSizeChanger: false,
                  onChange: (value) => {
                    handleChangeLocation &&
                      handleChangeLocation({ ...currentLocation, currentPage: value });
                  },
                  current: currentLocation.currentPage
                }
              : false
          }
          size="small"
          dataSource={bundlesList?.data || []}
          renderItem={(item) => {
            return (
              <List.Item
                actions={[<RightOutlined key={'details'} />]}
                onClick={() => {
                  const { property, isTemplate } = item;
                  navigate(
                    `/${property?.extId}/${paths.bundles}/${
                      isTemplate ? paths.bundlesTemplate : paths.bundlesOverview
                    }/${item?.bundleId}`
                  );
                }}
                className={clsx(
                  'cursor-pointer',
                  selected !== ThemeType.DEFAULT ? 'hover:bg-[#565D67]' : 'hover:bg-slate-200'
                )}
              >
                <Skeleton title={false} loading={loading} active>
                  <List.Item.Meta
                    title={
                      <div className="flex justify-between pl-1">
                        <Typography.Text>
                          {' '}
                          {item?.extendedData?.title[i18n.language] ?? item?.name ?? ''}
                        </Typography.Text>
                        {renderTag(item)}
                      </div>
                    }
                    description={
                      <div>
                        <CalendarOutlined />{' '}
                        {item?.periods?.length > 0 && (
                          <Popover
                            title="Periods"
                            content={
                              <div className="flex flex-col gap-2">
                                {item?.periods?.map((period, idx) => (
                                  <Typography.Text className="text-xs" key={idx}>
                                    {`${dayjs(period?.start * 1000).format(DATE_FORMAT_3)}`} -{' '}
                                    {`${dayjs(period?.end * 1000).format(DATE_FORMAT_3)}`}{' '}
                                  </Typography.Text>
                                ))}
                              </div>
                            }
                          >
                            <Typography.Text className="font-light text-sm">
                              {`${dayjs(item?.periods[0]?.start * 1000).format(DATE_FORMAT_3)}`}-
                              {`${dayjs(item?.periods[0]?.end * 1000).format(DATE_FORMAT_3)}`}{' '}
                              {item?.periods?.length > 1 ? '...' : ''}
                            </Typography.Text>
                          </Popover>
                        )}
                      </div>
                    }
                  />
                </Skeleton>
              </List.Item>
            );
          }}
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default BundleIBEDisplayList;
