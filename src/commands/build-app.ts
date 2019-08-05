import {Command, flags} from '@oclif/command'
import * as Listr from 'listr';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as rimraf from 'rimraf';
import * as archiver from 'archiver';

import babel from '../start-app/parts/babel';
import entry from '../start-app/parts/entry';
import hmr from '../start-app/parts/hmr';
import externals from '../start-app/parts/externals';
import styles from '../start-app/parts/styles';
import typescript from '../start-app/parts/typescript';

interface IBuildAppOptions {
  out: string | undefined;
  silent: boolean;
  zip: boolean;
}

interface IDependencies {
    [key: string] : string;
}

interface IPackage {
    name: string;
    main: string;
    version: string;
    manifest: IAppManifest;
    dependencies: IDependencies;
    devDependencies: IDependencies;
}

interface IAppVersion {
    major: string;
    minor: string;
    patch: string;
}

interface IAppManifest {
    name: string;
    shortName: string;
    key: string;
    main: string;
    version: IAppVersion;
    resources?: string[];
}

interface IBuildContext {
    appOutputDir: string;
    manifest: IAppManifest;
    outputDir: string;
    package: any;
}

const readFileAsync = util.promisify(fs.readFile);
const rimrafAsync = util.promisify(rimraf);
const statAsync = util.promisify(fs.stat);
const existsAsync = async (p: string) => {
    try { await statAsync(p); return true; }
    catch(_) { return false; }
}
const writeFileAsync = util.promisify(fs.writeFile);
const copyFileAsync = util.promisify(fs.copyFile);
const mkdirAsync = util.promisify(fs.mkdir);

export default class BuildApp extends Command {
    public static description = 'Build the app as a ready-to-deply zip bundle';

    public static flags = {
        // help: flags.help({char: 'h'}),
        out: flags.string({char: 'o', description: 'Output path', default: './out'}),
        silent: flags.boolean({ char: 's', description: 'No console output', default: false }),
        zip: flags.boolean({ char: 'z', description: 'Generate zip', default: true, allowNo: true }),
    };

    public async run() {
        const parsed = this.parse(BuildApp);

        await this.buildAppAsync(parsed.flags);
    }

    private async buildAppAsync(options: IBuildAppOptions) {
        const tasks = new Listr([
            {
                task: (ctx, task) => this.clearOutputDirAsync(ctx, task),
                title: 'Clean output dir',
            },
            {
                task: (ctx, task) => this.runBuildAsync(ctx, task),
                title: 'Build',
            },
            {
                task: (ctx, task) => this.writeManifestAsync(ctx, task),
                title: 'Generate manifest',
            },
            {
                task: (ctx, task) => this.copyResourcesAsync(ctx, task),
                title: 'Copy resources',
            },
            {
                enabled: () => options.zip,
                task: (ctx, task) => this.generateZipAsync(ctx, task),
                title: 'Generate zip',
            },
        ], {
            renderer: options.silent ? 'silent' : 'default',
        });

        const appPackage = await this.getPackageAsync(process.cwd());
        const manifest = await this.generateManifestAsync(appPackage);
        const outputDir = await this.getOutputDirAsync(options);

        const context: IBuildContext = {
            appOutputDir: path.resolve(outputDir, appPackage.name),
            manifest,
            outputDir,
            package: appPackage,
        };
    
        await tasks.run(context);        
    }

    private async clearOutputDirAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        task.output = 'Cleaning output dir';

        const outputDirExists = await existsAsync(context.appOutputDir);

        if(outputDirExists) {
            await rimrafAsync(context.appOutputDir);
        }

        task.title = 'Output dir cleaned';
    }

    private runBuildAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        return new Promise<void>(async (resolve) => {
            task.output = 'Configuring';

            const config = await this.createWebpackConfigAsync(context, task);
            const compiler = webpack(config);
    
            task.title = 'Building';
            compiler.run(() => {
                task.title = 'Build completed';
                resolve();
            });
        });
    }

    private async generateManifestAsync(appPackage: IPackage) {
        const manifest = appPackage.manifest;
        manifest.key = appPackage.name;
        manifest.main = appPackage.main;
        manifest.version = this.parsePackageVersion(appPackage);

        return manifest;
    }

    private async writeManifestAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        await writeFileAsync(path.resolve(context.appOutputDir, 'app-manifest.json'), JSON.stringify(context.manifest, null, 4));
        task.title = 'Manifest generated';
    }

    private async copyResourcesAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        await this.copyResourceAsync(process.cwd(), context.appOutputDir, 'app-icon.svg', task);
        await this.copyResourceAsync(process.cwd(), context.appOutputDir, 'app-icon.png', task);

        if(context.manifest.resources) {
            const copyTasks = context.manifest.resources.map((resource: string) => 
            this.copyResourceAsync(process.cwd(), context.appOutputDir, resource, task));
            await Promise.all(copyTasks);
        }

        task.title = 'Resources copied';
    }

    private async copyResourceAsync(sourcePath: string, destinationPath: string, resourceName: string, task: Listr.ListrTaskWrapper) {
        task.output = `Copying ${resourceName}`;

        const from = path.resolve(sourcePath, resourceName);

        const sourceExists = await existsAsync(from);
        if(!sourceExists) {
            return;
        }

        const to = path.resolve(destinationPath, resourceName);

        try {
            await mkdirAsync(path.dirname(to), { recursive: true });
        } catch(error) {
            if(error.code !== 'EEXIST') {
                throw error;
            }
        }

        await copyFileAsync(from, to);
    }

    private async generateZipAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        const output = fs.createWriteStream(path.join(context.outputDir, context.manifest.key + ".zip"));

        const archive = archiver("zip", {
            zlib: { level: 9 },
        });

        archive.directory(context.appOutputDir, false);

        archive.pipe(output);

        await archive.finalize();

        task.title = 'Zip generated';
    }

    private async createWebpackConfigAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        const fusionCliPackage = await this.getPackageAsync(path.resolve(__dirname, '..', '..'))
        const cliDependencies = await this.getDependenciesAsync(fusionCliPackage);
        const moduleDependencies = await this.getDependenciesAsync(context.package);

        const progressHandler = (percentage: number, msg: string, moduleProgress?: string) => {
            const percentageString = Math.ceil((percentage * 100)).toString();
            const messages = [
                '[webpack]',
                msg,
                moduleProgress,
            ];

            task.output = messages.filter(m => m).join(' ');
            task.title = `Building (${percentageString}%)`;
        };
        
        return merge(
                babel,
                {
                    mode: 'production',
                },
                entry,
                hmr,
                externals(cliDependencies, moduleDependencies),
                styles,
                typescript,
                {
                    output: {
                        filename: 'app-bundle.js',
                        path: context.appOutputDir,
                        publicPath: '/',
                    },
                },
                {
                    plugins: [new webpack.ProgressPlugin(progressHandler)]
                }
            );
    }

    private async getOutputDirAsync(options: IBuildAppOptions) {
        return path.resolve(process.cwd(), options.out || '/out');
    }

    private async getPackageAsync(rootDir: string) {
        const packageContent = await readFileAsync(path.resolve(rootDir, 'package.json'));
        return JSON.parse(packageContent.toString()) as IPackage;
    }

    private async getDependenciesAsync(appPackage: IPackage) {
        return { ...appPackage.dependencies, ...appPackage.devDependencies };
    }

    private parsePackageVersion(appPackage: IPackage): IAppVersion {
        const parts = appPackage.version.split(".");
        return {
            major: parts[0],
            minor: parts[1],
            patch: parts[2],
        };
    }
}