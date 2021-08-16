import {Configuration, EnvironmentPlugin} from 'webpack';

export default (args: any = {}): Configuration => ({
  plugins: [
    new EnvironmentPlugin({
      ...args,
      LEGACY: false
    })
  ]
});