/// <reference path="../index.d.ts" />
import {Command, flags} from '@oclif/command'
import * as figlet from 'figlet';
import * as inquirer from 'inquirer';
import * as fs from "fs";
import * as chalk from "chalk";
import * as path from "path";
import { promisify } from "util";
import * as ncp from "ncp";
import * as Listr from "listr"
import * as execa from "execa";
import { projectInstall } from "pkg-install";

const access = promisify(fs.access);
const copy = promisify(ncp);

interface CreateAppOptions {
  name?: string;
  key?: string;
  description?: string;
  shortName?: string;
  git?: boolean;
  install?: boolean;
  targetDirectory?: string;
  templateDirectory?: string;
}

export default class CreateApp extends Command {
  static description = 'Creates a new fusion app'

  static flags = {
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'Name for app/tile(use quotes for spaces)'}),
    key: flags.string({char: 'k', description: 'Key for app/tile'}),
    description: flags.string({char: 'd', description: 'App description'}),
    shortName: flags.string({char: 'N', description: 'App short name'}),
    git: flags.boolean({char: 'g', description: 'Initialize git repository'}),
    install: flags.boolean({char: 'i', description: 'Install dev dependencies'}),
  }

  async run() {
    const {flags} = this.parse(CreateApp)

    console.log(figlet.textSync('Fusion', {
      font: '3D-ASCII',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }));

    const options = await promptForMissingOptions(flags);
    await createProject(options);

  }
}

const slugify = (text: string):string => text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');

const promptForMissingOptions = async (options: CreateAppOptions):Promise<object> => {
  const questions = [];
  const nameQuestion = [];

  if(!options.name || typeof options.name !== "string"){
      nameQuestion.push({
          type: 'input',
          name: 'name',
          message: 'Please enter a app name',
      });
  }
  const selectedName : any = nameQuestion.length !== 0 ?  await inquirer.prompt(nameQuestion) : options;
  if(!options.key){
      questions.push({
          type: 'input',
          name: 'key',
          message: 'Please enter a app key',
          default: selectedName && slugify(selectedName.name)
      });
  }
  if(!options.shortName){
      questions.push({
          type: 'input',
          name: 'shortName',
          message: 'Please enter a app shortname',
          default: selectedName.name
      });
  }
  if(!options.description){
      questions.push({
          type: 'input',
          name: 'description',
          message: 'Please enter a app description',
          default: ""
      });
  }
  if(!options.key){
      questions.push({
          type: 'confirm',
          name: 'git',
          message: 'Initialize git?',
          default: false
      });
  }
  if(!options.install){
      questions.push({
          type:'confirm',
          name:'install',
          message:'Install dependencies?',
          default: true,
      })
  }
  const answers : any = await inquirer.prompt(questions);

  return {
      ...options,
      name: selectedName.name,
      key: options.key || answers.key,
      install: options.install || answers.install,
      git: options.git || answers.git,
      shortName: options.shortName || answers.shortName,
      description: options.description || answers.description
  };

}

const initGit = async (options: CreateAppOptions) => {
  const initGit = await execa("git", ["init"], {
    cwd: options.targetDirectory
  });
  if (initGit.failed) {
    return Promise.reject(new Error("Failed to initialize git"));
  }
  const gitIgnorePath = path.join(options.targetDirectory || "", "/.gitignore");
  await fs.writeFile(gitIgnorePath, 'node_modules\r\n.fusion', (err: any) => {
    if(err){
      return Promise.reject(new Error("Failed to create .gitignore file"));
    }
  });
  return;
}

const createAndSetTargetDir = (key: string) => {
  const newDir = "./" + key;
  if( !fs.existsSync(newDir)){
      fs.mkdirSync(newDir);
      return process.cwd() + '/' + key;
  }
  console.error("%s Target directory already exists, select a different app key", chalk.red.bold("ERROR"));
  process.exit(1);
}

const updatePackageConfig = async (options: CreateAppOptions) => {
  const configPath = path.join(
      options.targetDirectory || "",
      "/package.json",
    );
  try {
      await access(configPath, fs.constants.R_OK);
    } catch (err) {
      console.error("%s Cant access new app config", chalk.red.bold("ERROR"));
      process.exit(1);
    }
  let config = JSON.parse(fs.readFileSync(configPath).toString());
  config.name = options.key;
  config.manifest.name = options.name;
  config.description = options.description;
  config.manifest.shortName = options.shortName;

  fs.writeFileSync(configPath, JSON.stringify(config));
}

const copyTemplateFiles = async (options: CreateAppOptions): Promise<boolean> => {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false
  });
}

const createProject = async (options: CreateAppOptions) => {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || createAndSetTargetDir(options.key || "")
  };

  const templateDir = path.resolve(
    __filename,
    "../../templates/app",
  );

  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", chalk.red.bold("ERROR"));
    process.exit(1);
  }
  const tasks = new Listr([
    {
      title: "Copy project files",
      task: () =>  copyTemplateFiles(options)
    },
    {
      title: "Initialize git",
      task: () =>  initGit(options),
      enabled: () => options.git ? true: false
    },
    {
        title:"Update package config",
        task: () => updatePackageConfig(options)
    },
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory
        }),
      skip: () =>
        !options.install
          ? "Pass --install to automatically install dependencies"
          : undefined
    }
  ]);
  await tasks.run();
  console.log("%s App ready", chalk.green.bold("DONE"));
  return true;
}