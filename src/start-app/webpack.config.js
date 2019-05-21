const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

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
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'awesome-typescript-loader',
                },
            },
            {
                enforce: 'pre',
                test: '/.js$/',
                loader: 'source-map-loader',
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
                        options: 'FusionSDK',
                    },
                ],
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!index.html'],
        }),
    ],
};
