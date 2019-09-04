import { Command, flags } from '@oclif/command';
import * as Listr from 'listr';
import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as rimraf from 'rimraf';
import * as archiver from 'archiver';

import babel from '../build/parts/babel';
import entry from '../build/parts/entry';
import hmr from '../build/parts/hmr';
import externals from '../build/parts/externals';
import styles from '../build/parts/styles';
import typescript from '../build/parts/typescript';
import output from '../build/parts/output';
import mode from '../build/parts/mode';
import * as logSymbols from 'log-symbols';

import IAppManifest from '../build/AppManifest';
import IAppVersion from '../build/AppVersion';
import IPackage from '../build/Package';

import getPackageAsync from '../build/getPackageAsync';
import getPackageDependencies from '../build/getPackageDependencies';

interface IBuildAppOptions {
    out: string | undefined;
    silent: boolean;
    zip: boolean;
}

interface IBuildContext {
    appOutputDir: string;
    manifest: IAppManifest;
    outputDir: string;
    package: any;
    buildSucceeded?: boolean;
}

// Promisify
const readFileAsync = util.promisify(fs.readFile);
const rimrafAsync = util.promisify(rimraf);
const statAsync = util.promisify(fs.stat);
const existsAsync = async (p: string) => {
    try {
        await statAsync(p);
        return true;
    } catch (e) {
        return false;
    }
};
const writeFileAsync = util.promisify(fs.writeFile);
const copyFileAsync = util.promisify(fs.copyFile);
const mkdirAsync = util.promisify(fs.mkdir);

class Timer {
    private readonly start: Date = new Date();

    public getEllapsedSeconds() {
        const end = new Date();
        return ((end.getTime() - this.start.getTime()) / 1000).toFixed(2) + ' seconds';
    }
}

class CompileError extends Error {
    public readonly errors: any[];

    constructor(errors: any[]) {
        super(errors.map(e => e.message).join('\n'));
        this.errors = errors;
    }
}

export default class BuildApp extends Command {
    public static description = 'Build the app as a ready-to-deply zip bundle';

    public static flags = {
        // help: flags.help({char: 'h'}),
        out: flags.string({ char: 'o', description: 'Output path', default: './out' }),
        silent: flags.boolean({ char: 's', description: 'No console output', default: false }),
        zip: flags.boolean({
            allowNo: true,
            char: 'z',
            default: true,
            description: 'Generate zip',
        }),
    };

    public async run() {
        const parsed = this.parse(BuildApp);

        await this.buildAppAsync(parsed.flags);
    }

    private async buildAppAsync(options: IBuildAppOptions) {
        const timer = new Timer();

        const tasks = new Listr(
            [
                {
                    task: (ctx, task) => this.clearOutputDirAsync(ctx, task),
                    title: 'Clean output dir',
                },
                {
                    task: (ctx, task) => this.runBuildAsync(ctx, task),
                    title: 'Build',
                },
                {
                    skip: ctx => !ctx.buildSucceeded,
                    task: (ctx, task) => this.writeManifestAsync(ctx, task),
                    title: 'Generate manifest',
                },
                {
                    skip: ctx => !ctx.buildSucceeded,
                    task: (ctx, task) => this.copyResourcesAsync(ctx, task),
                    title: 'Copy resources',
                },
                {
                    enabled: () => options.zip,
                    skip: ctx => !ctx.buildSucceeded,
                    task: (ctx, task) => this.generateZipAsync(ctx, task),
                    title: 'Generate zip',
                },
            ],
            {
                renderer: options.silent ? 'silent' : 'default',
            }
        );

        const appPackage = await getPackageAsync(process.cwd());
        const manifest = await this.generateManifestAsync(appPackage);
        const outputDir = await this.getOutputDirAsync(options);

        const context: IBuildContext = {
            appOutputDir: path.resolve(outputDir, appPackage.name),
            manifest,
            outputDir,
            package: appPackage,
        };

        try {
            await tasks.run(context);

            this.log(
                `${logSymbols.success} Built the ${
                    manifest.name
                } app in ${timer.getEllapsedSeconds()}`
            );
        } catch (e) {
            if (e.errors) {
                (e.errors as any[]).forEach(e => this.error(e.message));
            }

            this.log(`${logSymbols.error} Build failed after ${timer.getEllapsedSeconds()}`);
            // this.error(e);
            this.exit(1);
        }
    }

