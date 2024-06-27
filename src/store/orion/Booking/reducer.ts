/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GuestInfo } from '@types';
import { BookingResDetailType } from 'services/Bookings/type';
import { GetBundlePriceTypeV2 } from 'services/Bundle/type';
import { ServiceDetailAppType } from 'services/ServiceList/type';
import { VoucherType } from 'services/Vouchers/type';

export enum StateAccommodation {
  Search = 'Search',
  Select = 'Select',
  ExtraInfo = 'ExtraInfo'
}

export interface ReservationCreateType {
  primaryGuest?: GuestInfo;
  extraServices: ServiceDetailAppType[];
  payloadSearch?: BookingResDetailType;
  bundleSelected?: GetBundlePriceTypeV2;
  guests?: GuestInfo[];
  vouchers?: VoucherType;
}

export interface BookingState extends ReservationCreateType {
  booker?: GuestInfo;
  bookerComment: string;
  reservations: ReservationCreateType[];
  stateAccommodation: StateAccommodation;
  payloadSearch: any;
  extraServices: any[];
  bundleSelected: GetBundlePriceTypeV2 | undefined;
  guests: GuestInfo[];
}

const initialState: BookingState = {
  booker: undefined,
  bookerComment: '',
  payloadSearch: undefined,
  extraServices: [],
  reservations: [],
  bundleSelected: undefined,
  stateAccommodation: StateAccommodation.Search,
  guests: []
};

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    updateBundleSelected: (state, { payload }: PayloadAction<GetBundlePriceTypeV2 | undefined>) => {
      state.bundleSelected = payload;
    },
    changeState: (state, { payload }: PayloadAction<StateAccommodation>) => {
      state.stateAccommodation = payload;
    },
    updatePayloadSearch: (state, action) => {
      state.payloadSearch = action.payload;
    },
    updateExtraServices: (state, action) => {
      state.extraServices = [...action.payload];
    },

    updateBookerComment: (state, action) => {
      state.bookerComment = action.payload;
    },
    updateBooker: (state, { payload }: PayloadAction<GuestInfo>) => {
      state.booker = payload;
      state.bookerComment = payload?.bookerComment ? payload.bookerComment : '';
    },
    addReservation: (
      state,
      {
        payload: { res, idx = undefined }
      }: PayloadAction<{ res: ReservationCreateType; idx?: number }>
    ) => {
      if (idx === undefined) {
        state.reservations.push({ ...res });
      } else {
        state.reservations[idx] = res;
      }
    },
    removeReservation: (
      state,
      {
        payload: { index, stateAcc = StateAccommodation.Search }
      }: PayloadAction<{ index: number; stateAcc?: StateAccommodation }>
    ) => {
      state.reservations.splice(index, 1);
      if (state.reservations.length === 0) state.stateAccommodation = stateAcc;
    },
    resetAllState: () => {
      return initialState;
    },
    replaceGuest: (state, { payload }: PayloadAction<GuestInfo[]>) => {
      state.guests = [...payload];
    }
  }
});

export const {
  updateBundleSelected,
  changeState,
  updatePayloadSearch,
  updateExtraServices,
  updateBookerComment,
  updateBooker,
  addReservation,
  removeReservation,
  resetAllState,
  replaceGuest
} = bookingSlice.actions;

export default bookingSlice.reducer;
