import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export default (root: string): string[] =>
  readdirSync(root)
    .filter((path) => !path.match(/^[.]/))
    .map((path) => join(root, path))
    .filter((path) => statSync(path).isDirectory());
