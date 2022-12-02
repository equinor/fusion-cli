import { Command, flags } from '@oclif/command';

import start from '../start-app/scripts/start';

export default class StartApp extends Command {
  public static description = 'Start a fusion app';

  public static flags = {
    apps: flags.string({
      char: 'a',
      description: 'Compile one or more fusion apps. E.g. --apps AppKey1 AppKey2 AppKey3',
      multiple: true,
    }),
    help: flags.help({ char: 'h' }),
    production: flags.boolean({ char: 'P', description: 'Use production config' }),
    port: flags.integer({ char: 'p', description: 'Devserver port' }),
  };

  public async run(): Promise<void> {
    console.log('Starting apps...');
    process.env.DEVELOPMENT = 'true';
    const { port } = this.parse(StartApp).flags;
    start({ port });
  }
}
