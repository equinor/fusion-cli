import {Command, flags} from '@oclif/command'
import * as inquirer from "inquirer";

interface StartAppOptions {
  apps?: string[];
  progress?: boolean;
  production?: boolean;
}

export default class StartApp extends Command {
  static description = 'Start a fusion app'

  static flags = {
    help: flags.help({char: 'h'}),
    apps: flags.string({char:'a', description: 'Compile one or more fusion apps. E.g. --apps AppKey1 AppKey2 AppKey3', multiple:true}),
    progress: flags.boolean({char: 'p', description: 'Display build progress'}),
    production: flags.boolean({char: 'P', description: 'Use production config'})
  }

  async run() {
    const {flags} = this.parse(StartApp)
    const options = await promptForMissingOptions(flags);
    console.log("Starting apps...");
  }
}

const promptForMissingOptions = async (options: StartAppOptions): Promise<object> => {
  const questions = [];
  if(!options.apps){
    questions.push({
        type: 'input',
        name: 'apps',
        message: 'Please enter a apps to start. E.g. AppKey1 AppKey2 AppKey3',
    });
  }
  const answers : any = await inquirer.prompt(questions);

  return {
    ...options,
    apps: options.apps || answers.apps.split(" ")
  }

}