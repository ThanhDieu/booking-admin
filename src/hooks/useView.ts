import { RoleMode } from 'configs/const/auth';
import { useMemo } from 'react';
import { useAppSelector } from 'store';
import { loadViewMode } from 'utils/storage';
import { displayRole } from 'utils/view';

const useView = () => {
  const { view, profile } = useAppSelector((store) => store.orion.auth);

  const currentView = loadViewMode() || view;

  const currentViewObj = displayRole(currentView);
  const allowedViewAll = useMemo<boolean>(() => {
    const infoArrayName = !!profile?.roles?.some(role => (role?.extendedData?.priority === RoleMode.SuperAdmin || role?.extendedData?.priority === RoleMode.Admin))
    return infoArrayName || false;
  }, [profile]);
  const allowedApprove = useMemo<boolean>(() => {
    const infoArrayName = !!profile?.roles?.some(role => (role?.extendedData?.priority === RoleMode.SuperAdmin || role?.extendedData?.priority === RoleMode.HotelDirector))
    return infoArrayName || false;
  }, [profile]);


  return {
    currentView,
    allowedViewAll,
    allowedApprove,
    currentViewObj
  };
};

export default useView;
