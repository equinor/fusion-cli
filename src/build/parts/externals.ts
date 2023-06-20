import webpack from 'webpack';
import IDependencyList from '../DependencyList';

/**
 * Strip non-numeric characters from version string (e.g '^1.0.7' > '1.0.7')
 * @param version version string
 */
const parseVersion = (version?: string | null) =>
  version
    ? version
        .split('.')
        .map((part) => part.replace(/[^0-9]+/, ''))
        .join('.')
    : '';

export default (cliDependencies: IDependencyList, moduleDependencies: IDependencyList): webpack.Configuration => {
  const externals: Record<string, string> = {};
  const isProduction = !process.env.DEVELOPMENT;

  const addIfVersionsMatch = (key: string, value: string, match?: (version?: string) => boolean) => {
    const moduleVersion = parseVersion(moduleDependencies[key]);
    const cliVersion = parseVersion(cliDependencies[key]);

    if (!moduleVersion || cliVersion === moduleVersion) {
      console.info(`Using ${key}@${cliVersion} from cli`);
      externals[key] = value;
    } else if (moduleVersion) {
      console.warn(
        `Using ${key}@${moduleVersion} instead of the built in version (v${cliVersion})! This will add to the bundle size!`
      );
    }
  };

  // enforce externals on React libraries
  externals['react'] = 'FusionReact';
  externals['react-dom'] = 'FusionReactDOM';

  if (isProduction) {
    externals['@equinor/fusion-react-styles'] = 'FusionReactStyles';
    if (parseVersion(moduleDependencies['react-router']).startsWith('5')) {
      console.info('using legacy routing system (ReactRouter@5)');
      externals['react-router'] = 'FusionReactRouter';
      externals['react-router-dom'] = 'FusionReactRouterDOM';
    }
  }

  // if (isProduction && parseVersion(moduleDependencies['react-router']).startsWith('5')) {
  //   console.info('using legacy routing system (ReactRouter@5)');
  //   externals['react-router'] = 'FusionReactRouter';
  //   externals['react-router-dom'] = 'FusionReactRouterDOM';
  // }
  //addIfVersionsMatch('react-router-dom', 'FusionReactRouterDOM');
  //  addIfVersionsMatch('@equinor/fusion-components', 'FusionComponents');

  addIfVersionsMatch('@equinor/fusion', 'FusionAPI');
  addIfVersionsMatch('@equinor/fusion-components', 'FusionComponents');

  return {
    externals,
  };
};
