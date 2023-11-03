import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import { useFramework } from '@equinor/fusion-framework-react';
import type { AppModule } from '@equinor/fusion-framework-module-app';
import type { NavigationModule } from '@equinor/fusion-framework-module-navigation';
import { LegacyFusionWrapper } from '@equinor/fusion-framework-legacy-interopt/components';

import { ThemeProvider, theme } from '@equinor/fusion-react-styles';
import { FusionHeader, FusionContent } from '@equinor/fusion-components';


import { AppLoader } from './AppLoader';
import { ContextSelector } from './components/ContextSelector';
import { Loader } from './Loader';

import { PeopleResolverProvider } from '@equinor/fusion-framework-react-components-people-provider';

export const Portal = (): JSX.Element => {
  const framework = useFramework<[AppModule, NavigationModule]>();
  return (
    <ThemeProvider theme={theme}>
      <PeopleResolverProvider>
        <LegacyFusionWrapper
          framework={framework}
          loader={<Loader />}
          options={{ loadBundlesFromDisk: true, environment: { env: 'dev' } }}
        >
          <BrowserRouter>
            <FusionHeader aside={null} content={ContextSelector} start={null} settings={null} />
          </BrowserRouter>
          <FusionContent>
            <AppLoader />
          </FusionContent>
        </LegacyFusionWrapper>
      </PeopleResolverProvider>
    </ThemeProvider>
  );
};

export default Portal;
