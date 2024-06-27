export interface CampaignSettingType {
  title: string;
  from_name: string;
  reply_to: string;
}

export interface CampaignListType {
  id: string;
  settings: CampaignSettingType;
}

export enum MailType {
  offer = 'offer',
  newsletter = 'newsletter'
}
export interface CampaignSendPayload {
  html: string;
  campaignId: string;
  mailType: MailType;
  guestMail?: string;
}
