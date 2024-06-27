import { DrawerProps } from 'antd';
import SharedContext from 'components/wrapper/SharedProvider/SharedContext';
import { useContext, useEffect } from 'react';

interface PopupActionType {
  doOpen: () => void;
}

const useDrawer = (props: DrawerProps) => {
  const [state, setState] = useContext(SharedContext);

  const handleOpenDrawer = () =>
    setState({
      ...state,
      drawer: {
        ...state.drawer,
        ...props,
        open: true
      }
    });

  const drawer: DrawerProps & PopupActionType = {
    ...state.drawer,
    doOpen: handleOpenDrawer
  };

  useEffect(() => {
    setState({
      ...state,
      drawer: {
        ...state.drawer,
        ...props
      }
    });
  }, []);

  return drawer;
};

export default useDrawer;
