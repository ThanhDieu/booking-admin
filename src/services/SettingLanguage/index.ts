import http from 'services/http';
import { LanguageSettingType } from './type';

export const getAllLanguageSetting = (signal?: AbortSignal) =>
  http.get<Array<LanguageSettingType>>(`settings/v1/languages`, {
    requireAuthentication: true,
    signal
  });
