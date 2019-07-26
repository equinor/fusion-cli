import * as path from 'path';

const typescriptLoader = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'node_modules',
    'awesome-typescript-loader'
);

export default {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: typescriptLoader,
                    },
                ],
            },
        ],
    },
};
