import * as path from 'path';
import IPackage from '../Package';

export default (modulePackage: IPackage, isProduction: boolean) => {
  const cliNodeModulesPath = path.resolve(__dirname, '../../../node_modules');
  const rootNodeModulesPath = path.resolve(cliNodeModulesPath, '../../..');
  const modulePackageMain = path.resolve(process.cwd(), modulePackage.main);
  return {
    entry: isProduction
      ? path.resolve(process.cwd(), modulePackage.main)
      : [path.resolve(process.cwd(), modulePackage.main), 'webpack-hot-middleware/client'],
    resolve: {
      extensions: ['.ts', '.js', '.tsx', '.jsx'],
      modules: [path.dirname(modulePackageMain), 'node_modules', rootNodeModulesPath],
    },
    resolveLoader: {
      modules: ['node_modules', cliNodeModulesPath, rootNodeModulesPath],
    },
  };
};
