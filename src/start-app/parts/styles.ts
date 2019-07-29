import * as path from 'path';

const styleLoader = path.resolve(__dirname, '..', '..', '..', 'node_modules', 'style-loader');
const cssLoader = path.resolve(__dirname, '..', '..', '..', 'node_modules', 'css-loader');
const lessLoader = path.resolve(__dirname, '..', '..', '..', 'node_modules', 'less-loader');

export default {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    styleLoader,
                    {
                        loader: cssLoader,
                        options: {
                            modules: true,
                        },
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    styleLoader,
                    {
                        loader: cssLoader,
                        options: {
                            modules: true,
                        },
                    },
                    {
                        loader: lessLoader,
                        options: {
                            noIeCompat: true,
                        },
                    },
                ],
            },
        ],
    },
};
