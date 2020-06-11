import { Command, flags } from '@oclif/command';
// import * as inquirer from 'inquirer';

import start from '../start-app/scripts/start';

// interface IStartAppOptions {
//     apps?: string[];
//     progress?: boolean;
//     production?: boolean;
// }

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

    public async run() {
        // tslint:disable-next-line:no-console
        console.log('Starting apps...');
        const { port } = this.parse(StartApp).flags;
        start({ port });
    }
}

// const promptForMissingOptions = async (options: IStartAppOptions): Promise<object> => {
//     const questions = [];
//     if (!options.apps) {
//         questions.push({
//             message: 'Please enter a apps to start. E.g. AppKey1 AppKey2 AppKey3',
//             name: 'apps',
//             type: 'input',
//         });
//     }
//     const answers: any = await inquirer.prompt(questions);

//     return {
//         ...options,
//         apps: options.apps || answers.apps.split(' '),
//     };
// };
