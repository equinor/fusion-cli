import * as fs from 'fs';
import * as util from 'util';
import * as path from 'path';
import IPackage from './Package';

const readFileAsync = util.promisify(fs.readFile);

export default async (rootDir: string) => {
    const packageContent = await readFileAsync(path.resolve(rootDir, 'package.json'));
    return JSON.parse(packageContent.toString()) as IPackage;
};
