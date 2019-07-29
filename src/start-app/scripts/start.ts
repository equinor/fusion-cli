import * as express from 'express';
import * as path from 'path';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import * as hotMiddleware from 'webpack-hot-middleware';
import * as merge from 'webpack-merge';
import * as open from 'open';

import babel from '../parts/babel';
import entry from '../parts/entry';
import hmr from '../parts/hmr';
import mode from '../parts/mode';
import output from '../parts/output';
import externals from '../parts/externals';
import styles from '../parts/styles';
import typescript from '../parts/typescript';

const openBrowser = async (port: number) => {
    await open(`http://localhost:${port}`);
};

export default async () => {
    const compiler = webpack(merge(babel, mode, entry, output, hmr, externals, styles, typescript));

    const app = express();
    const port = 3007;

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
    // tslint:disable-next-line:variable-name
    app.get('/', (_req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
    });

    app.listen(port, () => console.log(`Fusion App listening on port ${port}!`));

    await openBrowser(port);
};
