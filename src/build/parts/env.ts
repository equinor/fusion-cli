import { Configuration, EnvironmentPlugin } from 'webpack';

export default (args: any = {}): Configuration => ({
  plugins: [
    new EnvironmentPlugin({
      ...args,
      LEGACY: false,
      FUSION_LOG_LEVEL: 1,
    }),
  ],
});
