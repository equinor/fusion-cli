import * as express from 'express';
import * as compression from 'compression';
import * as path from 'path';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import * as hotMiddleware from 'webpack-hot-middleware';

import * as open from 'open';
import * as getPort from 'get-port';

import babel from '../../build/parts/babel';
import entry from '../../build/parts/entry';
import hmr from '../../build/parts/hmr';
import images from '../../build/parts/images';
import mode from '../../build/parts/mode';
import output from '../../build/parts/output';
import externals from '../../build/parts/externals';
import styles from '../../build/parts/styles';
import typescript from '../../build/parts/typescript';
import env from '../../build/parts/env';
import getPackageAsync from '../../build/getPackageAsync';
import getPackageDependencies from '../../build/getPackageDependencies';
import { merge } from 'webpack-merge';

type StartOptions = {
  port?: number;
};

const openBrowser = async (port: number) => {
  await open(`http://localhost:${port}`);
};

export default async (args?: StartOptions) => {
  const appPackage = await getPackageAsync(path.resolve(process.cwd()));
  const cliPackage = await getPackageAsync(path.resolve(__dirname, '..', '..', '..'));
  const cliDependencies = await getPackageDependencies(cliPackage);
  const moduleDependencies = await getPackageDependencies(appPackage);

  const appWebpackConfig = require(path.resolve(process.cwd(), 'webpack.config.js'));
  const config = merge(
    babel,
    mode(false),
    entry(appPackage, false),
    output('app.bundle.js'),
    hmr,
    images(),
    externals(cliDependencies, moduleDependencies),
    styles,
    typescript('', false),
    env(),
    appWebpackConfig
  );

  const compiler = webpack(config);

  const app = express();
  const port = await getPort({ port: (args && args.port) || getPort.makeRange(3000, 3100) });

  app.use(compression());

  app.use(
    devMiddleware(compiler, {
      publicPath: '/',
    })
  );

  app.use(hotMiddleware(compiler));

  const wwwRoot = path.resolve(__dirname, '..', 'dist');

  app.get('/images/profiles/*', (_req, res) => {
    res.sendFile(path.join(wwwRoot, 'unknown-profile-128.png'), { maxAge: 1000 * 60 * 60 * 24 });
  });

  // tslint:disable-next-line:variable-name
  app.get('/fusion.bundle.js(.map)?', (_req, res) => {
    res.sendFile(path.join(wwwRoot, _req.path));
  });

  app.get('/env.json', (_req, res) => {
    // res.json({test:'ok'});
    res.sendFile(path.resolve(process.cwd(), 'env.json'));
  });

  app.get('/env/portal-client-id', (_req, res) => {
    process.env['FUSION_PORTAL_CLIENT_ID'];
    res.json({ client_id: process.env['FUSION_PORTAL_CLIENT_ID'] });
    // res.sendFile(path.resolve(process.cwd(), 'env.json'));
  });

  // tslint:disable-next-line:variable-name
  app.get(/\/favicon(-\d\dx\d\d)?.(png|ico)$/g, (_req, res) => {
    res.sendFile(path.join(wwwRoot, _req.path));
  });

  // tslint:disable-next-line:variable-name
  app.get(['/', '/*', '*'], (_req, res) => {
    res.sendFile(path.join(wwwRoot, 'index.html'));
  });

  app.listen(port, () => console.log(`Fusion App listening on port ${port}!`));

  await openBrowser(port);
};
