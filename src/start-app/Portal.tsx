import { FunctionComponent, useRef } from 'react';
import { Router } from 'react-router';

import { createFusionContext, FusionContext, ServiceResolver } from '@equinor/fusion';
import { ThemeProvider } from '@equinor/fusion-react-styles';
import {
  FusionRoot,
  FusionHeader,
  FusionContent,
  HeaderContentProps,
  ContextSelector,
} from '@equinor/fusion-components';

import { HotAppWrapper } from './HotAppWrapper';
import createAuthContainer from './create-auth-container';
import { BrowserRouter } from 'react-router-dom';

const HeaderContextSelector: FunctionComponent<HeaderContentProps> = ({ app }) => {
  return app?.context?.types.length ? <ContextSelector /> : null;
};

const serviceResolver: ServiceResolver = {
  getContextBaseUrl: () => 'https://pro-s-context-ci.azurewebsites.net',
  getDataProxyBaseUrl: () => 'https://pro-s-dataproxy-ci.azurewebsites.net',
  getFusionBaseUrl: () => 'https://pro-s-portal-ci.azurewebsites.net',
  getMeetingsBaseUrl: () => 'https://pro-s-meeting-v2-ci.azurewebsites.net',
  getOrgBaseUrl: () => 'https://pro-s-org-ci.azurewebsites.net',
  getPowerBiBaseUrl: () => 'https://pro-s-powerbi-ci.azurewebsites.net',
  getProjectsBaseUrl: () => 'https://pro-s-projects-ci.azurewebsites.net',
  getTasksBaseUrl: () => 'https://pro-s-tasks-ci.azurewebsites.net',
  getPeopleBaseUrl: () => 'https://pro-s-people-ci.azurewebsites.net',
  getReportsBaseUrl: () => 'https://pro-s-reports-ci.azurewebsites.net',
  getPowerBiApiBaseUrl: () => 'https://api.powerbi.com/v1.0/myorg',
  getNotificationBaseUrl: () => 'https://pro-s-notification-ci.azurewebsites.net',
  getInfoUrl: () => 'https://pro-s-info-app-ci.azurewebsites.net',
  getFusionTasksBaseUrl: () => 'https://pro-s-tasks-ci.azurewebsites.net',
  getBookmarksBaseUrl: () => 'https://pro-s-bookmarks-ci.azurewebsites.net',
};

export const Portal = () => {
  console.log(1, 'rerendering portal');
  const rootEl = document.createElement('div');
  const overlayEl = document.createElement('div');

  rootEl.appendChild(overlayEl);

  const root = useRef(rootEl);
  const overlay = useRef(overlayEl);

  // replace with hook
  const authContainer = createAuthContainer(); //({ framework: window.Fusion });

  const headerContent = useRef<HTMLElement | null>(null);
  const headerAppAside = useRef<HTMLElement | null>(null);

  const fusionContext = createFusionContext(
    authContainer,
    serviceResolver,
    {
      headerAppAside,
      headerContent,
      overlay,
      root,
    },
    {
      environment: {
        env: 'dev',
      },
      loadBundlesFromDisk: false,
    }
  );

  const { history } = fusionContext;

  return (
    <FusionContext.Provider value={fusionContext}>
      {/* <BrowserRouter> */}
        {/* <Router history={history}> */}
          <ThemeProvider seed="fusion-dev-app">
            <FusionRoot rootRef={root} overlayRef={overlay}>
              {/* <FusionHeader aside={null} content={HeaderContextSelector} start={null} settings={null} /> */}
              <FusionContent>
                <HotAppWrapper />
              </FusionContent>
            </FusionRoot>
          </ThemeProvider>
        {/* </Router>
      </BrowserRouter> */}
    </FusionContext.Provider>
  );
};

export default Portal;
