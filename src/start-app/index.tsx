import './customElementPolyfill';
import { StarProgress } from '@equinor/fusion-react-progress-indicator';
import { render } from '@hot-loader/react-dom';
import React, { Suspense } from 'react';
import Framework from './Framework';
import Portal from './Portal';

render(
  <Suspense fallback={<StarProgress text="Loading framework" />}>
    <Framework>
      <Portal />
    </Framework>
  </Suspense>,
  document.getElementById('fusion-app')
);
