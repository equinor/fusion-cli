import { registerApp as registerLegacy, ContextTypes, Context } from '@equinor/fusion';
import { createApp } from '@equinor/fusion-framework-react-app';

import { configCallback } from './config';
import AppComponent from './App';

export const render = createApp(AppComponent, configCallback);

registerLegacy('test-app', {
  render,
  AppComponent,
  context: {
    types: [ContextTypes.OrgChart],
    buildUrl: (context: Context | null, url: string) => {
      if (!context) return '';

      if (url.indexOf(context.id) > -1 || url.indexOf('help') > -1) return url;

      return `/${context?.id}`;
    },
    getContextFromUrl: (url: string) => {
      if (url.indexOf('help') > -1) return '';

      const contextId = url.split('/')[1];
      if (!contextId) return '';

      return contextId.length > 10 ? contextId : '';
    },
  },
});

if (module.hot) {
  module.hot.accept();
}

export default render;
