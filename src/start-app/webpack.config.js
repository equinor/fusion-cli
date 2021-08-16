const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: ['react-hot-loader/patch', './src/start-app/index.tsx'],
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    output: {
        path: __dirname + '/dist',
        publicPath: 'dist',
        filename: 'fusion.bundle.js',
    },
    optimization: {
        usedExports: true,
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                },
            },
            {
                enforce: 'pre',
                test: '/.js$/',
                loader: 'source-map-loader',
            },
            {
                test: require.resolve('react-router-dom/esm/react-router-dom.js'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'FusionReactRouterDOM',
                    },
                ],
            },
            {
                test: require.resolve('react'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'FusionReact',
                    },
                ],
            },

            {
                test: require.resolve('react-dom'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'FusionReactDOM',
                    },
                ],
            },
            {
                test: require.resolve('@hot-loader/react-dom'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'FusionReactDOM',
                    },
                ],
            },
            {
                test: require.resolve('@equinor/fusion'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'FusionAPI',
                    },
                ],
            },
            {
                test: require.resolve('@equinor/fusion-components'),
                use: [
                    {
                        loader: 'expose-loader',
                        options: 'FusionComponents',
                    },
                ],
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!favicon-*.png', '!favicon.ico', '!index.html', '!unknown-profile-128.png'],
        }),
    ],
};
