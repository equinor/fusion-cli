import webpack from 'webpack';
import resolveCliDependency from '../resolveCliDependency';

const fileLoader = resolveCliDependency('file-loader');

export default (publicPath?: string): webpack.Configuration => ({
    module: {
        rules: [
            {
                test: /.(svg|png|jpg|jpeg?)(\?[a-z0-9]+)?$/,
                use: [
                    {
                        loader: fileLoader,
                        options: {
                            name: '[path][name].[ext]',
                            publicPath,
                        },
                    },
                ],
            },
        ],
    },
});
