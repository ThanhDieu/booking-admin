/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore, ThunkDispatch, ThunkAction } from '@reduxjs/toolkit';
import createReducer from './root';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { AnyAction } from 'redux';
import listenerMiddleware from './listener';
// import '@mock';

// Initial states
const preloadedState = {};

const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) => {
    if (import.meta.env.DEV) {
      // return getDefaultMiddleware()
      //   .concat(logger)
      //   .prepend(listenerMiddleware.middleware);
    }

    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
  },
  devTools: import.meta.env.DEV,
  preloadedState
});

export type StoreState = ReturnType<typeof store.getState>;
export type ReduxState = ReturnType<typeof createReducer>;
export type StoreDispatch = typeof store.dispatch;
export type TypedDispatch = ThunkDispatch<ReduxState, any, AnyAction>;
export type TypedThunk<ReturnType = void> = ThunkAction<ReturnType, ReduxState, unknown, AnyAction>;

export const useAppDispatch = () => useDispatch<TypedDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export default store;
