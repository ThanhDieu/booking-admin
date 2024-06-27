import React from 'react';

export interface ProtectedComponentProps {
  children?: React.ReactNode;
  renderIfTrue?: () => boolean;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ children, renderIfTrue }) => {
  if (renderIfTrue?.()) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return <React.Fragment />;
}
export default ProtectedComponent