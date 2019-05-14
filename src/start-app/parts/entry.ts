import * as path from 'path';

export default {
  entry: [
    './index.js',
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'node_modules',
      'webpack-hot-middleware',
      'client'
    ),
  ],
};
