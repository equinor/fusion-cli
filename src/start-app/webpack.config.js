/* global module require __dirname */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // mode: 'development',
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
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: 'FusionReactRouterDOM',
            override: true,
          },
        },
      },
      {
        test: require.resolve('react'),
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: 'FusionReact',
            override: true,
          },
        },
      },

      {
        test: require.resolve('react-dom'),
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: 'FusionReactDOM',
            override: true,
          },
        },
      },
      {
        test: require.resolve('@hot-loader/react-dom'),
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: 'FusionReactDOM',
            override: true,
          },
        },
      },
      {
        test: require.resolve('@equinor/fusion'),
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: 'FusionAPI',
            override: true,
          },
        },
      },
      {
        test: require.resolve('@equinor/fusion-components'),
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: 'FusionComponents',
            override: true,
          },
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        '**/*',
        '!favicon-*.png',
        '!favicon.ico',
        '!index.html',
        '!unknown-profile-128.png',
      ],
    }),
  ],
};
