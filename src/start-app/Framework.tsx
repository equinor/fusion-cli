import { enableAppModule } from '@equinor/fusion-framework-module-app';
import { enableNavigation } from '@equinor/fusion-framework-module-navigation';

import { createFrameworkProvider } from '@equinor/fusion-framework-react';

type ServiceConfig = {
  client_id: string;
};

export const Framework = createFrameworkProvider(async (config) => {
  const timestamp = Date.now();

  enableAppModule(config);

  const serviceConfig: ServiceConfig | undefined = await fetch('/env/portal-client-id').then((x) => x.json());

  config.configureMsal(
    {
      tenantId: '3aa4a235-b6e2-48d5-9195-7fcf05b459b0',
      clientId: serviceConfig?.client_id ?? '9b707e3a-3e90-41ed-a47e-652a1e3b53d0',
      redirectUri: '/authentication/login-callback',
    },
    { requiresAuth: true }
  );

  config.configureServiceDiscovery({
    client: {
      baseUri: 'https://fusion.ci.fusion-dev.net',
      defaultScopes: ['97978493-9777-4d48-b38a-67b0b9cd88d2/.default'],
    },
  });

  enableNavigation(config);
});

export default Framework;
