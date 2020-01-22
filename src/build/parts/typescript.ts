import webpack from 'webpack';
import resolveCliDependency from '../resolveCliDependency';

const typescriptLoader = resolveCliDependency('ts-loader');

export default (outDir?: string, silent = false): webpack.Configuration => ({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: typescriptLoader,
                        options: {
                            compilerOptions: {
                                outDir,
                            },
                            silent,
                        },
                    },
                ],
            },
        ],
    },
});
