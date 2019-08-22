import * as path from 'path';

export default (moduleName: string) => path.resolve(
    __dirname,
    '..',
    '..',
    'node_modules',
    moduleName
);