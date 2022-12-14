/* eslint-disable react/no-multi-comp */
import React, { useRef } from 'react';

import { FusionContext } from '@equinor/fusion';
import { ThemeProvider } from '@equinor/fusion-react-styles';
import { FusionRoot, FusionHeader, FusionContent, HeaderContentProps } from '@equinor/fusion-components';

import { createFusionContext } from './create-fusion-context';

import { HotAppWrapper } from './HotAppWrapper';
import { BrowserRouter } from 'react-router-dom';

import { useFramework } from '@equinor/fusion-framework-react';
import { AppModule } from '@equinor/fusion-framework-module-app';

import { ContextSelector } from './ContextSelector';

// const HeaderContextSelector: FunctionComponent<HeaderContentProps> = ({ app }) => {
//   return app?.context?.types.length ? <ContextSelectorComponent /> : null;
// };

export const Portal = () => {
  console.log(1, 'rerendering portal');
  const rootEl = document.createElement('div');
  const overlayEl = document.createElement('div');

  rootEl.appendChild(overlayEl);

  const root = useRef(rootEl);
  const overlay = useRef(overlayEl);

  const headerContent = useRef<HTMLElement | null>(null);
  const headerAppAside = useRef<HTMLElement | null>(null);

  const framework = useFramework<[AppModule]>();

  const fusionContext = createFusionContext({
    framework,
    refs: {
      headerAppAside,
      headerContent,
      overlay,
      root,
    },
  });

  return (
    <FusionContext.Provider value={fusionContext}>
      <ThemeProvider seed="fusion-dev-app">
        <FusionRoot rootRef={root} overlayRef={overlay}>
          <BrowserRouter>
            <FusionHeader aside={null} content={ContextSelector} start={null} settings={null} />
          </BrowserRouter>
          <FusionContent>
            <HotAppWrapper />
          </FusionContent>
        </FusionRoot>
      </ThemeProvider>
    </FusionContext.Provider>
  );
};

export default Portal;
