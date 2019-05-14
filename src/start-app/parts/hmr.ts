import * as path from 'path';
import * as webpack from 'webpack';

export default {
  resolve: {
    alias: {
      'react-dom': path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'node_modules',
        '@hot-loader',
        'react-dom'
      ),
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()],
};
