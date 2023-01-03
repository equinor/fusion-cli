import type { AppModuleInitiator } from '@equinor/fusion-framework-app';
import { enableContext } from '@equinor/fusion-framework-react-module-context';

export const configureFramework: AppModuleInitiator = (configurator, env) => {
  console.log('CONFIGUTATOR', configurator);

  enableContext(configurator, async (builder) => {
    builder.setContextType(['orgchart']); // set contextType to match against
  });

  configurator.useFrameworkServiceClient('portal');
  configurator.useFrameworkServiceClient('org');

  /** print render environment arguments */
  console.log('configuring application', env);

  /** callback when configurations is created */
  configurator.onConfigured((config) => {
    console.log('application config created', config);
  });

  /** callback when the application modules has initialized */
  configurator.onInitialized((instance) => {
    console.log('application config initialized', instance);
  });
};
