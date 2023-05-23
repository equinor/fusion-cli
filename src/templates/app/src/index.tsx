import { registerApp } from '@equinor/fusion';
import { createComponent } from '@equinor/fusion-framework-react-app';

import { configureFramework } from './config';
import AppComponent from './App';

export const render = createComponent(AppComponent, configureFramework);

registerApp('test-app', {
  AppComponent,
  render
});

if (module.hot) {
  module.hot.accept();
}

export default render;
