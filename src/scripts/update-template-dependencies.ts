import { writeFileSync } from 'fs';
import { join, resolve } from 'path';

import getPackage from '../build/getPackageAsync';
import templateDirs from './template-dirs';

type Deps = Record<string, string>;
const updateDeps = (a: Deps, b: Deps) => Object.keys(a).reduce((o, k) => ({ ...o, [k]: b[k] ? b[k] : a[k] }), {});

(async () => {
    const cwd = resolve(process.cwd());

    const cliPackage = await getPackage(cwd);
    const deps = { ...cliPackage.devDependencies, ...cliPackage.dependencies };

    const updateTemplate = async (dir: string): Promise<void> => {
        const pkg = await getPackage(dir);
        pkg.dependencies = updateDeps(pkg.dependencies, deps);
        pkg.devDependencies = updateDeps(pkg.devDependencies, deps);
        pkg.devDependencies['@equinor/fusion-cli'] = cliPackage.version;
        writeFileSync(join(dir, 'package.json'), JSON.stringify(pkg, undefined, 2));
    }

    templateDirs(join(cwd, 'src', 'templates')).forEach(updateTemplate);
})();