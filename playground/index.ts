import { build } from '../src';

build({
  root: '',
  rootDir: 'src',
  outDir: 'deno',
  changePackage: [
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
  ],
  skipFile: [
    {
      dir: '__TEST__',
      name: 'index.test.ts',
    },
  ],
  copyFiles: [
    {
      from: 'README.md',
      to: 'README.md',
    },
  ],
});
