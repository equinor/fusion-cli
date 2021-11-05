import { registerApp } from '@equinor/fusion';

import App from './App';

registerApp('{appKey}', {
  AppComponent: App,
});

if (module.hot) {
  module.hot.accept();
}
