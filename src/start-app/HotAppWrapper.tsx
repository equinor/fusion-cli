/* eslint-disable react/display-name */
/* eslint-disable react/no-multi-comp */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FunctionComponent, Suspense, useEffect, useMemo } from 'react';
import { useFusionContext, useNotificationCenter } from '@equinor/fusion';
import { AppManifest, useCurrentApp } from '@equinor/fusion/lib/app/AppContainer';

import { useFramework } from '@equinor/fusion-framework-react/hooks';

import { StarProgress } from '@equinor/fusion-react-progress-indicator';

import { Router, BrowserRouter } from 'react-router-dom';

const AppLoader = ({ app }: { app: AppManifest }) => {
  console.log('🥷🏻 rendering app');
  const framework = useFramework();
  const { history } = useFusionContext();
  const Component = useMemo(() => {
    console.log('🥷🏻 created app component');
    const { AppComponent, render } = app;
    console.log(history);
    // @ts-ignore
    return render
      ? render(framework, app)
      : () => (
          <BrowserRouter>
            <Router history={history}>
              <AppComponent />
            </Router>
          </BrowserRouter>
        );
  }, [app, framework]);

  return (
    <Suspense fallback={<StarProgress>Loading Application</StarProgress>}>
      <Component />
    </Suspense>
  );
};

const getFirstApp = (apps: Record<string, AppManifest>) => Object.keys(apps)[0];

export const HotAppWrapper: FunctionComponent = () => {
  console.log('🥷🏻  app wrapper start');
  const {
    app: { container: appContainer },
  } = useFusionContext();

  const currentApp = useCurrentApp();
  const sendNotification = useNotificationCenter();

  useEffect(() => {
    console.log('🥷🏻  loading script');
    const script = document.createElement('script');
    script.src = '/app.bundle.js';
    script.onload = () => {
      console.log('🥷🏻 app bundle loaded');
      appContainer.setCurrentAppAsync(getFirstApp(appContainer.allApps));
    };
    document.head.appendChild(script);
    const unsubscribe = appContainer.on('update', (apps) => {
      console.log('🥷🏻 app container changed');
      appContainer.setCurrentAppAsync(getFirstApp(apps));
    });
    return () => {
      script.remove();
      unsubscribe();
    };
  }, [appContainer]);

  useEffect(() => {
    currentApp &&
      sendNotification({
        cancelLabel: 'I know',
        level: 'low',
        title: `${currentApp.name} is updated`,
      });
  }, [sendNotification, currentApp]);

  if (!currentApp) {
    return null;
  }

  return <AppLoader app={currentApp} />;
};

export default HotAppWrapper;
