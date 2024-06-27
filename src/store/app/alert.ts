import { createSlice } from '@reduxjs/toolkit';

type StatusType = 'error' | 'info' | 'warn';

export interface AlertProps {
  status: StatusType;
  message: string;
  logs: [StatusType, string][];
}

const initialState: AlertProps = {
  status: 'info',
  message: 'N/A',
  logs: []
};

const AlertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    alert: (state, { payload }) => {
      state.status = payload.status;
      state.message = payload.message;
      /** Store logs in temporary */
      state.logs = [...state.logs, [payload.status, payload.message]];
    }
  }
});

export const { alert } = AlertSlice.actions;

export default AlertSlice.reducer;
