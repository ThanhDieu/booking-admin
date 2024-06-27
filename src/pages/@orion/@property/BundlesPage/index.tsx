/* eslint-disable @typescript-eslint/no-explicit-any */
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { App, Button, Space, Tooltip, TreeSelect } from 'antd';
import { ModalConfirmation, SearchComponent } from 'components/common';
import { PlainLayout } from 'components/layout';
import { ViewMode } from 'configs/const/auth';
import { FuncType, filterBundle } from 'configs/const/general';
import { COPYRIGHT, paths } from 'constant';
import { useAsyncAction, useDataDisplayV2, useDidMount, useHelmet } from 'hooks';
import useView from 'hooks/useView';
import { Fragment, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBundlesService, handleHolidayBundlesService } from 'services/Bundle';
import { BundleListType } from 'services/Bundle/type';
import { QueryCaseType, queryCase } from 'utils/queryParams';
import { displayRole } from 'utils/view';
import { BundleList } from './partials';
import ModalBundleList from './partials/ModalBundleList';

const PERPAGE = 5;
const BundlesPage = () => {
  const { t } = useTranslation(['common', 'holidayPackage', 'bundles', 'sidebar']);

  //* Declare variable global
  const { message } = App.useApp();
  const { currentView } = useView();
  const { name: nameProperty, code: codeProperty } = displayRole(currentView);
  const currentTypeBundle = useLocation().pathname.split('/')[3];
  const holidayPackage = useMemo(() => currentView === ViewMode.Account, [currentView]);

  const navigate = useNavigate();
  const [value, setValue] = useState<string>();
  const [openModalBundles, setOpenModalBundles] = useState<boolean>(false);
  const [openModalConfirm, setOpenModalConfirm] = useState<string>('');
  const [bundlesSelected, setBundlesSelected] = useState<string[]>();

  const [currentLocation, setCurrentLocation] = useState<QueryCaseType>({
    perPage: PERPAGE,
    currentPage: 1,
    adults: 0,
    arrival: '',
    departure: '',
    propertyId: !holidayPackage ? codeProperty : '',
    isTemplate: !holidayPackage ? false : undefined,
    isHolidayPackage: holidayPackage || undefined,
    status: value,
    isNewsletter: false
  });
  const [fetchBundles, stateBundles] = useAsyncAction(getBundlesService);

  const [handleHoliday, stateHandleHoliday] = useAsyncAction(handleHolidayBundlesService, {
    onSuccess: () => {
      handleChangeLocation({ ...currentLocation });
      setBundlesSelected([]);
      setOpenModalBundles(false);
      setOpenModalConfirm('');
      message.success('Success!', 2);
    },
    onFailed: () => {
      message.error('Fail!', 2);
    }
  });

  // Call
  const handleChangeLocation = (
    {
      currentPage = currentLocation.currentPage,
      arrival = currentLocation.arrival,
      departure = currentLocation.departure,
      adults = currentLocation.adults,
      propertyId = currentLocation.propertyId,
      perPage = currentLocation.perPage,
      isTemplate = currentLocation.isTemplate,
      isHolidayPackage = currentLocation.isHolidayPackage,
      status = currentLocation.status,
      disabled = currentLocation.disabled,
      search = currentLocation.search,
      online = currentLocation.online,
      isNewsletter = currentLocation.isNewsletter,
      isArchive = currentLocation.isArchive
    }: QueryCaseType,
    controller?: AbortController
  ) => {
    if (online === filterBundle.APPROVED) online = '';
    const checkStatus =
      status === filterBundle.PUBLISH || status === filterBundle.UNPUBLISH
        ? filterBundle.APPROVED
        : status;

    const query = queryCase({
      propertyId,
      currentPage,
      arrival,
      departure,
      adults,
      perPage,
      isTemplate,
      isHolidayPackage,
      status: checkStatus,
      disabled,
      online,
      search,
      isNewsletter,
      isArchive
    });

    fetchBundles(query, controller?.signal);

    navigate(
      `${
        !isHolidayPackage ? `/${codeProperty}/${paths.bundles}/${currentTypeBundle}` : ``
      }?${query}`
    );
    setCurrentLocation({
      ...currentLocation,
      propertyId,
      currentPage,
      arrival,
      departure,
      adults,
      isTemplate,
      isHolidayPackage,
      search,
      status: checkStatus,
      disabled,
      online,
      isNewsletter,
      isArchive
    });
  };

  // Data
  const bundles = useDataDisplayV2<BundleListType>(stateBundles);

  //* End Handle api service

  //* Handle interface

  // Helmet
  useHelmet({
    title: holidayPackage
      ? t('holidayPackage:holiday_package')
      : `${t('bundles:bundles')} / ${nameProperty}`
  });
  //* End handle interface

  const treeData = [
    {
      value: 'approved',
      title: t('bundles:approved'),
      children: [
        {
          value: 'publish',
          title: t('bundles:published')
        },
        {
          value: 'unpublish',
          title: t('bundles:unpublished')
        }
      ]
    },
    {
      value: 'pending',
      title: t('bundles:pending')
    },
    {
      value: 'rejected',
      title: t('bundles:rejected')
    },
    {
      value: 'expired',
      title: t('bundles:expired')
    },
    {
      value: 'invalid',
      title: t('bundles:invalid')
    }
  ];

  const handleFilter = (value: string) => {
    let isOnline: string | boolean = false;
    let status: string = value;

    if (value === undefined || value === filterBundle.INVALID) {
      isOnline = '';
      status = '';
    }
    if (value === filterBundle.APPROVED) isOnline = value;
    if (value === filterBundle.PUBLISH) isOnline = true;

    setValue(value);
    handleChangeLocation({
      status: status,
      online: isOnline,
      disabled: !value || value === filterBundle.EXPIRED ? '' : `${value === filterBundle.INVALID}`,
      currentPage: 1
    });
  };

  const handleSearch = (value: string) => {
    handleChangeLocation({ search: value.trim(), currentPage: 1 });
  };

  const handleHolidayPackage = (type: 'remove' | 'import') => {
    if (bundlesSelected) {
      const payload = bundlesSelected?.map(
        (bundleId) => `${type === 'remove' ? '-' : '+'}${bundleId}`
      );
      payload && handleHoliday(payload);
    }
  };

  useDidMount(
    (controller) => {
      codeProperty &&
        handleChangeLocation(
          {
            ...currentLocation,
            isTemplate: !holidayPackage ? currentTypeBundle === paths.bundlesTemplate : undefined,
            isArchive: !holidayPackage ? currentTypeBundle === paths.bundlesArchive : undefined,
            currentPage: 1,
            isNewsletter: currentTypeBundle === paths.bundlesNewsletter
          },
          controller
        );
    },
    [currentTypeBundle, holidayPackage]
  );

  return (
    <PlainLayout
      headerprops={{
        title: !holidayPackage ? (
          <Space size={[8, 8]}>
            <SearchComponent
              placeholderC={t('bundles:search')}
              onChange={(value) => handleSearch(value)}
              defaultValue={''}
              allowClear
            />
            {currentTypeBundle !== paths.bundlesArchive && (
              <TreeSelect
                allowClear
                placeholder={t('bundles:placeholder_filter')}
                treeDefaultExpandAll
                treeData={treeData}
                value={value}
                onChange={handleFilter}
                style={{ width: 150 }}
              />
            )}
          </Space>
        ) : (
          t('holidayPackage:holiday_package_page')
        ),
        extra: [
          !holidayPackage && currentTypeBundle !== paths.bundlesArchive ? (
            <Button
              type="primary"
              key="new-bundle-btn"
              icon={<PlusOutlined />}
              onClick={() => navigate(`${paths.create}`)}
            >
              {t('common:button.new')}{' '}
              {currentTypeBundle === paths.bundlesTemplate
                ? t('sidebar:sidebar.template')
                : currentTypeBundle === paths.bundlesNewsletter
                ? paths.bundlesNewsletter
                : t('bundles:bundle')}
            </Button>
          ) : currentTypeBundle !== paths.bundlesArchive ? (
            <Fragment key={'holiday-package-action'}>
              <Tooltip
                title={
                  !(bundlesSelected && bundlesSelected?.length) ? t('bundles:tooltip_remove') : ''
                }
                placement="bottomLeft"
              >
                <Button
                  type="default"
                  key="remove-btn"
                  icon={<MinusOutlined />}
                  onClick={() => setOpenModalConfirm(FuncType.REMOVE)}
                  disabled={!(bundlesSelected && bundlesSelected?.length)}
                >
                  {t('common:button.remove')}
                </Button>
              </Tooltip>

              <Tooltip
                title={
                  bundles.pagination?.total === 10 ? t('bundles:tooltip_limit_holidayPackage') : ''
                }
                placement="bottomLeft"
              >
                <Button
                  type="primary"
                  key="import-btn"
                  icon={<PlusOutlined />}
                  onClick={() => setOpenModalBundles(true)}
                  disabled={bundles.pagination?.total === 10}
                >
                  {t('button.import')}
                </Button>
              </Tooltip>
            </Fragment>
          ) : null
        ]
      }}
      footerprops={{
        children: COPYRIGHT,
        className: 'text-center'
      }}
      className="bg-inherit"
    >
      <BundleList
        perpageDefault={PERPAGE}
        currentView={currentView}
        holidayPackage={holidayPackage}
        type={currentTypeBundle}
        currentLocation={currentLocation}
        onChangeLocation={handleChangeLocation}
        onSelect={setBundlesSelected}
        selectedValue={bundlesSelected}
        loading={stateBundles.loading}
        data={bundles}
      />

      <ModalConfirmation
        content={`${t('common:modal.confirm_content_remove')} ${openModalConfirm}?`}
        onChangeOpenModal={() => setOpenModalConfirm('')}
        modalOpen={openModalConfirm === FuncType.REMOVE}
        callBack={() => {
          if (openModalConfirm === FuncType.REMOVE) handleHolidayPackage('remove');
        }}
      />

      {holidayPackage && openModalBundles ? (
        <ModalBundleList
          open={openModalBundles}
          loading={stateHandleHoliday.loading}
          onSelect={setBundlesSelected}
          onCancel={() => setOpenModalBundles(false)}
          onSubmit={() => handleHolidayPackage('import')}
        />
      ) : null}
    </PlainLayout>
  );
};

export default BundlesPage;
