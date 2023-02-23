# Build Deno

`build-deno` is a Node.js package that helps you build your Deno source code from your Node source code. It can copy files, change import paths, and skip files during the build process.

## Installation

```sh
# npm
npm install --save-dev build-deno

# yarn
yarn add -D build-deno

# pnpm
pnpm add -D build-deno
```

## Usage

### API

```ts
import { build } from 'build-deno';

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
```

#### Options

- `root`: The root directory of your Node project. Required.
- `rootDir`: The directory of the Node source code. Required.
- `outDir`: The directory where the Deno source code will be generated. Required.
- `changePackage`: An array of objects that specify the package names to change the import path for. Optional.
- `skipFile`: An array of file paths to skip during the build. Optional.
- `copyFiles`: An array of file paths to copy from the Node source code to the Deno source code. Optional.

#### Types

`build-deno` exports the following types:

- `Path`: A string representing a file path.
- `SkipFile`: An object containing the dir and name of a file to skip.
- `ChangePackage`: An object containing the packageName and path of a package to change the import path for.
- `CopyFiles`: An object containing the from and to paths of a file to copy.
- `Options`: An object containing the above properties.

#### Example

You can find an example of `build-deno` in use in the [Denoify](./example/) example project.

## License

`build-deno` is licensed under the [MIT License](LICENSE).
