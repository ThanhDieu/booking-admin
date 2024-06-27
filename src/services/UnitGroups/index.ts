import axios from 'services/http';
import { UnitDetailAppType } from 'services/Units/type';
import { UnitGroupParamsType, UnitGroupsAppType } from './type';

// Get unit groups by id
export const getUnitGroupsByIdService = (id: string, signal?: AbortSignal) => {
  return axios.get<BaseAPIResponse<Array<UnitGroupsAppType>>>(`/inventory/unit-groups/${id}`, {
    requireAuthentication: true,
    signal
  });
};

// Get unit groups list by property
export const getUnitGroupsByPropertyService = (
  propertyId: string,
  ratePlanInclude = false,
  signal?: AbortSignal
) => {
  return axios.get<BaseAPIResponse<Array<UnitDetailAppType>>>(
    `/inventory/unit-groups?propertyId=${propertyId}&ratePlanInclude=${ratePlanInclude}`,
    {
      requireAuthentication: true,
      signal
    }
  );
};

// update by id
export const updateUnitGroupService = (id: string, formData: UnitGroupParamsType) =>
  axios.put<BaseAPIResponse<Array<UnitDetailAppType>>>(
    `/inventory/unit-groups/${id}`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );

// create by id
export const createUnitGroupService = (formData: UnitGroupParamsType) =>
  axios.post<BaseAPIResponse<Array<UnitDetailAppType>>>(
    `/inventory/unit-groups`,
    {
      ...formData
    },
    { requireAuthentication: true }
  );
export const deleteUnitGroupService = (id: string) =>
  axios.delete<BaseAPIResponse<UnitDetailAppType>>(`/inventory/unit-groups/${id}`, {
    requireAuthentication: true
  });
//v2
export const getUnitGroupsByPropertyServiceV2 = (queryText: string, signal?: AbortSignal) => {
  return axios.get<BaseAPIResponse<Array<UnitDetailAppType>>>(
    `/inventory/unit-groups${queryText ? `?${queryText}` : ''}`,
    {
      requireAuthentication: true,
      signal
    }
  );
};
