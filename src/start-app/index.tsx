import { render } from '@hot-loader/react-dom';
import { useRef, FunctionComponent } from 'react';
import { Router } from 'react-router-dom';
import { createFusionContext, AuthContainer, FusionContext, ServiceResolver } from '@equinor/fusion';
import {
  FusionHeader,
  ContextSelector,
  FusionContent,
  FusionRoot,
  HeaderContentProps,
} from '@equinor/fusion-components';
import HotAppWrapper from './HotAppWrapper';

import { ThemeProvider } from '@equinor/fusion-react-styles';

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

const HeaderContextSelector: FunctionComponent<HeaderContentProps> = ({ app }) => {
  return app?.context?.types.length ? <ContextSelector /> : null;
};

const Root = ({ authContainer }: { authContainer: AuthContainer }) => {
  console.log(1, 'rerendering root');
  const rootEl = document.createElement('div');
  const overlayEl = document.createElement('div');

  rootEl.appendChild(overlayEl);

  const root = useRef(rootEl);
  const overlay = useRef(overlayEl);

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
      <Router history={history}>
        <ThemeProvider seed="fusion-dev-app">
          <FusionRoot rootRef={root} overlayRef={overlay}>
            <FusionHeader aside={null} content={HeaderContextSelector} start={null} settings={null} />
            <FusionContent>
              <HotAppWrapper />
            </FusionContent>
          </FusionRoot>
        </ThemeProvider>
      </Router>
    </FusionContext.Provider>
  );
};

const start = async () => {
  const authContainer = new AuthContainer();
  await authContainer.handleWindowCallbackAsync();

  const coreAppClientId = '5a842df8-3238-415d-b168-9f16a6a6031b';
  const coreAppRegistered = await authContainer.registerAppAsync(coreAppClientId, [
    serviceResolver.getContextBaseUrl(),
    serviceResolver.getDataProxyBaseUrl(),
    serviceResolver.getFusionBaseUrl(),
    serviceResolver.getMeetingsBaseUrl(),
    serviceResolver.getOrgBaseUrl(),
    serviceResolver.getPowerBiBaseUrl(),
    serviceResolver.getProjectsBaseUrl(),
    serviceResolver.getTasksBaseUrl(),
    serviceResolver.getPeopleBaseUrl(),
    serviceResolver.getReportsBaseUrl(),
    serviceResolver.getPowerBiApiBaseUrl(),
    serviceResolver.getNotificationBaseUrl(),
    serviceResolver.getBookmarksBaseUrl(),
  ]);

  if (!coreAppRegistered) {
    await authContainer.loginAsync(coreAppClientId);
  } else {
    console.log(0, 'rendering app');
    render(<Root authContainer={authContainer} />, document.getElementById('fusion-app'));
  }
};

start()
  .then(() => console.log('App started'))
  .catch((e) => console.error('Unable to start app', e));
