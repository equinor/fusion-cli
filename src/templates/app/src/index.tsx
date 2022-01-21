import { registerApp as registerLegacy } from '@equinor/fusion';
import { AppConfigurator, createApp, useModuleContext } from '@equinor/fusion-framework-react-app';

// TODO move this to a package for config http
import http, { HttpClient, HttpClientProvider, HttpModule } from '@equinor/fusion-framework-module-http';
import msal, { MsalModule } from '@equinor/fusion-framework-module-msal';

/**
 *   config.http.configureClient('service_discovery', {
    defaultUri: 'https://pro-s-portal-ci.azurewebsites.net',
    onCreate: (client) => {
      client.defaultScope = ['97978493-9777-4d48-b38a-67b0b9cd88d2/.default'];
    },
  });
 */
// import App from './App';
import { useEffect, useState } from 'react';
import { App } from './types';

export const configCallback: AppConfigurator<[HttpModule, MsalModule]> = async (appModuleConfig, frameworkApi) => {
  console.log(11, 'configuring app', frameworkApi, appModuleConfig);
  const portal = await frameworkApi.modules.serviceDiscovery.resolveService('portal');
  appModuleConfig.http.configureClient('portal', {
    defaultUri: portal?.uri,
    onCreate: (client) => {
      client.defaultScope = ['5a842df8-3238-415d-b168-9f16a6a6031b/.default'];
    },
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

const AppComponent = () => {
  const [apps, setApps] = useState<App[]>([]);
  const x = useModuleContext<{ http: HttpClientProvider<HttpClient> }>();
  
  // const fusionClient = useFrameworkClient('portal');

  useEffect(() => {
    const client = x.http.createClient('portal');
    client
      .fetchAsync('/api/apps')
      .then((x) => x.json())
      .then(setApps);
  }, [x]);

  if (!apps.length) {
    return <span>Loading apps.....</span>;
  }

  return (
    <ul>
      {apps.map((x) => (
        <li key={x.key}>{x.name}</li>
      ))}
    </ul>
  );
};

// @ts-ignore
export const setup = createApp(AppComponent, configCallback, [http, msal]);

registerLegacy('test-app', {
  // @ts-ignore TODO: update interface in fusion-api
  render: setup,
  AppComponent,
});

if (module.hot) {
  module.hot.accept();
}

export default setup;