    private async clearOutputDirAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        const timer = new Timer();

        task.output = 'Cleaning output dir';

        const outputDirExists = await existsAsync(context.outputDir);

        if (outputDirExists) {
            await rimrafAsync(context.outputDir);
        }

        task.title = 'Output dir cleaned in ' + timer.getEllapsedSeconds();
    }

    private runBuildAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        return new Promise<void>(async (resolve, reject) => {
            task.output = 'Configuring';

            const config = await this.createWebpackConfigAsync(context, task);
            const compiler = webpack(config);

            task.title = 'Building';
            compiler.run((err, stats) => {
                context.buildSucceeded = !err && !stats.hasErrors();

                if (err) {
                    task.title = 'Build failed';
                    return reject(err);
                }

                if (stats.hasErrors()) {
                    task.title = 'Build failed';
                    return reject(new CompileError(stats.compilation.errors));
                }

                const buildDuration = (stats.endTime || 0) - (stats.startTime || 0);
                task.title = `Build completed in ${(buildDuration / 1000).toFixed(2)} seconds`;
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
        const timer = new Timer();

        await writeFileAsync(
            path.resolve(context.appOutputDir, 'app-manifest.json'),
            JSON.stringify(context.manifest, null, 4)
        );

        task.title = 'Manifest generated in ' + timer.getEllapsedSeconds();
    }

    private async copyResourcesAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        const timer = new Timer();

        await this.copyResourceAsync(process.cwd(), context.appOutputDir, 'app-icon.svg', task);
        await this.copyResourceAsync(process.cwd(), context.appOutputDir, 'app-icon.png', task);

        if (context.manifest.resources) {
            const copyTasks = context.manifest.resources.map((resource: string) =>
                this.copyResourceAsync(process.cwd(), context.appOutputDir, resource, task)
            );
            await Promise.all(copyTasks);
        }

        task.title = 'Resources copied in ' + timer.getEllapsedSeconds();
    }

    private async copyResourceAsync(
        sourcePath: string,
        destinationPath: string,
        resourceName: string,
        task: Listr.ListrTaskWrapper
    ) {
        task.output = `Copying ${resourceName}`;

        const from = path.resolve(sourcePath, resourceName);

        const sourceExists = await existsAsync(from);
        if (!sourceExists) {
            throw new Error(`Unable to find resource: ${resourceName} in ${from}`);
        }

        const to = path.resolve(destinationPath, resourceName);

        try {
            await mkdirAsync(path.dirname(to), { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }

        await copyFileAsync(from, to);
    }

    private async generateZipAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        const timer = new Timer();

        const outputStream = fs.createWriteStream(
            path.join(context.outputDir, context.manifest.key + '.zip')
        );

        const archive = archiver('zip', {
            zlib: { level: 9 },
        });

        archive.directory(context.appOutputDir, false);

        archive.pipe(outputStream);

        await archive.finalize();

        task.title = 'Zip generated in ' + timer.getEllapsedSeconds();
    }

    private async createWebpackConfigAsync(context: IBuildContext, task: Listr.ListrTaskWrapper) {
        const fusionCliPackage = await getPackageAsync(path.resolve(__dirname, '..', '..'));
        const cliDependencies = await getPackageDependencies(fusionCliPackage);
        const moduleDependencies = await getPackageDependencies(context.package);

        const progressHandler = (percentage: number, msg: string, moduleProgress?: string) => {
            const percentageString = Math.ceil(percentage * 100).toString();
            const messages = ['[webpack]', msg, moduleProgress];

            task.output = messages.filter(m => m).join(' ');
            task.title = `Building (${percentageString}%)`;
        };

        return merge(
            babel,
            mode(true),
            entry(context.package, true),
            externals(cliDependencies, moduleDependencies),
            styles,
            typescript(context.appOutputDir, true),
            output('app-bundle.js', context.appOutputDir),
            {
                plugins: [new webpack.ProgressPlugin(progressHandler)],
            }
        );
    }

    private async getOutputDirAsync(options: IBuildAppOptions) {
        return path.resolve(process.cwd(), options.out || '/out');
    }

    private parsePackageVersion(appPackage: IPackage): IAppVersion {
        const parts = appPackage.version.split('.');
        return {
            major: parts[0],
            minor: parts[1],
            patch: parts[2],
        };
    }
}
