import { registerApp as registerLegacy } from '@equinor/fusion';
import { createApp } from '@equinor/fusion-framework-react-app';

import { configCallback } from './config';
import AppComponent from './App';

export const render = createApp(AppComponent, configCallback);

registerLegacy('test-app', {
  render,
  AppComponent,
});

if (module.hot) {
  module.hot.accept();
}

export default setup;
