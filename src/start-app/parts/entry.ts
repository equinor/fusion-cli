import * as path from 'path';

const webpackHotMiddlewareClient = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'node_modules',
    'webpack-hot-middleware/client'
);

export default {
    entry: [path.resolve(process.cwd(), 'index.js'), webpackHotMiddlewareClient],
};
