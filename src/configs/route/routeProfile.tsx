import { paths } from 'constant';
import React from 'react';
import { Outlet, RouteObject } from 'react-router-dom';

const Profile = React.lazy(() => import('pages/ProfilePage'));
const Setting = React.lazy(() => import('pages/SettingPage'));

const GeneralProfile = React.lazy(() => import('pages/ProfilePage/subs/GeneralProfilePage'));
const AuthProfile = React.lazy(() => import('pages/ProfilePage/subs/AuthProfilePage'));
const NotiSetting = React.lazy(() => import('pages/SettingPage/subs/NotiSettingPage'));
const LangSetting = React.lazy(() => import('pages/SettingPage/subs/LangSettingPage'));

//profile
const extendedAccountRoutes: RouteObject[] = [
  {
    path: paths.profile,
    element: (
      <Profile>
        <Outlet />
      </Profile>
    ),
    children: [
      {
        index: true,
        path: paths.general,
        element: <GeneralProfile />
      },
      {
        path: paths.auth,
        element: <AuthProfile />
      }
    ]
  },
  {
    path: paths.setting,
    element: (
      <Setting>
        <Outlet />
      </Setting>
    ),
    children: [
      {
        index: true,
        path: paths.notification,
        element: <NotiSetting />
      },
      {
        path: paths.lang,
        element: <LangSetting />
      }
    ]
  }
];

export default extendedAccountRoutes;
