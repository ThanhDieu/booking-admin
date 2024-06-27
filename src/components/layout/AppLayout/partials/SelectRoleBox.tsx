/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from 'antd';
import clsx from 'clsx';
import { ViewMode } from 'configs/const/auth';
import { paths } from 'constant';
import { useDidMount } from 'hooks';
import useView from 'hooks/useView';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { PropertyDetailAppType } from 'services/Properties/type';
import { useAppDispatch, useAppSelector } from 'store';
import { updateView } from 'store/orion/Auth';
import { getPropertyDetails, getPropertyList } from 'store/orion/Property';
import { formatValueOption } from 'utils/format';
import { loadWhiteList } from 'utils/storage';
import { displayRole } from 'utils/view';

interface Props {
  collapsed: boolean;
}

const SelectRoleBox: React.FC<Props> = ({ collapsed }) => {
  const { t } = useTranslation(['common', 'sidebar']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentView, currentViewObj } = useView();
  const propertiesState = useAppSelector((state) => state.orion?.property);
  const whiteList = loadWhiteList()

  // TODO
  useDidMount(() => {
    dispatch(
      getPropertyList({
        query: 'perPage=50'
      })
    );
    if (whiteList?.user?.userId) {
      dispatch(updateView(!currentView ? ViewMode.Account : currentView));
      if (currentView !== ViewMode.Account && currentViewObj?.code) {
        dispatch(getPropertyDetails({ id: currentViewObj.code }));
      }
    }
  });

  const formatProperties = useMemo(() => {
    if (!propertiesState?.properties?.data) return [];
    const res: PropertyDetailAppType[] = propertiesState?.properties?.data || [];
    return res && res.length
      ? res?.map((item: PropertyDetailAppType) => ({
        ...item,
        label: `${item?.name}`,
        value: formatValueOption(item, 'name', 'extId')
      }))
      : [];
  }, [propertiesState?.properties]);

  //TODO
  // save url when prev
  useEffect(() => {
    if (location?.pathname) {
      const pathObj = displayRole(location.pathname.slice(1), '/');
      if (pathObj?.code && formatProperties) {
        const checkIsProperty = formatProperties.find(
          (property) => pathObj.code === property?.extId
        );
        if (checkIsProperty && (!currentViewObj?.code || pathObj?.code !== currentViewObj.code)) {
          dispatch(updateView(`${checkIsProperty.extId}@${checkIsProperty?.name}`));
          checkIsProperty.extId && dispatch(getPropertyDetails({ id: checkIsProperty.extId }));
        }
      } else if (currentViewObj?.code) {
        dispatch(updateView(ViewMode.Account));
      }
    }
  }, [location?.pathname, formatProperties]);

  const handleChange = (value: string) => {
    dispatch(updateView(value));
    if (value === ViewMode.Account) {
      navigate(`/${paths.home}`);
    } else {
      const view = displayRole(value);
      const code = view?.code;
      if (code) {
        navigate(`/${code}/${paths.home}`);
        dispatch(getPropertyDetails({ id: code }));
      }
    }
  };
  return (
    <>
      {formatProperties ? (
        <Select
          value={currentView}
          onChange={handleChange}
          options={[
            {
              label: `${t('sidebar:roles_box.manager')}`,
              options: [{ label: t('common:general.global'), value: ViewMode.Account }]
            },
            {
              label: formatProperties.length
                ? `${t('sidebar:roles_box.properties')}`
                : `${t('common:button.no')} ${t('sidebar:roles_box.properties').toLowerCase()}`,
              options: formatProperties.length ? formatProperties : []
            }
          ]}
          className={clsx(collapsed && 'hidden', 'w-[150px]')}
          showSearch
          bordered={false}
          popupMatchSelectWidth={false}
        />
      ) : (
        ''
      )}</>
  );
};

export default SelectRoleBox;
