/* eslint-disable react/no-multi-comp */
import React from 'react';

import { BrowserRouter } from 'react-router-dom';

import { useFramework } from '@equinor/fusion-framework-react';
import type { AppModule } from '@equinor/fusion-framework-module-app';
import type { NavigationModule } from '@equinor/fusion-framework-module-navigation';
import { LegacyFusionWrapper } from '@equinor/fusion-framework-legacy-interopt/components';

import { ThemeProvider, theme } from '@equinor/fusion-react-styles';
import { FusionHeader, FusionContent } from '@equinor/fusion-components';
import { StarProgress } from '@equinor/fusion-react-progress-indicator';

import { ContextSelector } from './components/ContextSelector';

import { HotAppWrapper } from './HotAppWrapper';

export const Portal = () => {
  const framework = useFramework<[AppModule, NavigationModule]>();
  return (
    <ThemeProvider theme={theme}>
      <LegacyFusionWrapper framework={framework} loader={<StarProgress />} options={{ loadBundlesFromDisk: true }}>
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
