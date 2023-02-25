import type {
  Path,
  ChangePackage,
  SkipDirectory,
  SkipFile,
  SkipExtension,
  CopyFiles,
  Options,
} from '../src';
import { build } from '../src';

const root: Path = '';

const rootDir: Path = 'src';

const outDir: Path = 'playground/deno';

const changePackage: ChangePackage[] = [
  {
    package: `import { join as joinPath } from 'path';`,
    replace: `import { join as joinPath } from 'npm:path';`,
  },
  {
    package: `import { dirname, extname } from 'path';`,
    replace: `import { dirname, extname } from 'npm:path';`,
  },
  {
    package: `import { copyFile } from 'fs';`,
    replace: `import { copyFile } from 'npm:fs';`,
  },
  {
    byPackageName: true,
    package: `util`,
    replace: `import { promisify } from 'npm:util';`,
  },
  {
    package: `import { statSync } from 'fs';`,
    replace: `import { statSync } from 'npm:fs';`,
  },
  {
    byPackageName: true,
    package: 'fs/promises',
    replace: `import { readdir, readFile, mkdir, writeFile } from 'npm:fs/promises';`,
  },
  {
    package: `import { dirname } from 'path';`,
    replace: `import { dirname } from 'npm:path';`,
  },
  {
    package: `import { readdirSync } from 'fs';`,
    replace: `import { readdirSync } from 'npm:fs';`,
  },
];

const skipDirectory: SkipDirectory[] = [
  {
    dir: '__TEST__',
  },
];

const skipFile: SkipFile[] = [
  {
    dir: '',
    file: 'cli.ts',
  },
];

const skipExtension: SkipExtension[] = [
  {
    extension: '.mock.ts',
  },
];

const copyFiles: CopyFiles[] = [
  {
    from: 'README.md',
    to: 'README.md',
  },
];

const options: Options = {
  root,
  rootDir,
  outDir,
  changePackage,
  skipDirectory,
  skipFile,
  skipExtension,
  copyFiles,
};

build(options);
