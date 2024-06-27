import axios from 'services/http';
import { AllUnitGroupsAvailabilityType } from './type';

export const getAllAvailabilityUnitGroups = (query: string, signal?: AbortSignal) =>
  axios.get<BaseAPIResponse<Array<AllUnitGroupsAvailabilityType>>>(
    `/inventory/availability/v1/unit-groups?${query}`,
    {
      requireAuthentication: true,
      signal
    }
  );
