export enum AuthStatus {
  Auth = 'AUTH',
  Unauth = 'UNAUTH'
}

export enum ViewMode {
  Account = 'Account',
  Property = 'Property'
}

export enum RoleMode {
  HotelDirector = 3,
  HotelAdmin = 4,
  SuperAdmin = 1,
  Admin = 2

}

export enum ErrorPageStatus {
  notFound = '404',
  notAuth = '403',
  notServer = '500'
}
