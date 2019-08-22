import * as webpack from 'webpack';

export default {
    plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()],
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom',
        },
    },
};
