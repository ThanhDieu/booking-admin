import ErrorPage from './ErrorPage';

export const NotFoundPage = ErrorPage[404];
export const ServerErrorPage = ErrorPage[500];
export const NoAuthorizedPage = ErrorPage[403];

export { default as AttributesPage } from './@booking/@property/AttributesPage';
export { default as BundlesPage } from './@booking/@property/BundlesPage';
export { default as HomePage } from './@booking/HomePage';
export { default as PropertiesPage } from './@booking/PropertiesPage';
export { default as PaymentsPage } from './@booking/PaymentsPage';
export { default as PoliciesPage } from './@booking/PoliciesPage';
export { default as ReservationsPage } from './@booking/ReservationsPage';
export { default as ServiceListPage } from './@booking/ServiceListPage';
export { default as ServiceTypePage } from './@booking/ServiceTypePage';
export { default as TagsPage } from './@booking/TagsPage';
export { default as UsersPage } from './@booking/UsersPage';
export { default as TasksPage } from './@booking/@property/TasksPage';
export { default as LoadingPage } from './LoadingPage';
export { default as LoginPage } from './LoginPage';
export { default as ProfilePage } from './ProfilePage';
export { default as AccountProfilePage } from './ProfilePage/subs/AuthProfilePage';
export { default as SettingPage } from './SettingPage';
export { default as LangSettingPage } from './SettingPage/subs/LangSettingPage';
export { default as AuthSettingPage } from './SettingPage/subs/NotiSettingPage';
