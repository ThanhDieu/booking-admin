/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';

// v2
export const useDataDisplayV2 = <T>(
  dataState: any,
  calback?: (res: T[], pagination: PaginationType) => void,
  dependency?: any
) => {
  const resultState = useMemo(() => {
    if (!dataState.data?.data.success) return { list: [], pagination: undefined };
    const list: T[] = dataState.data?.data?.data.length ? dataState.data?.data?.data[0].data : [];
    const pagination: PaginationType = dataState.data?.data?.data.length
      ? dataState.data?.data?.data[0].pagination
      : undefined;
    if (calback) calback(list, pagination);
    return {
      list,
      pagination
    };
  }, [dataState.data?.data.data, dependency && { ...dependency }]);
  return {
    list: resultState?.list as T[],
    pagination: resultState?.pagination
  };
};

// v1
export const useDataDisplay = <T>(
  dataState: any,
  calback?: (res: any) => void,
  dependency?: any
) => {
  const resultState = useMemo<Array<T>>(() => {
    if (!dataState.data?.data.success) return [];
    const res: DataResponseType<T> =
      dataState.data?.data?.data?.length && dataState.data?.data?.data[0]?.pagination
        ? dataState.data?.data?.data[0].data
        : dataState.data?.data?.data;
    if (calback) calback(res);
    return res as any;
  }, [dataState.data?.data.data, dependency && { ...dependency }]);

  return resultState as T[];
};

export const useDetailDisplay = <T>(dataState: any) => {
  const resultState = useMemo(() => {
    if (!dataState.data?.data.success) return;
    return dataState.data?.data?.data ? dataState.data?.data?.data[0] : null;
  }, [dataState.data?.data?.data]);

  return resultState as T;
};
