import { ExtendedDataType } from '@types';
import { ThemeType } from 'configs/const/general';

/* eslint-disable @typescript-eslint/no-explicit-any */
const config = {
  prefix: 'BOOKING',
  accessToken: 'ACCESS_TOKEN',
  accessTokenLog: 'ACCESS_TOKEN_LOG',
  refreshToken: 'REFRESH_TOKEN',
  viewMode: 'VIEW_MODE',
  // TODO
  userInfo: 'USER_INFO',

  whiteList: "WHITE_LIST"
} as const;

const configTheme = {
  CONFIG_THEME: 'THEME'
};
/**
 * Saving data to localStorage.
 */
export const saveToLocalStorage = (name: string, value: unknown) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  localStorage.setItem(`${config.prefix}:${name}`, JSON.stringify(value));
};
/**
 * Load data from localStorage.
 */
const loadFromLocalStorage = (name: string) => {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  const serialized = localStorage.getItem(`${config.prefix}:${name}`);
  if (!serialized || serialized === null) return null;
  try {
    return JSON.parse(serialized) as any;
  } catch (error) {
    // console.error("Invalid JSON:", error);
  }
};

/**
 * Remove data from localStorage.
 */
export const removeFromLocalStorage = (name: string) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  localStorage.removeItem(`${config.prefix}:${name}`);
};
export const saveAccessToken = (accessToken: string) =>
  saveToLocalStorage(config.accessToken, accessToken);
export const loadAccessToken = () => loadFromLocalStorage(config.accessToken);
export const clearAccessToken = () => removeFromLocalStorage(config.accessToken);
export const saveRefreshToken = (refeshToken: string) =>
  saveToLocalStorage(config.refreshToken, refeshToken);
export const loadRefreshToken = () => loadFromLocalStorage(config.refreshToken);
export const clearRefreshToken = () => removeFromLocalStorage(config.refreshToken);

export const saveAccessTokenLog = (accessTokenLog: string) =>
  saveToLocalStorage(config.accessTokenLog, accessTokenLog);
export const loadAccessTokenLog = () => loadFromLocalStorage(config.accessTokenLog);
export const clearAccessTokenLog = () => removeFromLocalStorage(config.accessTokenLog);

export const saveViewMode = (currentView: string) =>
  saveToLocalStorage(config.viewMode, currentView);
export const loadViewMode = () => loadFromLocalStorage(config.viewMode);
export const clearViewMode = () => removeFromLocalStorage(config.viewMode);

//WHITE_LIST
export const saveWhiteList = (data: ExtendedDataType) => saveToLocalStorage(config.whiteList, data);
export const loadWhiteList = () => loadFromLocalStorage(config.whiteList);
export const clearWhiteList = () => removeFromLocalStorage(config.whiteList);

//Theme
export const saveThemeToStorage = (theme: ThemeType) =>
  saveToLocalStorage(configTheme.CONFIG_THEME, theme);
export const clearTheme = () => removeFromLocalStorage(configTheme.CONFIG_THEME);
export const loadTheme = () => loadFromLocalStorage(configTheme.CONFIG_THEME);
