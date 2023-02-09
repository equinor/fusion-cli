import './customElementPolyfill';
import { render } from '@hot-loader/react-dom';
import React, { Suspense } from 'react';
import Framework from './Framework';
import Portal from './Portal';
import Loader from './Loader';
import { PersonResolver } from './components/PersonResolver/PersonResolver';

render(
  <Suspense fallback={<Loader />}>
    <Framework>
      <PersonResolver>
        <Portal />
      </PersonResolver>
    </Framework>
  </Suspense>,
  document.getElementById('fusion-app')
);
