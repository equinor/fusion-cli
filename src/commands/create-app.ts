import { Command, flags } from '@oclif/command';
import * as chalk from 'chalk';
import * as execa from 'execa';
import * as figlet from 'figlet';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as Listr from 'listr';
import * as ncp from 'ncp';
import * as path from 'path';
import { projectInstall } from 'pkg-install';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

interface ICreateAppOptions {
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
    public static description = 'Creates a new fusion app';

    public static flags = {
        description: flags.string({ char: 'd', description: 'App description' }),
        git: flags.boolean({ char: 'g', description: 'Initialize git repository' }),
        help: flags.help({ char: 'h' }),
        install: flags.boolean({ char: 'i', description: 'Install dev dependencies' }),
        key: flags.string({ char: 'k', description: 'Key for app/tile' }),
        name: flags.string({ char: 'n', description: 'Name for app/tile(use quotes for spaces)' }),
        shortName: flags.string({ char: 'N', description: 'App short name' }),
    };

    public async run() {
        const parsed = this.parse(CreateApp);

        console.log(
            figlet.textSync('Fusion', {
                font: '3D-ASCII',
                horizontalLayout: 'default',
                verticalLayout: 'default',
            })
        );

        const options = await promptForMissingOptions(parsed.flags);
        await createProject(options);
    }
}

const slugify = (text: string): string =>
    text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');

const promptForMissingOptions = async (options: ICreateAppOptions): Promise<object> => {
    const questions = [];
    const nameQuestion = [];

    if (!options.name || typeof options.name !== 'string') {
        nameQuestion.push({
            message: 'Please enter a app name',
            name: 'name',
            type: 'input',
        });
    }
    const selectedName: any =
        nameQuestion.length !== 0 ? await inquirer.prompt(nameQuestion) : options;
    if (!options.key) {
        questions.push({
            default: selectedName && slugify(selectedName.name),
            message: 'Please enter a app key',
            name: 'key',
            type: 'input',
        });
    }
    if (!options.shortName) {
        questions.push({
            default: selectedName.name,
            message: 'Please enter a app shortname',
            name: 'shortName',
            type: 'input',
        });
    }
    if (!options.description) {
        questions.push({
            default: '',
            message: 'Please enter a app description',
            name: 'description',
            type: 'input',
        });
    }
    if (!options.key) {
        questions.push({
            default: false,
            message: 'Initialize git?',
            name: 'git',
            type: 'confirm',
        });
    }
    if (!options.install) {
        questions.push({
            default: true,
            message: 'Install dependencies?',
            name: 'install',
            type: 'confirm',
        });
    }
    const answers: any = await inquirer.prompt(questions);

    return {
        ...options,
        description: options.description || answers.description,
        git: options.git || answers.git,
        install: options.install || answers.install,
        key: options.key || answers.key,
        name: selectedName.name,
        shortName: options.shortName || answers.shortName,
    };
};

const initGit = async (options: ICreateAppOptions) => {
    const init = await execa('git', ['init'], {
        cwd: options.targetDirectory,
    });
    if (init.failed) {
        return Promise.reject(new Error('Failed to initialize git'));
    }
    const gitIgnorePath = path.join(options.targetDirectory || '', '/.gitignore');
    await fs.writeFile(gitIgnorePath, 'node_modules\r\n.fusion', (err: any) => {
        if (err) {
            return Promise.reject(new Error('Failed to create .gitignore file'));
        }
    });
    return;
};

const createAndSetTargetDir = (key: string) => {
    const newDir = './' + key;
    if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir);
        return process.cwd() + '/' + key;
    }
    console.error(
        '%s Target directory already exists, select a different app key',
        chalk.red.bold('ERROR')
    );
    process.exit(1);
};

const updatePackageConfig = async (options: ICreateAppOptions) => {
    const configPath = path.join(options.targetDirectory || '', '/package.json');

    try {
        await access(configPath, fs.constants.R_OK);
    } catch (err) {
        if (err instanceof Error) {
            console.error('%s Cant access new app config', chalk.red.bold('ERROR'));
            process.exit(1);
        } else {
            throw err;
        }
    }

    const config = JSON.parse(fs.readFileSync(configPath).toString());
    config.name = options.key;
    config.manifest.name = options.name;
    config.description = options.description;
    config.manifest.shortName = options.shortName;
    config.scripts = {
        ...config.scripts,
        start: `fusion start-app`,
    };

    fs.writeFileSync(configPath, JSON.stringify(config));
};

const copyTemplateFiles = async (options: ICreateAppOptions): Promise<boolean> => {
    const success = await copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });

    const indexJsPath = path.join(options.targetDirectory || '', 'src', 'index.tsx');
    const indexJsContent = fs.readFileSync(indexJsPath).toString();

    const indexJsContentReplaced = indexJsContent.replace("{appKey}", options.key || "app-key");
    fs.writeFileSync(indexJsPath, indexJsContentReplaced);

    return success;
};

const createProject = async (options: ICreateAppOptions) => {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || createAndSetTargetDir(options.key || ''),
    };

    const templateDir = path.resolve(__filename, '../../templates/app');

    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        if (err instanceof Error) {
            console.error('%s Invalid template name', chalk.red.bold('ERROR'));
            process.exit(1);
        } else {
            throw err;
        }
    }
    const tasks = new Listr([
        {
            task: () => copyTemplateFiles(options),
            title: 'Copy project files',
        },
        {
            enabled: () => (options.git ? true : false),
            task: () => initGit(options),
            title: 'Initialize git',
        },
        {
            task: () => updatePackageConfig(options),
            title: 'Update package config',
        },
        {
            skip: () =>
                !options.install
                    ? 'Pass --install to automatically install dependencies'
                    : undefined,
            task: () =>
            projectInstall({
                cwd: options.targetDirectory,
            }),
            title: 'Install dependencies',
        },
    ]);

    await tasks.run();
    console.log('%s App ready', chalk.green.bold('DONE'));
    return true;
};
