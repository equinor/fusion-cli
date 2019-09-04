import webpack from 'webpack';
import resolveCliDependency from '../resolveCliDependency';

const fileLoader = resolveCliDependency('file-loader');

export default (): webpack.Configuration => ({
    module: {
        rules: [
            {
                test: /.(png|jpg|jpeg?)(\?[a-z0-9]+)?$/,
                use: [
                    {
                        loader: fileLoader,
                    },
                ],
            },
        ],
    },
});