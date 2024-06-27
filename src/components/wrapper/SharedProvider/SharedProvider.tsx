import { useState } from 'react';
import Context, { ContextValue } from './SharedContext';
import { Drawer } from 'components/shared';

export interface SharedProviderProps {
  children?: React.ReactNode;
}

function Provider(props: SharedProviderProps) {
  const { children } = props;
  const states = useState<ContextValue>({
    drawer: {}
  });
  const [state, setState] = states;

  return (
    <Context.Provider value={[state, setState]}>
      {children}
      <Drawer {...state.drawer} />
    </Context.Provider>
  );
}

export default Provider;
