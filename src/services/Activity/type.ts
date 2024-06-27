import { BaseType } from '@types';

export interface ActivitiesPayload extends BaseType {
  title: string;
  icon: string;
  light?: string;
  dark?: string;
  media?: string;
  extendedData?: {
    [key: string]: {
      [key: string]: string;
    };
  };
}
export interface ActivityType extends ActivitiesPayload {
  activityId: string;
}
