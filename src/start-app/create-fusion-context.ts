/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  createApiClients,
  ResourceCache,
  EventHub,
  HttpClient,
  AbortControllerManager,
  createResourceCollections,
  ServiceResolver,
  TelemetryLogger,
  FeatureLogger,
  SettingsContainer,
  ComponentDisplayType,
  AppContainer,
  TasksContainer,
  NotificationCenter,
  PeopleContainer,
  UserMenuContainer,
  FusionContextRefs,
  IFusionContext,
  // appContainerFactory,
} from '@equinor/fusion';

import { Fusion } from '@equinor/fusion-framework-react';
import { AppModule } from '@equinor/fusion-framework-module-app';
import { NavigationModule } from '@equinor/fusion-framework-module-navigation';

import createAuthContainer from './create-auth-container';
import { CliAppContainer } from './CliAppContainer';
import CliContextManager from './CliContextManager';
// TODO remove deps of history
import { Action, Location } from 'history';
import { appContainerFactory } from '@equinor/fusion/lib/app/AppContainer';

const globalEquinorFusionContextKey = '74b1613f-f22a-451b-a5c3-1c9391e91e68';

export const serviceResolver: ServiceResolver = {
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

export const createFusionContext = (args: {
  framework: Fusion<[AppModule, NavigationModule]>;
  refs: FusionContextRefs;
}): IFusionContext => {
  const { framework, refs } = args;

  const environment = {
    env: 'dev',
  };

  const authContainer = createAuthContainer();

  const telemetryLogger = new TelemetryLogger('', authContainer);

  const abortControllerManager = new AbortControllerManager(new EventHub());

  const resourceCollections = createResourceCollections(serviceResolver, {
    loadBundlesFromDisk: true,
    environment,
  });

  const resourceCache = new ResourceCache(new EventHub());

  const httpClient = new HttpClient(
    authContainer,
    resourceCache,
    abortControllerManager,
    telemetryLogger,
    new EventHub()
  );

  const apiClients = createApiClients(httpClient, resourceCollections, serviceResolver);

  const featureLogger = new FeatureLogger(apiClients, new EventHub());

  const history = framework.modules.navigation.navigator;

  const historyListenFn = history.listen.bind(history);

  /**
   * TODO - write what this wrapper does!?
   */
  // @ts-ignore
  history.listen = (cb: (eventOrLocation, action?: Action) => void) => {
    return historyListenFn((e: { action: Action; location: Location }) => {
      const event = new Proxy(e, {
        get(target, p) {
          switch (p) {
            case 'action':
              return target.action;

            case 'location':
              return target.location;

            case 'state':
            case 'hash':
            case 'key':
            case 'search':
            case 'pathname':
              // @ts-ignore
              return target.location[p];
          }
        },
      });
      cb(event, e.action);
    });
  };

  const coreSettings = new SettingsContainer('core', authContainer.getCachedUser(), new EventHub(), {
    componentDisplayType: ComponentDisplayType.Comfortable,
  });

  const appContainer = new CliAppContainer({
    framework,
    eventHub: new EventHub(),
    featureLogger,
    telemetryLogger,
  }) as unknown as AppContainer;

  appContainerFactory(appContainer);

  // @ts-ignore
  const contextManager = new CliContextManager({ featureLogger, framework, history });

  const tasksContainer = new TasksContainer(apiClients, new EventHub());
  const notificationCenter = new NotificationCenter(new EventHub(), apiClients);
  const peopleContainer = new PeopleContainer(apiClients, resourceCollections, new EventHub());
  const userMenuSectionsContainer = new UserMenuContainer(new EventHub());

  const fusionContext = {
    auth: { container: authContainer },
    http: {
      client: httpClient,
      resourceCollections,
      apiClients,
      resourceCache,
      serviceResolver,
    },
    refs,
    history,
    settings: {
      core: coreSettings,
      apps: {},
    },
    app: {
      container: appContainer,
    },
    contextManager,
    tasksContainer,
    abortControllerManager,
    notificationCenter,
    peopleContainer,
    userMenuSectionsContainer,
    environment,
    logging: {
      telemetry: telemetryLogger,
      feature: featureLogger,
    },
    options: { environment },
  };
  // @ts-ignore
  window[globalEquinorFusionContextKey] = fusionContext;

  return fusionContext as unknown as IFusionContext;
};
