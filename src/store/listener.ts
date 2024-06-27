import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { alert } from './app/alert';
import { getPropertyList } from './orion/Property';
import { getBundleTaskList } from './orion/Task';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isAnyOf(
    // getPropertyList.rejected,
    // getBundleTaskList.rejected
  ), // TODO
  effect: async (action, listenerApi) => {
    const { dispatch } = listenerApi;
    /** Catching all rejected states */
    if ((action?.payload?.status === 'error' || action?.error?.name?.toLowerCase() === "error") && !action?.meta?.aborted) {
      dispatch(
        alert({
          status: 'error',
          message: action?.payload?.message || action?.error?.message
        })
      );
    }
  }
});

export default listenerMiddleware;
