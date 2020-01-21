import webpack from 'webpack';
import resolveCliDependency from '../resolveCliDependency';
import babelLoader from './babel-loader';

const typescriptLoader = resolveCliDependency('ts-loader');

export default (outDir?: string, silent = false): webpack.Configuration => ({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    babelLoader,
                    {
                        loader: typescriptLoader,
                        options: {
                            babelCore: '@babel/core',
                            compilerOptions: {
                                outDir,
                            },
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
