import { AppConfigurator } from '@equinor/fusion-framework-react-app';

export const configCallback: AppConfigurator = async (appModuleConfig, frameworkApi) => {
  console.debug(0, 'configuring app', frameworkApi, appModuleConfig);
  await frameworkApi.modules.serviceDiscovery.configureClient('portal', appModuleConfig);
  // await new Promise((resolve) => setTimeout(resolve, 100));
};

export default configCallback;
