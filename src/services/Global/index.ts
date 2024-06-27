import axios from 'services/http';
import { GlobalSearchType } from './type';

export const getGlobalSearchService = (query: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<GlobalSearchType>>>(`/search${query ? `?${query}` : ''}`, {
    requireAuthentication: true,
    signal
  });
