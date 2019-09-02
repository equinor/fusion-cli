import * as express from 'express';
import * as compression from 'compression';
import * as path from 'path';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import * as hotMiddleware from 'webpack-hot-middleware';
import * as merge from 'webpack-merge';
import * as open from 'open';
import * as getPort from 'get-port';

import babel from '../../build/parts/babel';
import entry from '../../build/parts/entry';
import hmr from '../../build/parts/hmr';
import mode from '../../build/parts/mode';
import output from '../../build/parts/output';
import externals from '../../build/parts/externals';
import styles from '../../build/parts/styles';
import typescript from '../../build/parts/typescript';
import getPackageAsync from '../../build/getPackageAsync';
import getPackageDependencies from '../../build/getPackageDependencies';

const openBrowser = async (port: number) => {
    await open(`http://localhost:${port}`);
};

export default async () => {
    const appPackage = await getPackageAsync(path.resolve(process.cwd()));
    const cliPackage = await getPackageAsync(path.resolve(__dirname, '..', '..', '..'));
    const cliDependencies = await getPackageDependencies(cliPackage);
    const moduleDependencies = await getPackageDependencies(appPackage);

    const compiler = webpack(
        merge(
            babel,
            mode(false),
            entry(appPackage),
            output('app.bundle.js'),
            hmr,
            externals(cliDependencies, moduleDependencies),
            styles,
            typescript('', false)
        )
    );

    const app = express();
    const port = await getPort({ port: getPort.makeRange(3000, 3100) });

    app.use(compression());

    app.use(
        devMiddleware(compiler, {
            publicPath: '/',
        })
    );

    app.use(hotMiddleware(compiler));

    // tslint:disable-next-line:variable-name
    app.get('/fusion.bundle.js', (_req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'dist', 'fusion.bundle.js'));
    });

    app.get('/favicon-16x16.png', (_req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'dist', 'favicon-16x16.png'));
    });

    app.get('/favicon-32x32.png', (_req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'dist', 'favicon-32x32.png'));
    });

    // tslint:disable-next-line:variable-name
    app.get(['/', '/*', '*'], (_req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
    });

    app.listen(port, () => console.log(`Fusion App listening on port ${port}!`));

    await openBrowser(port);
};
