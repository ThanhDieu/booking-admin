import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'store';
import { HelmetProps, set } from 'store/app/helmet';

function useHelmet(props: HelmetProps) {
  const dispatch = useAppDispatch();
  const helmetProps = useAppSelector((state) => state.app.helmet);

  const setHelmetProps = useCallback(
    (attr: HelmetProps) => {
      dispatch(set(attr));
    },
    [dispatch]
  );

  useEffect(() => {
    setHelmetProps(props);
  }, [dispatch, props, setHelmetProps]);

  return [helmetProps, setHelmetProps];
}

export default useHelmet;
