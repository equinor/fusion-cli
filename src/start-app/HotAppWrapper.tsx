/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FunctionComponent, Suspense, useEffect } from 'react';
import { useFusionContext, useNotificationCenter } from '@equinor/fusion';
import { AppManifest, useCurrentApp } from '@equinor/fusion/lib/app/AppContainer';
import { useAppAuth } from '@equinor/fusion/lib/hooks/useAppAuth';

import { createFrameworkProvider, useFramework } from '@equinor/fusion-framework-react';

const Framework = createFrameworkProvider(async (config) => {
  console.log('configuring framework');
  await new Promise((resolve) => setTimeout(resolve, 1000));
  config.auth.configureDefault({
    tenantId: '3aa4a235-b6e2-48d5-9195-7fcf05b459b0',
    clientId: '9b707e3a-3e90-41ed-a47e-652a1e3b53d0',
  });
  // add a setup method for this!
  config.http.configureClient('service_discovery', {
    defaultUri: 'https://pro-s-portal-ci.azurewebsites.net',
    onCreate: (client) => {
      client.defaultScope = ['97978493-9777-4d48-b38a-67b0b9cd88d2/.default'];
    },
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

  console.log(99, 'app wrapper start');

  const currentApp = useCurrentApp();
  const sendNotification = useNotificationCenter();

  const authorized = useAppAuth(currentApp?.auth);

  useEffect(() => {
    console.log(appContainer.allApps);
    !currentApp && appContainer.setCurrentAppAsync(getFirstApp(appContainer.allApps));

    return appContainer.on('update', (apps) => {
      appContainer.setCurrentAppAsync(getFirstApp(apps));
    });
  }, [appContainer.allApps]);

  useEffect(() => {
    sendNotification({
      cancelLabel: 'I know',
      level: 'low',
      title: 'App updated',
    })
      .then()
      .catch();
  }, [currentApp]);

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
