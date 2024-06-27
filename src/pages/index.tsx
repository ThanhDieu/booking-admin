import ErrorPage from './ErrorPage';

export const NotFoundPage = ErrorPage[404];
export const ServerErrorPage = ErrorPage[500];
export const NoAuthorizedPage = ErrorPage[403];

export { default as AttributesPage } from './@orion/@property/AttributesPage';
export { default as BundlesPage } from './@orion/@property/BundlesPage';
export { default as HomePage } from './@orion/HomePage';
export { default as PropertiesPage } from './@orion/PropertiesPage';
export { default as PaymentsPage } from './@orion/PaymentsPage';
export { default as PoliciesPage } from './@orion/PoliciesPage';
export { default as ReservationsPage } from './@orion/ReservationsPage';
export { default as ServiceListPage } from './@orion/ServiceListPage';
export { default as ServiceTypePage } from './@orion/ServiceTypePage';
export { default as TagsPage } from './@orion/TagsPage';
export { default as UsersPage } from './@orion/UsersPage';
export { default as TasksPage } from './@orion/@property/TasksPage';
export { default as LoadingPage } from './LoadingPage';
export { default as LoginPage } from './LoginPage';
export { default as ProfilePage } from './ProfilePage';
export { default as AccountProfilePage } from './ProfilePage/subs/AuthProfilePage';
export { default as SettingPage } from './SettingPage';
export { default as LangSettingPage } from './SettingPage/subs/LangSettingPage';
export { default as AuthSettingPage } from './SettingPage/subs/NotiSettingPage';
