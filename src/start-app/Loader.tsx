import React from 'react';
import { StarProgress } from '@equinor/fusion-react-progress-indicator';

export const Loader = ({ children }: React.PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <StarProgress text="Loading framework">{children}</StarProgress>
    </div>
  );
};

export default Loader;
