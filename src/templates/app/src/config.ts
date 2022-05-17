import { AppConfigurator } from '@equinor/fusion-framework-react-app';

export const configCallback: AppConfigurator = async (appModuleConfig, frameworkApi) => {
  console.debug(0, 'configuring app', frameworkApi, appModuleConfig);
  /**
   * configure to use the `portal` client from the ServiceDiscovery module.
   * this will allow using portal services from the `useHttpClient` with the `portal` key
   */
  await frameworkApi.modules.serviceDiscovery.configureClient('portal', appModuleConfig);
  await frameworkApi.modules.serviceDiscovery.configureClient('org', appModuleConfig);
};

export default configCallback;
