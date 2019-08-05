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
                test: /\.ts$/,
                use: [
                    {
                        loader: typescriptLoader,
                    },
                ],
            },
            {
                test: /\.tsx$/,
                use: [
                    {
                        loader: typescriptLoader,
                    },
                ],
            },
        ],
    },
};
