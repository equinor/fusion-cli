import resolveCliDependency from '../resolveCliDependency';

const styleLoader = resolveCliDependency('style-loader');
const cssLoader = resolveCliDependency('css-loader');
const lessLoader = resolveCliDependency('less-loader');

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
                    },
                ],
            },
        ],
    },
};
