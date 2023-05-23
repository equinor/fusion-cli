/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useFusionContext, AppManifest, Context } from '@equinor/fusion';

import { ErrorMessage, ErrorBoundary } from '@equinor/fusion-components';
import { Loader } from './Loader';

import { useFramework } from '@equinor/fusion-framework-react';
import { AppModule, AppModulesInstance } from '@equinor/fusion-framework-module-app';
import { ContextItem, ContextModule, IContextProvider } from '@equinor/fusion-framework-module-context';
import { INavigationProvider, NavigationModule, NavigationProvider } from '@equinor/fusion-framework-module-navigation';
import { useObservableState, useObservableSubscription } from '@equinor/fusion-observable/react';
import { EMPTY, Observable, filter, lastValueFrom, map, switchMap } from 'rxjs';

import { createLegacyRender } from '@equinor/fusion-framework-legacy-interopt';

export const AppLoader = (): JSX.Element => {
  const fusionLegacyContext = useFusionContext();
  const [appKey, setAppKey] = useState<string | null>(null);
  const {
    app: { container: appContainer }
  } = fusionLegacyContext;

  /* ------- */
  const [isFetching, setIsFetching] = useState(!appContainer?.currentApp);
  
  const framework = useFramework<[AppModule, NavigationModule, ContextModule]>();
  const { value: currentApp } = useObservableState(useMemo(() => framework.modules.app.current$, [framework]));

  useEffect(() => {
    if (!appContainer) return;
    const script = document.createElement('script');
    script.src = '/app.bundle.js';
    script.onload = () => {
      console.log('🥷🏻 script bundle loaded');
      setAppKey(Object.keys(appContainer.allApps)[0]);
    };

    document.head.appendChild(script);
    return () => {
      script.remove();
    }
  }, [appContainer]);

  const modules$ = useMemo(() => {
    if (!currentApp) {
      return EMPTY;
    }
    return (currentApp.instance$ as Observable<AppModulesInstance<[ContextModule, NavigationModule]>>).pipe(
      filter(modules => !!modules.context && !!modules.navigation),
      map(modules => {
        // TODO remove hack
        /**
         * since some of these functions only are available in `@equinor/fusion-framework-module-navigation@^2.1.0-next.0`
         * we create a virtual `NavigationProvider` to support these functions
         * in the future there should be a semver of the modules and do check by satisfaction
         */
        const navigation = new NavigationProvider({
          config: {
            basename: '/',
            history: modules.navigation.navigator
          }
        });
        return { context: modules.context, navigation };
      })
    );
  }, [currentApp]);

  const context$ = useMemo(
    () =>
      modules$.pipe(
        switchMap(modules => {
          return modules.context.currentContext$.pipe(
            switchMap(item =>
              fusionLegacyContext.contextManager.setAsync('current', item).then(() => ({ item, modules }))
            )
          );
        })
      ),
    [modules$]
  );

  useObservableSubscription(
    context$,
    useCallback(
      ({
        item,
        modules
      }: {
        item?: ContextItem | null;
        modules: { context: IContextProvider; navigation: INavigationProvider };
      }) => {
        if (!currentApp || item === undefined) {
          return;
        }
        const { navigation } = modules;

        const manifest = (currentApp.state.manifest as unknown) as AppManifest | undefined;

        if (manifest?.context?.buildUrl) {
          navigation.replace(
            manifest.context.buildUrl(
              (item as unknown) as Context,
              navigation.path.pathname.concat(navigation.path.search)
            )
          );
        }
        console.debug('navigating to context');
        if (item === null) {
          return navigation.replace('/');
        }
        const partialPath = navigation.path.pathname.replace(/^\/+/, '').split('/') ?? [];
        const contextId = partialPath.shift();
        if (contextId) {
          return navigation.replace({
            ...navigation.path,
            pathname: ['', item.id, ...partialPath].join('/')
          });
        }

        navigation.replace(`/${item.id}`);
      },
      [currentApp]
    )
  );

  const appManifest = currentApp && appContainer.get(currentApp?.appKey);
  
  const setCurrentApp = useCallback(async () => {
    setIsFetching(true);
    console.debug('💾 loading application', appKey);
    try {
      // TODO - use before loading applications
      await lastValueFrom(framework.modules.app.getAllAppManifests());
      await appContainer.setCurrentAppAsync(appKey || null);
    } catch (e) {
      console.error('No app found for app key ', appKey, e);
    } finally {
      setTimeout(() => setIsFetching(false), 10);
    }
  }, [framework, appContainer, appKey]);

  useEffect(() => {
    setCurrentApp();
    return () => framework.modules.app.clearCurrentApp();
  }, [setCurrentApp]);

  useEffect(() => {
    if (appManifest) {
      document.title = appManifest?.name ? `Fusion | ${appManifest?.name}` : 'Fusion';
    }
    return () => {
      document.title = 'Fusion';
    };
  }, [appManifest]);

  const basename = '/';

  const AppComponent = useMemo(() => {
    if (!appManifest || !appManifest.AppComponent) {
      return null;
    }

    const { manifest, config } = currentApp;
    const render =
      appManifest.render ??
      createLegacyRender(
        appManifest.key,
        (appManifest.AppComponent as unknown) as React.FunctionComponent,
        fusionLegacyContext
      );
    // @ts-ignore
    return render(window.Fusion, { manifest, config, basename });
  }, [fusionLegacyContext, appManifest]);

  if (!appManifest || isFetching || (appManifest && appManifest.key !== appKey)) {
    return <Loader text="Loading application data" />;
  }

  return (
    <ErrorBoundary>
      {/* <Suspense fallback={<Loader text="Loading application" />}> */}
      <Suspense fallback={<Loader text="Loading application" />}>
        {/* @ts-ignore */}
        <AppComponent />
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppLoader;
