import React from 'react';
import { BrowserRouter, useRoutes, RouteObject, Navigate } from 'react-router-dom';
import { LoadingPage } from 'pages';
import routes from 'configs/routes';

const convertRoutesUsingSuspense = (sourceRoutes: RouteObject[]): RouteObject[] => {
  const targetRoutes = sourceRoutes.map((route) => {
    return {
      ...route,
      children: route.children ? convertRoutesUsingSuspense(route.children) : undefined,
      element: <React.Suspense fallback={<LoadingPage />}>{route.element}</React.Suspense>
    };
  });

  return targetRoutes as RouteObject[];
};

export interface RouterProps {
  defaultRoute: string;
}

export function Routes(props: RouterProps) {
  const { defaultRoute } = props;
  const defaultRouteObject: RouteObject = {
    index: true,
    path: '/',
    element: <Navigate to={defaultRoute} />
  };

  const convertedRoutes = convertRoutesUsingSuspense(routes);

  const elements = useRoutes([defaultRouteObject, ...convertedRoutes]);

  return elements;
}

function Router(props: RouterProps) {
  return (
    <BrowserRouter>
      <Routes {...props} />
    </BrowserRouter>
  );
}

export default Router;
