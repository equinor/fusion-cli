/* eslint-disable react/no-multi-comp */
import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import { useFramework } from '@equinor/fusion-framework-react';
import type { AppModule } from '@equinor/fusion-framework-module-app';
import type { NavigationModule } from '@equinor/fusion-framework-module-navigation';
import { LegacyFusionWrapper } from '@equinor/fusion-framework-legacy-interopt/components';

import { ThemeProvider, theme } from '@equinor/fusion-react-styles';
import { FusionHeader, FusionContent } from '@equinor/fusion-components';
import { Loader } from './Loader';

import { ContextSelector } from './components/ContextSelector';

import { HotAppWrapper } from './HotAppWrapper';

export const Portal = (): JSX.Element => {
  const framework = useFramework<[AppModule, NavigationModule]>();
  return (
    <ThemeProvider theme={theme}>
      <LegacyFusionWrapper
        framework={framework}
        loader={<Loader />}
        options={{ loadBundlesFromDisk: true, environment: { env: 'dev' } }}
      >
        <BrowserRouter>
          <FusionHeader aside={null} content={ContextSelector} start={null} settings={null} />
        </BrowserRouter>
        <FusionContent>
          <HotAppWrapper />
        </FusionContent>
      </LegacyFusionWrapper>
    </ThemeProvider>
  );
};

export default Portal;
