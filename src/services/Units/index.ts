import axios from 'services/http';
import { UnitDetailAppType, UnitParamsType, UnitType, UnitsAppType } from './type';

export const getAllUnitService = (signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<UnitType>>>(`/inventory/units`, {
    requireAuthentication: true,
    signal
  });

// Get unit by id
export const getUnitByIdService = (id: string, signal?: AbortSignal) => {
  return axios.get<BaseAPIResponse<Array<UnitDetailAppType>>>(`/inventory/units/${id}`, {
    requireAuthentication: true,
    signal
  });
};

// Get unit list by code
export const getUnitsByPropertyService = (queryText: string, signal?: AbortSignal) => {
  return axios.get<BaseAPIResponse<Array<UnitsAppType>>>(
    `/inventory/units${queryText ? `?${queryText}` : ''}`,
    { requireAuthentication: true, signal }
  );
};

//Get unit by Unit group code
export const getUnitsByUnitGroupService = (code: string, signal?: AbortSignal) => {
  return axios.get<BaseAPIResponse<Array<UnitsAppType>>>(`/inventory/units?unitGroupCode=${code}`, {
    requireAuthentication: true,
    signal
  });
};

export const getUnitDetailService = (id: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<UnitType>>(`/inventory/units/${id}`, {
    requireAuthentication: true,
    signal
  });

export const updateUnitsService = (id: string, params: UnitParamsType) =>
  axios.put<BaseAPIResponse<UnitDetailAppType>>(
    `/inventory/units/${id}`,
    {
      ...params
    },
    { requireAuthentication: true }
  );

export const createUnitsService = (params: UnitParamsType) =>
  axios.post<BaseAPIResponse<UnitType>>(
    `/inventory/units`,
    {
      ...params
    },
    { requireAuthentication: true }
  );

export const deleteUnitsService = (id: string) =>
  axios.delete<BaseAPIResponse<UnitType>>(`/inventory/units/${id}`, {
    requireAuthentication: true
  });
