# Build Deno

`build-deno` is a Node.js package that helps you build your Deno source code from your Node source code. It can copy files, change import paths, and skip files during the build process.

<div align="center">
  <a href="https://www.npmjs.com/package/build-deno" target="_blank">
    <img src="https://img.shields.io/badge/npm-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt=""/>
  </a>

  <a href="https://deno.land/x/build_deno" target="_blank">
    <img src="https://img.shields.io/badge/deno-000000?style=for-the-badge&logo=deno&logoColor=white" alt=""/>
  </a>

  <a href="https://github.com/MKAbuMattar/build-deno" target="_blank">
    <img src="https://img.shields.io/badge/github-%23181717.svg?style=for-the-badge&logo=github&logoColor=white" alt=""/>
  </a>

  <a href="https://github.com/MKAbuMattar/build-deno/releases">
    <img alt="GitHub release" src="https://img.shields.io/github/v/release/MKAbuMattar/build-deno?color=%23d52128&label=Latest%20release&style=for-the-badge" />
    </a>

  <a href="https://github.com/MKAbuMattar/build-deno/blob/main/LICENSE">
    <img alt="GitHub" src="https://img.shields.io/github/license/MKAbuMattar/build-deno?color=%23d52128&style=for-the-badge">
  </a>

  <a href="https://github.com/MKAbuMattar/build-deno/stargazers">
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/MKAbuMattar/build-deno?color=%23d52128&label=github%20stars&style=for-the-badge">
  </a>
</div>

## Installation

### Node

```sh
# npm
npm install --save-dev build-deno

# yarn
yarn add -D build-deno

# pnpm
pnpm add -D build-deno
```

### Deno

Unlike Node, Deno doesn't use a package management like NPM and instead depends on direct URL imports. You can access `build-deno` on deno.land/x. This is how the most recent version may be imported:

You can also specify a particular version:

```ts
import { build } from 'https://deno.land/x/build_deno@1.0.4/mod.ts';
```

or letest version:

```ts
import { build } from 'https://deno.land/x/build_deno/mod.ts';
```

> NOTE: There isn't much of a change in how it's used, but the remainder of this README assumes you're using npm and importing straight from the `build-deno` package.

## Usage

### API

```ts
import type { Path, ChangePackage, CopyFiles, Options } from 'build-deno';
import { build } from 'build-deno';

const root: Path = '';

const rootDir: Path = 'src';

const outDir: Path = 'deno';

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
  copyFiles,
};

build(options);
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

You can find an example of `build-deno` in use in the [Denoify](https://github.com/MKAbuMattar/recursive-directory) example project.

### CLI Commands

To use `build-deno`, you can run the following commands:

#### `build-deno`

Builds your project with the configuration file. Make sure to add the configuration file in the root directory of your project. The configuration file name can be one of the following:

- `build-deno.config.js`
- `build-deno.config.cjs`
- `build-deno.config.mjs`
- `build-deno.config.json`

Example:

```sh
build-deno
```

#### `build-deno -H` or `build-deno --help`

Displays the help menu for `build-deno`.

Example:

```sh
build-deno -H
```

#### `build-deno -V` or `build-deno --version`

Displays the version of `build-deno`.

Example:

```sh
build-deno -V
```

## Configuration

### `build-deno.config.js`

<details>
  <summary>Example Configuration File `build-deno.config.js`</summary>

```js
module.exports = {
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
      dir: 'src',
      name: 'index.ts',
    },
  ],
  copyFiles: [
    {
      from: 'README.md',
      to: 'README.md',
    },
  ],
};
```

</details>

### `build-deno.config.cjs`

<details>
  <summary>Example Configuration File `build-deno.config.cjs`</summary>

```js
module.exports = {
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
      dir: 'src',
      name: 'index.ts',
    },
  ],
  copyFiles: [
    {
      from: 'README.md',
      to: 'README.md',
    },
  ],
};
```

</details>

### `build-deno.config.mjs`

<details>
  <summary>Example Configuration File `build-deno.config.mjs`</summary>

```js
export default {
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
      dir: 'src',
      name: 'index.ts',
    },
  ],
  copyFiles: [
    {
      from: 'README.md',
      to: 'README.md',
    },
  ],
};
```

</details>

### `build-deno.config.json`

<details>
  <summary>Example Configuration File `build-deno.config.json`</summary>

```json
{
  "root": "",
  "rootDir": "src",
  "outDir": "deno",
  "changePackage": [
    {
      "package": "import { join as joinPath } from 'path';",
      "replace": "import { join as joinPath } from 'npm:path';"
    },
    {
      "package": "import { dirname, extname } from 'path';",
      "replace": "import { dirname, extname } from 'npm:path';"
    },
    {
      "package": "import { copyFile } from 'fs';",
      "replace": "import { copyFile } from 'npm:fs';"
    },
    {
      "byPackageName": true,
      "package": "util",
      "replace": "import { promisify } from 'npm:util';"
    },
    {
      "package": "import { statSync } from 'fs';",
      "replace": "import { statSync } from 'npm:fs';"
    },
    {
      "byPackageName": true,
      "package": "fs/promises",
      "replace": "import { readdir, readFile, mkdir, writeFile } from 'npm:fs/promises';"
    },
    {
      "package": "import { dirname } from 'path';",
      "replace": "import { dirname } from 'npm:path';"
    }
  ],
  "skipFile": [
    {
      "dir": "src",
      "name": "index.ts"
    }
  ],
  "copyFiles": [
    {
      "from": "README.md",
      "to": "README.md"
    }
  ]
}
```

</details>

## License

`build-deno` is licensed under the [MIT License](LICENSE).
