import React from 'react';
import { StarProgress } from '@equinor/fusion-react-progress-indicator';

export const Loader = (): JSX.Element => {
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
      <StarProgress text="Loading framework" />
    </div>
  );
};

export default Loader;
