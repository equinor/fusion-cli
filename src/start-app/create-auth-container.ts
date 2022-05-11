import { ServiceResolver } from '@equinor/fusion';
import AppAuthContainer from './AppAuthContainer';

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

export const createAuthContainer = (): AppAuthContainer => {
  const authClient = window.Fusion.modules.auth;
  if (!authClient) {
    throw Error('no auth container found!');
  }

  const authContainer = new AppAuthContainer(authClient);

  const coreAppClientId = '5a842df8-3238-415d-b168-9f16a6a6031b';
  authContainer.registerAppAsync(
    coreAppClientId,
    [
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
    ],
    false
  );

  return authContainer;
};

export default createAuthContainer;
