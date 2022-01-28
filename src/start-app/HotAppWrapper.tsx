/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FunctionComponent, Suspense, useEffect } from 'react';
import { useFusionContext, useNotificationCenter } from '@equinor/fusion';
import { AppManifest, useCurrentApp } from '@equinor/fusion/lib/app/AppContainer';
import { useAppAuth } from '@equinor/fusion/lib/hooks/useAppAuth';

import { createFrameworkProvider } from '@equinor/fusion-framework-react';
import { useFramework } from '@equinor/fusion-framework-react/hooks';

type ServiceConfig = {
  client_id: string;
};

const Framework = createFrameworkProvider(async (config) => {
  console.debug('configuring framework');
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const serviceConfig: ServiceConfig | undefined = await fetch('/env/portal-client-id').then((x) => x.json());
  config.auth.configureDefault({
    tenantId: '3aa4a235-b6e2-48d5-9195-7fcf05b459b0',
    clientId: serviceConfig?.client_id ?? '9b707e3a-3e90-41ed-a47e-652a1e3b53d0',
    redirectUri: '/authentication/login-callback',
  });
  // add a setup method for this!
  config.http.configureClient('service_discovery', {
    baseUri: 'https://pro-s-portal-ci.azurewebsites.net',
    onCreate: (client) => {
      client.defaultScope = ['97978493-9777-4d48-b38a-67b0b9cd88d2/.default'];
    },
  });
  config.onAfterConfiguration(() => {
    console.debug('framework config done');
  });
  // TODO - this is ninja, make a auth provider
  config.onAfterInit(async (fusion) => {
    await fusion.auth.handleRedirect();
    if (!fusion.auth.defaultAccount) {
      await fusion.auth.login();
    }
  });
});

const AppLoader = ({ app }: { app: AppManifest }) => {
  const framework = useFramework();
  // @ts-ignore
  const Component = app.render ? app.render(framework, app) : app.AppComponent;
  return (
    <Suspense fallback={<h1>Loading Application</h1>}>
      <Component />
    </Suspense>
  );
};

const getFirstApp = (apps: Record<string, AppManifest>) => Object.keys(apps)[0];

const HotAppWrapper: FunctionComponent = () => {
  const {
    app: { container: appContainer },
  } = useFusionContext();

  console.debug('app wrapper start');

  const currentApp = useCurrentApp();
  const sendNotification = useNotificationCenter();

  // TODO - use framework MSAL
  const authorized = useAppAuth(currentApp?.auth);

  useEffect(() => {
    if (currentApp) return;
    !currentApp && appContainer.setCurrentAppAsync(getFirstApp(appContainer.allApps));

    return appContainer.on('update', (apps) => {
      appContainer.setCurrentAppAsync(getFirstApp(apps));
    });
  }, [appContainer, currentApp]);

  useEffect(() => {
    currentApp &&
      sendNotification({
        cancelLabel: 'I know',
        level: 'low',
        title: `${currentApp.name} is updated`,
      });
  }, [sendNotification, currentApp]);

  if (!authorized || !currentApp) {
    return null;
  }

  // @ts-ignore
  return (
    <Suspense fallback={<h1>Loading Framework</h1>}>
      <Framework>
        <AppLoader app={currentApp} />
      </Framework>
    </Suspense>
  );
};

export default HotAppWrapper;
