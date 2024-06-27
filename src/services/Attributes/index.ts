// TODO
import axios from 'services/http';
import { AttributeDetailAppType } from './type';

export const getAttributeListService = (type: string, codeHotel?: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<AttributeDetailAppType>>>(`/inventory/attributes`, {
    requireAuthentication: true,
    signal
  });
