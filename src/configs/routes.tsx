/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppLayout } from 'components/layout';
import { paths } from 'constant';
import { NotFoundPage, ServerErrorPage } from 'pages';
import React from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { loadWhiteList } from 'utils/storage';
import { AuthStatus, ViewMode } from './const/auth';
import { PrivateRoute, routeAccount, routeProfile, routeProperties } from './route';

const Login = React.lazy(() => import('pages/LoginPage'));


const routes: RouteObject[] = [
  {
    path: paths.default,
    errorElement: <ServerErrorPage />,
    element: (
      <PrivateRoute
        renderIfTrue={(state) => {
          const whiteList = loadWhiteList()

          return state?.orion?.auth?.status === AuthStatus.Auth || (whiteList && whiteList?.user?.userId);
        }}
        fallBackComponent={() => <Navigate to={`/${paths.login}`} />}
      >
        <AppLayout>
          <Outlet />
        </AppLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: (
          <PrivateRoute renderIfTrue={(state) => state?.orion?.auth?.view === ViewMode.Account}>
            <Outlet />
          </PrivateRoute>
        ),
        children: [...routeAccount]
      },
      {
        path: '',
        element: (
          <PrivateRoute renderIfTrue={(state) => state?.orion?.auth?.view !== ViewMode.Account && !state?.orion?.property?.detail?.disabled}>
            <Outlet />
          </PrivateRoute>
        ),
        children: [...routeProperties]
      },
      ...routeProfile,
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  },
  {
    path: paths.login,
    errorElement: <ServerErrorPage />,
    element: (
      <PrivateRoute
        renderIfTrue={(state) => state?.orion?.auth?.status === AuthStatus.Unauth}
        fallBackComponent={() => <Navigate to={`/${paths.home}`} />}
      >
        <Login />
      </PrivateRoute>
    )
  },
  //Navigate to external pages
  {
    path: paths.ynrg12i19zq2x,
    element: <></>
  },
  {
    path: paths.h5dz2i81gu1m5,
    element: <></>
  }
];

export default routes;
