import * as path from 'path';

export default {
    entry: [path.resolve(process.cwd(), 'src', 'index.tsx'), 'webpack-hot-middleware/client'],

    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
        modules: [
            path.resolve(process.cwd(), 'node_modules'),
            path.resolve(process.cwd(), 'src'),
            path.resolve(__dirname, '..', '..', '..', 'node_modules'),
        ],
    },
};
