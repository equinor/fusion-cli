import { createFrameworkProvider } from '@equinor/fusion-framework-react';

type ServiceConfig = {
  client_id: string;
};

export const Framework = createFrameworkProvider(async (config) => {
  const timestamp = Date.now();

  console.debug('configuring framework');
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const serviceConfig: ServiceConfig | undefined = await fetch('/env/portal-client-id').then((x) => x.json());
  config.auth.configureDefault({
    tenantId: '3aa4a235-b6e2-48d5-9195-7fcf05b459b0',
    clientId: serviceConfig?.client_id ?? '9b707e3a-3e90-41ed-a47e-652a1e3b53d0',
    redirectUri: '/authentication/login-callback',
  });
  // add a setup method for this!
  config.http.configureClient('service_discovery', {
    baseUri: 'https://pro-s-portal-ci.azurewebsites.net',
    defaultScopes: ['97978493-9777-4d48-b38a-67b0b9cd88d2/.default'],
  });
  config.onAfterConfiguration(() => {
    console.debug('framework config done');
  });
  // TODO - this is ninja, make a auth provider
  config.onAfterInit(async (fusion) => {
    await fusion.auth.handleRedirect();
    if (!fusion.auth.defaultAccount) {
      await fusion.auth.login();
    }
  });

  await new Promise((resolve) => setTimeout(resolve, timestamp - Date.now() + 3000));
});

export default Framework;
