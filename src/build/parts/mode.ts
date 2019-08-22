import * as webpack from 'webpack';

const mode = (isProduction = false): webpack.Configuration => ({
  mode: isProduction? 'production' : 'development',
});

export default mode;
