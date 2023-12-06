import React, { useEffect, useMemo, useState } from 'react';

import { BrowserRouter } from 'react-router-dom';

import { useFramework } from '@equinor/fusion-framework-react';
import type { AppModule, AppManifest } from '@equinor/fusion-framework-module-app';
import type { NavigationModule } from '@equinor/fusion-framework-module-navigation';
import { LegacyFusionWrapper } from '@equinor/fusion-framework-legacy-interopt/components';

import { useCurrentApp } from '@equinor/fusion-framework-react/app';

import { ThemeProvider, theme } from '@equinor/fusion-react-styles';
import { FusionHeader, FusionContent } from '@equinor/fusion-components';


import { AppLoader } from './AppLoader';
import { ContextSelector } from './components/ContextSelector';
import { Loader } from './Loader';

import { PeopleResolverProvider } from '@equinor/fusion-framework-react-components-people-provider';

export const Portal = (): JSX.Element => {
  const framework = useFramework<[AppModule, NavigationModule]>();
  const { currentApp } = useCurrentApp<[AppModule]>();
  const [manifest, setManifest] = useState<AppManifest>();

  useEffect(() => {
    if (currentApp) {
      currentApp.getManifestAsync().then(manifest => {
        setManifest(manifest);
      });
    } else {
      setManifest(undefined);
    }
  }, [currentApp]);

  return (
    <ThemeProvider theme={theme}>
      <PeopleResolverProvider>
        <LegacyFusionWrapper
          framework={framework}
          loader={<Loader text="Loading framework" />}
          options={useMemo(() => ({ loadBundlesFromDisk: true, environment: { env: 'dev' } }), [])}
        >
          <BrowserRouter>
            <FusionHeader aside={null} content={(app) => <ContextSelector app={null} />} start={null} settings={null} currentApp={manifest} />
          </BrowserRouter>
          { /* @ts-ignore */ }
          <FusionContent>
            <AppLoader />
          </FusionContent>
        </LegacyFusionWrapper>
      </PeopleResolverProvider>
    </ThemeProvider>
  );
};

export default Portal;
