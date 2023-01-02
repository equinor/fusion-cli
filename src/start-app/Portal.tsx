/* eslint-disable react/no-multi-comp */
import React, { useRef, FunctionComponent } from 'react';

import { FusionContext } from '@equinor/fusion';
import { ThemeProvider } from '@equinor/fusion-react-styles';
import { FusionRoot, FusionHeader, FusionContent, HeaderContentProps } from '@equinor/fusion-components';

import { createFusionContext } from './create-fusion-context';

import { HotAppWrapper } from './HotAppWrapper';
import { BrowserRouter } from 'react-router-dom';

import { useFramework } from '@equinor/fusion-framework-react';
import { AppModule } from '@equinor/fusion-framework-module-app';

import { ContextSelector, ContextSelectorProvider } from './components/ContextSelector';

const HeaderContextSelector: FunctionComponent<HeaderContentProps> = ({ app }) => {
  const framework = useFramework();
  if (!app?.context && !framework.modules.context) {
    return null;
  }
  return <ContextSelector />;
};

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
          <ContextSelectorProvider>
            <BrowserRouter>
              <FusionHeader aside={null} content={HeaderContextSelector} start={null} settings={null} />
            </BrowserRouter>
            <FusionContent>
              <HotAppWrapper />
            </FusionContent>
          </ContextSelectorProvider>
        </FusionRoot>
      </ThemeProvider>
    </FusionContext.Provider>
  );
};

export default Portal;
