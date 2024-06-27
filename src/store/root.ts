/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineReducers } from '@reduxjs/toolkit';
import app from './app';
import orion from './orion';

interface AsyncReducersProps {
  [key: string]: any;
}

export const rootReducer = {
  app,
  orion
};

const createReducer = (asyncReducers?: AsyncReducersProps) =>
  combineReducers({
    /** Add extra reducers */
    ...asyncReducers,
    ...rootReducer
  });

export default createReducer;
