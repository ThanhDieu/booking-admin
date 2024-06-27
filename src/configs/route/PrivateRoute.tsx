/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorPageStatus } from 'configs/const/auth';
import useView from 'hooks/useView';
import { NoAuthorizedPage, NotFoundPage, ServerErrorPage } from 'pages';
import { useLocation } from 'react-router-dom';
import { StoreState, useAppSelector } from 'store';

export type ErrorPageType = 404 | 403 | 500
export interface PrivateRouteProps {
  renderIfTrue?: (state: StoreState, location?: any, role?: string) => boolean;
  children: React.ReactElement;
  fallBackComponent?: (value?: string) => React.ReactElement;
  hardCode?: string
}

const showErrorPageByCode = (errorPageType: string) => {
  switch (errorPageType) {
    case ErrorPageStatus.notFound:
      return <NotFoundPage />
    case ErrorPageStatus.notServer:
      return <ServerErrorPage />
    default:
      return <NoAuthorizedPage />
  }
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
  const { renderIfTrue, children, fallBackComponent, hardCode } = props;

  if (hardCode && Object.values(ErrorPageStatus).some(item => item.includes(hardCode))) {
    return showErrorPageByCode(hardCode);
  }

  const store = useAppSelector((store) => store);
  const location = useLocation();
  const { currentViewObj } = useView();
  const { detail } = useAppSelector((store) => store?.orion?.property);

  if ((renderIfTrue && renderIfTrue(store, location, currentViewObj?.code)) || !renderIfTrue) {
    return children;
  }

  if (renderIfTrue && renderIfTrue(store, location, currentViewObj?.code) === false) {
    if (!fallBackComponent && !detail) {
      return <></>
    }
    return fallBackComponent ? fallBackComponent(currentViewObj.code) : (detail?.disabled ? showErrorPageByCode(ErrorPageStatus.notFound) : showErrorPageByCode(ErrorPageStatus.notAuth));
  }

  return fallBackComponent ? fallBackComponent() : showErrorPageByCode(ErrorPageStatus.notAuth);
};
export default PrivateRoute;
