import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { OfferBundleType, OfferInforType } from 'services/Offer/type';
import { ServiceDetailAppType } from 'services/ServiceList/type';
import { mergeDuplicateObjAndCount } from 'utils/array';
import { v4 as uuid } from 'uuid';

interface InitialStateType {
  bundleOfferSelected: OfferBundleType[];
  extraServiceOffer: ServiceDetailAppType[];
  offerInfo?: OfferInforType;
  name?: string;
}

const initialState: InitialStateType = {
  bundleOfferSelected: [],
  extraServiceOffer: [],
  offerInfo: undefined,
  name: ''
};

export const offerSlice = createSlice({
  name: 'Offer',
  initialState: initialState,
  reducers: {
    updateBundleOfferSelected: (
      state,
      { payload: { data, removeId } }: PayloadAction<{ data?: OfferBundleType; removeId?: string }>
    ) => {
      const newArr = [...state.bundleOfferSelected];

      //add more data
      if (!removeId && data) {
        newArr.push({
          ...data,
          key: uuid()
        });
        state.bundleOfferSelected = mergeDuplicateObjAndCount(newArr, [
          'bundlePriceId',
          'totalGuest'
        ]);
      }

      //remove data
      if (removeId) {
        const index = newArr.findIndex((el) => {
          return el.key === removeId;
        });
        index > -1 && newArr.splice(index, 1);
        state.bundleOfferSelected = newArr;
      }
    },

    updateCountBundleOfferSelected: (
      state,
      {
        payload: { bundleIdx, action }
      }: PayloadAction<{ bundleIdx: number; action: 'inc' | 'dec' }>
    ) => {
      const newArr = [...state.bundleOfferSelected];
      if (action === 'inc') {
        newArr[bundleIdx].count = newArr[bundleIdx].count + 1;
      } else {
        newArr[bundleIdx].count = newArr[bundleIdx].count - 1;
      }
      state.bundleOfferSelected = newArr;
    },

    updateExtraServiceOffer: (state, action) => {
      state.extraServiceOffer = [...action.payload];
    },

    updateBookerOffer: (state, { payload }: PayloadAction<OfferInforType>) => {
      state.offerInfo = payload;
    },

    updateNameOffer: (state, { payload }: PayloadAction<string>) => {
      state.name = payload;
    },

    resetState: () => {
      return initialState;
    }
  }
});

export const {
  updateBundleOfferSelected,
  updateExtraServiceOffer,
  updateBookerOffer,
  updateNameOffer,
  updateCountBundleOfferSelected,
  resetState
} = offerSlice.actions;
