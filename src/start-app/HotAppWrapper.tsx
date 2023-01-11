/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { FunctionComponent, Suspense, useEffect, useMemo } from 'react';
import { useFusionContext, useNotificationCenter } from '@equinor/fusion';
import { AppManifest } from '@equinor/fusion/lib/app/AppContainer';

import { useFramework } from '@equinor/fusion-framework-react';
import type { AppModule } from '@equinor/fusion-framework-module-app';
import { StarProgress } from '@equinor/fusion-react-progress-indicator';

import { Router, BrowserRouter } from 'react-router-dom';

import { App } from '@equinor/fusion-framework-module-app';
// import { enableContext } from '@equinor/fusion-framework-react-module-context';
import { useObservableState } from '@equinor/fusion-observable/react';

const AppLoader = ({ app }: { app: App }) => {
  const framework = useFramework<[AppModule]>();
  const { history } = useFusionContext();
  const { manifest, config } = app.state;
  const Component = useMemo(() => {
    console.log('🥷🏻 Rendering app component');
    // @ts-ignore
    const { AppComponent, render } = manifest;
    return render
      ? render(framework, { config, manifest })
      : () => (
          <BrowserRouter>
            <Router history={history}>
              <AppComponent />
            </Router>
          </BrowserRouter>
        );
  }, [framework, history, config, manifest]);

  return (
    <Suspense fallback={<StarProgress>Loading Application</StarProgress>}>
      <Component />
    </Suspense>
  );
};

const getFirstApp = (apps: Record<string, AppManifest>) => Object.keys(apps)[0];

export const HotAppWrapper: FunctionComponent = () => {
  console.log('🥷🏻  app wrapper start');

  const framework = useFramework<[AppModule]>();

  const {
    app: { container: appContainer },
  } = useFusionContext();

  const currentApp = useObservableState(useMemo(() => framework.modules.app.current$, [framework]));

  const sendNotification = useNotificationCenter();

  useEffect(() => {
    console.log('🥷🏻  loading script bundle');
    const script = document.createElement('script');
    script.src = '/app.bundle.js';
    script.onload = () => {
      console.log('🥷🏻 script bundle loaded');
      setTimeout(() => {
        appContainer.setCurrentAppAsync(getFirstApp(appContainer.allApps));
      }, 100);
    };
    document.head.appendChild(script);
    // const unsubscribe = appContainer.on('update', (apps) => {
    //   console.log('🥷🏻 app container changed');
    //   appContainer.setCurrentAppAsync(getFirstApp(appContainer.allApps));
    // });
    return () => {
      script.remove();
      // unsubscribe();
    };
  }, [appContainer, framework]);

  useEffect(() => {
    currentApp &&
      sendNotification({
        cancelLabel: 'I know',
        level: 'low',
        title: `${currentApp.appKey} is updated`,
      });
  }, [sendNotification, currentApp]);

  if (!currentApp) {
    return null;
  }

  return <AppLoader app={currentApp} />;
};

export default HotAppWrapper;
