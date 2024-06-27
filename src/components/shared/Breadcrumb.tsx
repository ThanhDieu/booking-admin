/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Breadcrumb as AntBreadcrumb, Typography } from 'antd';
import { BreadcrumbItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { paths } from 'constant';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

export interface BreadcrumbProps {
  name?: string;
}

function itemRender(
  route: BreadcrumbItemType,
  params: any,
  routes: BreadcrumbItemType[],
  paths: string[]
) {
  const last = routes.indexOf(route) === routes.length - 1;

  return last ? (
    <Typography.Text className="capitalize  ">{route.title}</Typography.Text>
  ) : (
    <Link className="capitalize  " to={paths.join('/')}>
      <Typography.Text>{route.title}</Typography.Text>
    </Link>
  );
}

function Breadcrumb(props: BreadcrumbProps) {
  const location = useLocation();
  const { t, i18n } = useTranslation(['sidebar']);
  const currentLanguage = i18n.language;

  const routeArray = useMemo(() => {
    const pathNameArr = location?.pathname.split('/');

    if (pathNameArr.length) {
      return pathNameArr
        .filter((pathName) => pathName)
        .map((pathName) => {
          const defaultTitle = props?.name || pathName;
          const localization = t('sidebar:sidebar.' + defaultTitle?.toString());
          return {
            path: paths[pathName as keyof typeof paths] || pathName,
            title: localization.search('sidebar') !== -1 ? defaultTitle : localization
          };
        });
    }
    return {
      path: paths.home,
      title: 'home'
    };
  }, [location, currentLanguage]);

  return <AntBreadcrumb items={routeArray as BreadcrumbItemType[]} itemRender={itemRender} />;
}

export default Breadcrumb;
