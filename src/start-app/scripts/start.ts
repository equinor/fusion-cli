import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import * as path from 'path';
import * as webpack from 'webpack';
import * as devMiddleware from 'webpack-dev-middleware';
import * as hotMiddleware from 'webpack-hot-middleware';
import * as merge from 'webpack-merge';

import babel from '../parts/babel';
import entry from '../parts/entry';
import hmr from '../parts/hmr';
import mode from '../parts/mode';
import output from '../parts/output';
import externals from '../parts/externals';

export default () => {
    const compiler = webpack(merge(babel, mode, entry, output, hmr, externals));

    const app = express();
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

    https
        .createServer(
            {
                cert: fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'server.cert')),
                key: fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'server.key')),
            },
            app
        )
        .listen(3000, () => {
            // tslint:disable-next-line:no-console
            console.log('Fusion App listening on port 3000!');
        });
};
