import axios from 'axios';
import { CampaignListType, CampaignSendPayload } from './type';
import http from 'services/http';

export const trigerGetCampaignList = () =>
  http.get<BaseAPIResponse<Array<CampaignListType>>>(`/1c8ad42b-2966-43ff-9160-ad62018b63ec`, {
    newUrl: `${import.meta.env.REACT_APP_BASE_PREFIX_WEBHOOK_AUTOMATE}`,
    requireAuthentication: true
  });

export const triggerSendCampaign = (formData: CampaignSendPayload) =>
  axios.post<BaseAPIResponse<Array<CampaignListType>>>(
    `${
      import.meta.env.REACT_APP_BASE_PREFIX_WEBHOOK_AUTOMATE
    }/f510ad56-7386-479f-8884-7a2e5153f003`,

    { ...formData },
    {
      requireAuthentication: true
    }
  );
