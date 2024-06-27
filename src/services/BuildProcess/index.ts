import { BuildProcessType } from './type';
import http from 'services/http';

export const triggerBuild = (signal?: AbortSignal) =>
  http.get<BaseAPIResponse<Array<BuildProcessType>>>(`/1aee39af-0694-4c1c-a9d3-01873aa05959`, {
    newUrl: `${import.meta.env.REACT_APP_BASE_PREFIX_WEBHOOK_AUTOMATE}`,
    requireAuthentication: true,
    signal
  });

export const getAllBuildId = (signal?: AbortSignal) =>
  http.get<BaseAPIResponse<Array<BuildProcessType>>>(`/fa220e7c-8429-4664-a8f8-7cc3eceaeadc`, {
    newUrl: `${import.meta.env.REACT_APP_BASE_PREFIX_WEBHOOK_AUTOMATE}`,
    requireAuthentication: true,
    signal
  });

export const getBuildStatus = (signal?: AbortSignal) =>
  http.get<BaseAPIResponse<BuildProcessType>>(`/238c6256-3689-4ca7-8bb4-967ee35c8960`, {
    newUrl: `${import.meta.env.REACT_APP_BASE_PREFIX_WEBHOOK_AUTOMATE}`,
    requireAuthentication: true,
    signal
  });
