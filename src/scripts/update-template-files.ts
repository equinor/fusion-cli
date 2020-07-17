import { readdirSync, statSync, copyFileSync } from 'fs';
import { join, basename, resolve } from 'path';
import templateDirs from './template-dirs';

const root = resolve(process.cwd(), 'src', 'templates');
const dir = join(root, '.config');
const files = readdirSync(dir).map(path => join(dir, path)).filter(path => statSync(path).isFile());

const copyFiles = (dir: string) => files.forEach(file => copyFileSync(file, join(dir, basename(file))));

templateDirs(root).forEach(copyFiles);