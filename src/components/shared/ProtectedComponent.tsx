import React from 'react';
import { StoreState, useAppSelector } from 'store';

export interface ProtectedComponentProps {
  children?: string | number | React.ReactElement | React.ReactNode | null;
  renderIfTrue?: (store: StoreState) => boolean;
}

export default function ProtectedComponent({ children, renderIfTrue }: ProtectedComponentProps) {
  const store = useAppSelector((store) => store);

  if ((renderIfTrue && renderIfTrue(store)) || !renderIfTrue) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <React.Fragment />;
}
