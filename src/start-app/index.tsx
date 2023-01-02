import './customElementPolyfill';
import { render } from '@hot-loader/react-dom';
import React, { Suspense } from 'react';
import Framework from './Framework';
import Portal from './Portal';
import Loader from './Loader';

render(
  <Suspense fallback={<Loader />}>
    <Framework>
      <Portal />
    </Framework>
  </Suspense>,
  document.getElementById('fusion-app')
);
