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
                        options: {
                            silent: true,
                        },
                    },
                ],
            },
            {
                test: /\.tsx$/,
                use: [
                    {
                        loader: typescriptLoader,
                        options: {
                            silent: true,
                        },
                    },
                ],
            },
        ],
    },
};
