import { combineReducers } from '@reduxjs/toolkit';
import { activitySlice } from './Activity';
import { authSlice } from './Auth';
import { bookingSlice } from './Booking';
import { landscapeSlice } from './Landscape';
import { mediaSlice } from './Media';
import { propertySlice } from './Property';
import { serviceSlice } from './Service';
import { specialBundleSlice } from './SpecialBundle';
import { tagSlice } from './Tag';
import { taskSlice } from './Task';
import { roleSlice } from './Role';
import { buildIBESlice } from './BuildIBE';
import { languageSettingSlice } from './SettingLanguage';
import { bundleSlice } from './Bundle';
import { offerSlice } from './Offer';
import { mailchimpSlice } from './Mailchimp';
//_import

const reducersMap = {
  booking: bookingSlice.reducer,
  property: propertySlice.reducer,
  media: mediaSlice.reducer,
  activity: activitySlice.reducer,
  specialBundle: specialBundleSlice.reducer,
  landscape: landscapeSlice.reducer,
  tag: tagSlice.reducer,
  task: taskSlice.reducer,
  service: serviceSlice.reducer,
  role: roleSlice.reducer,
  buildIbe: buildIBESlice.reducer,
  bundle: bundleSlice.reducer,
  languageSetting: languageSettingSlice.reducer,
  offer: offerSlice.reducer,
  mailchimp: mailchimpSlice.reducer,
  //_slice

  auth: authSlice.reducer
};

const createReducer = combineReducers(reducersMap);

export type reducersMapType = keyof typeof reducersMap;
export default createReducer;
