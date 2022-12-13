// TODO: @odinr please fix me
const _customElementsDefine = window.customElements.define;
window.customElements.define = (name, cl, conf) => {
  if (!customElements.get(name)) {
    _customElementsDefine.call(window.customElements, name, cl, conf);
  } else {
    console.debug(`${name} has been defined twice`);
  }
};

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
