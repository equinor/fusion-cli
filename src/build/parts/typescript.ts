import webpack from 'webpack';
import resolveCliDependency from '../resolveCliDependency';

const typescriptLoader = resolveCliDependency('awesome-typescript-loader');

export default (outDir?: string, silent = false): webpack.Configuration => ({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: typescriptLoader,
                        options: {
                            babelCore: '@babel/core',
                            outDir,
                            silent,
                            useBabel: true,
                            useCache: false,
                        },
                    },
                ],
            },
        ],
    },
});
