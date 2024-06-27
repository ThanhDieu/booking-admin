/* eslint-disable @typescript-eslint/no-explicit-any */
import { useReducer, useMemo, useRef, useCallback, Reducer } from 'react';

import merge from 'deepmerge';

import { CancelablePromise } from 'utils/promise';

import useDidMount from './useDidMount';

const ACTION_TYPES = {
  START: 'START',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  TIMEOUT: 'TIMEOUT',
  RESET: 'RESET'
} as const;

type STATUS = 'READY' | 'DOING';

interface AsyncActionState<P, E> {
  status: STATUS;
  data: P | null;
  error: E | null;
}

type AsyncAction<P, E> =
  | { readonly type: 'START' | 'RESET' }
  | {
      readonly type: 'SUCCESS' | 'ERROR' | 'TIMEOUT';
      readonly payload: {
        readonly data: P | E;
        readonly options: {
          keepPreviousState?: boolean;
        };
      };
    };

const asyncActionReducer = <P, E>(
  state: AsyncActionState<P, E>,
  action: AsyncAction<P, E>
): AsyncActionState<P, E> => {
  switch (action.type) {
    case 'START': {
      return {
        ...state,
        status: 'DOING'
      };
    }
    case 'SUCCESS': {
      const { data, options } = action.payload || {};
      return {
        ...state,
        status: 'READY',
        data: options.keepPreviousState ? merge(state.data, data as P) : (data as P),
        error: null
      };
    }
    case 'ERROR': {
      return {
        ...state,
        status: 'READY',
        data: null,
        error: (action?.payload?.data as E) || (action?.payload as any)?.response?.data
      };
    }
    case 'RESET': {
      return {
        status: 'READY',
        data: null,
        error: null
      };
    }
    default:
      return state;
  }
};

const useAsyncAction = <P, A extends unknown[], E = unknown>(
  asyncFunction: (...args: A) => Promise<P>,
  options: {
    callOnFirst?: boolean;
    callOnFirstArgs?: Parameters<typeof asyncFunction>;
    excludePending?: boolean;
    keepPrevData?: boolean;
    onSuccess?: (res: P) => void;
    onFailed?: (error: E) => void;
  } = {
    callOnFirst: false
  }
) => {
  const mountedRef = useRef(true);
  const lastCancelableAsyncTask = useRef<CancelablePromise | null>(null);
  const [state, dispatcher] = useReducer<Reducer<AsyncActionState<P, E>, AsyncAction<P, E>>>(
    asyncActionReducer,
    {
      status: 'READY',
      data: null,
      error: null
    }
  );

  const action = (res: any, value: any, type: string, ident = '') => {
    switch (type) {
      case 'update':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: [
              ...res.data.data.data.map((item: any) => {
                if (item[ident] === value[ident]) {
                  return value;
                }
                return item;
              })
            ]
          }
        };
      case 'updateV2':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: [
              {
                ...res.data.data.data[0],
                data: [
                  ...res.data.data.data[0].data.map((item: any) => {
                    if (item[ident].toString() === value[ident].toString()) {
                      return value;
                    }
                    return item;
                  })
                ]
              }
            ]
          }
        };

      case 'create':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: [...res.data.data.data, value]
          }
        };
      case 'createV2':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: [
              {
                ...res.data.data.data[0],
                data: [...res.data.data.data[0].data, value]
              }
            ]
          }
        };
      case 'delete':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: [...res.data.data.data.filter((item: any) => item[ident] !== value[ident])]
          }
        };
      case 'deleteV2':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: [
              {
                ...res.data.data.data[0],
                data: [
                  ...res.data.data.data[0].data.filter((item: any) => item[ident] !== value[ident])
                ]
              }
            ]
          }
        };
      case 'multipleDelete':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: [
              ...res.data.data.data.filter((item: any) => {
                return !value.some((i: any) => i[ident] === item[ident]);
              })
            ]
          }
        };
      case 'empty':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: [{ data: [] }]
          }
        };
      case 'emptyDetail':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: []
          }
        };
      case 'updateDetail':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: [
              {
                ...res.data.data.data,
                ...value
              }
            ]
          }
        };
      case 'newList':
        return {
          ...res.data,
          data: {
            ...res.data.data,
            data: [
              {
                ...res.data.data.data[0],
                data: [value]
              }
            ]
          }
        };

      default:
        return res;
    }
  };

  const setState = (res: any, value: any, handleType: string, ident = '') => {
    const data = action(res, value, handleType, ident);

    dispatcher({
      type: ACTION_TYPES.SUCCESS,
      payload: {
        data,
        options: {
          keepPreviousState: options.keepPrevData
        }
      }
    });
    return data;
  };

  const exportState = useMemo(
    () => ({
      ...state,
      loading: state.status === 'DOING',
      ready: state.status === 'READY'
    }),
    [state]
  );

  const execute = useCallback(
    (...args: Parameters<typeof asyncFunction>) => {
      if (state.status !== 'DOING' && !options.excludePending) {
        dispatcher({
          type: ACTION_TYPES.START
        });
      }

      if (lastCancelableAsyncTask.current) {
        lastCancelableAsyncTask.current.cancel();
      }

      const cancelableAsyncTask = new CancelablePromise();
      lastCancelableAsyncTask.current = cancelableAsyncTask;

      return cancelableAsyncTask.wrap<P>(
        asyncFunction(...args)
          .then((res: P | any) => {
            lastCancelableAsyncTask.current = null;
            if (res?.data) {
              if (!mountedRef.current) {
                cancelableAsyncTask.cancel();
                return null;
              }

              if (cancelableAsyncTask.complete) return null;

              if (typeof options.onSuccess === 'function') {
                options.onSuccess(res);
              }

              dispatcher({
                type: ACTION_TYPES.SUCCESS,
                payload: {
                  data: res,
                  options: {
                    keepPreviousState: options.keepPrevData
                  }
                }
              });
            } else if (res?.errors) {
              if (!mountedRef.current) return null;

              if (CancelablePromise.isCancelError(res)) return res;

              if (typeof options.onFailed === 'function') {
                options.onFailed(res);
              }

              dispatcher({
                type: ACTION_TYPES.ERROR,
                payload: res
              });
            }
            return res;
          })
          .catch((error) => {
            lastCancelableAsyncTask.current = null;

            if (!mountedRef.current) return null;

            if (CancelablePromise.isCancelError(error)) return error;

            if (typeof options.onFailed === 'function') {
              options.onFailed(error);
            }

            return dispatcher({
              type: ACTION_TYPES.ERROR,
              payload: error
            });
          })
      );
    },
    [asyncFunction, options, state.status]
  );

  const cancel = useCallback(() => {
    if (lastCancelableAsyncTask.current) {
      lastCancelableAsyncTask.current.cancel();
    }
  }, []);

  const reset = useCallback(() => {
    dispatcher({
      type: ACTION_TYPES.RESET
    });
  }, []);

  useDidMount(() => {
    if (options.callOnFirst) {
      execute(...((options.callOnFirstArgs || []) as A));
    }

    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  });

  return useMemo(
    () => [execute, exportState, setState, reset, cancel] as const,
    [exportState, execute, reset, cancel, setState]
  );
};

export default useAsyncAction;
