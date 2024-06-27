/* eslint-disable default-param-last */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

const useDidMount = (callback: (controller?: AbortController) => void, dependencies: any = []) => {
  useEffect(() => {
    const controller = new AbortController();
    if (typeof callback === 'function') {
      callback(controller);
    }
    return () => {
      controller.abort();
    };
  }, [...dependencies]);
};

export default useDidMount;
