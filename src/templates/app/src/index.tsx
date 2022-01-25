import { registerApp as registerLegacy } from '@equinor/fusion';
import { createApp } from '@equinor/fusion-framework-react-app';

import { configCallback } from './config';
import AppComponent from './App';

export const setup = createApp(AppComponent, configCallback);

registerLegacy('test-app', {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore TODO: update interface in fusion-api
  render: setup,
  AppComponent,
});

if (module.hot) {
  module.hot.accept();
}
