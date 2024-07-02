/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from '@reduxjs/toolkit';
import app from './app';
import booking from './booking';

interface AsyncReducersProps {
  [key: string]: any;
}

export const rootReducer = {
  app,
  booking
};

const createReducer = (asyncReducers?: AsyncReducersProps) =>
  combineReducers({
    /** Add extra reducers */
    ...asyncReducers,
    ...rootReducer
  });

export default createReducer;
