import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { build } from '.';
import type {
  ChangePackage,
  CopyFiles,
  Options,
  SkipDirectory,
  SkipExtension,
  SkipFile,
} from './types';

/**
 * @constant
 * @name START
 * @description
 * The start time of the script.
 * @type {number} The start time of the script.
 */
const START: number = performance.now();

/**
 * @constant
 * @name VERSION
 * @description
 * The version of the package.
 * @type {string} The version of the package.
 */
const VERSION = '__VERSION__';

/**
 * @constant
 * @name POSSIBLE_CONFIG_FILE_NAMES
 * @description
 * The possible names of the configuration file.
 * @type {readonly} The possible names of the configuration file.
 */
const POSSIBLE_CONFIG_FILE_NAMES: readonly [
  'build-deno.config.js',
  'build-deno.config.cjs',
  'build-deno.config.mjs',
  'build-deno.config.json',
] = [
  'build-deno.config.js',
  'build-deno.config.cjs',
  'build-deno.config.mjs',
  'build-deno.config.json',
] as const;

/**
 * @function
 * @name getConfigPath
 * @description
 * Returns the path of the config file if it exists.
 * @param {string} fileName The name of the config file.
 * @returns {string | undefined} The path to the config file or undefined.
 */
const getConfigPath = (fileName: string): string | undefined => {
  const cwd = process.cwd();
  const configPath = resolve(cwd, fileName);
  return existsSync(configPath) ? configPath : undefined;
};

/**
 * @function
 * @name findConfigInCwdByFileName
 * @description
 * Finds and returns the path of a configuration file in the current working directory by its file name.
 * @param {string|undefined} configFileName - The name of the configuration file to search for.
 * If undefined, the function will look for any of the supported file names.
 * @returns {string|undefined} The path of the configuration file if found, otherwise undefined.
 */
const findConfigInCwdByFileName = (
  configFileName: string | undefined = undefined,
): string | undefined => {
  if (configFileName) {
    if (POSSIBLE_CONFIG_FILE_NAMES.includes(configFileName as any)) {
      const configPath = getConfigPath(configFileName);
      if (configPath !== undefined) {
        console.log(`\n🚀 \x1b[36mUsing config file: ${configFileName}\x1b[0m`);
        return configPath;
      }
    }
  }

  return undefined;
};

/**
 * @function
 * @name findConfigFileNameInCwd
 * @description
 * Find the config file in the current working directory.
 * This will first check for a config file in the current working directory,
 * then check for a config file in the user's home directory.
 * @returns {string | undefined} The path to the config file, or undefined if no config file was found.
 */
const findConfigFileNameInCwd = (): string | undefined => {
  for (const fileName of POSSIBLE_CONFIG_FILE_NAMES) {
    const configPath = getConfigPath(fileName);
    if (configPath !== undefined) {
      console.log(`\n🚀  \x1b[36mUsing config file: ${fileName}\x1b[0m`);
      return configPath;
    }
  }
  return undefined;
};

/**
 * @function
 * @name readConfig
 * @description
 * Read configuration file and return configuration object.
 * @param file The configuration file path.
 */
const readConfig = async (file: string): Promise<Options> => {
  const extension = file.slice(file.lastIndexOf('.'));
  switch (extension) {
    case '.js':
    case '.cjs':
      return require(file);
    case '.mjs':
      const imported = await import(`file://${file}`);
      return imported.default;
    case '.json':
      return JSON.parse(readFileSync(file, { encoding: 'utf-8' })) as Options;
    default:
      throw new Error(
        `❌  \x1b[31mERROR:\x1b[0m Unsupported file type: ${extension}`,
      );
  }
};

/**
 * @function
 * @name isChangePackage
 * @description
 * Validate configuration object. Returns true if valid, otherwise false.
 * @param {any} obj The object to validate.
 * @returns {obj is ChangePackage} True if valid, otherwise false.
 */
const isChangePackage = (obj: any): obj is ChangePackage => {
  return typeof obj.package === 'string' && typeof obj.replace === 'string';
};

/**
 * @function
 * @name isSkipDirectory
 * @description
 * Validate configuration object. Returns true if valid, otherwise false.
 * @param {any} obj The object to validate.
 * @returns {obj is SkipDirectory} True if valid, otherwise false.
 */
const isSkipDirectory = (obj: any): obj is SkipDirectory => {
  return typeof obj.dir === 'string';
};

/**
 * @function
 * @name isSkipFile
 * @description
 * Validate configuration object. Returns true if valid, otherwise false.
 * @param {any} obj The object to validate.
 * @returns {obj is SkipFile} True if valid, otherwise false.
 */
const isSkipFile = (obj: any): obj is SkipFile => {
  return typeof obj.dir === 'string' && typeof obj.file === 'string';
};

/**
 * @function
 * @name isSkipExtension
 * @description
 * Validate configuration object. Returns true if valid, otherwise false.
 * @param {any} obj The object to validate.
 * @returns {obj is SkipExtension} True if valid, otherwise false.
 */
const isSkipExtension = (obj: any): obj is SkipExtension => {
  return typeof obj.extension === 'string';
};

/**
 * @function
 * @name isCopyFiles
 * @description
 * Validate configuration object. Returns true if valid, otherwise false.
 * @param {any} obj The object to validate.
 * @returns {obj is CopyFiles} True if valid, otherwise false.
 */
const isCopyFiles = (obj: any): obj is CopyFiles => {
  return typeof obj.from === 'string' && typeof obj.to === 'string';
};

/**
 * @function
 * @name isOptions
 * @description
 * Validate configuration object. Returns true if valid, otherwise false.
 * @param {any} obj The object to validate.
 * @returns {obj is Options} True if valid, otherwise false.
 */
const isOptions = (obj: any): obj is Options => {
  console.log('\n\x1b[35m⚙️  Validating configuration file\x1b[0m');
  return (
    typeof obj.root === 'string' &&
    typeof obj.rootDir === 'string' &&
    typeof obj.outDir === 'string' &&
    (!obj.changePackage ||
      (Array.isArray(obj.changePackage) &&
        obj.changePackage.every(isChangePackage))) &&
    (!obj.skipDirectory ||
      (Array.isArray(obj.skipDirectory) &&
        obj.skipDirectory.every(isSkipDirectory))) &&
    (!obj.skipFile ||
      (Array.isArray(obj.skipFile) && obj.skipFile.every(isSkipFile))) &&
    (!obj.skipExtension ||
      (Array.isArray(obj.skipExtension) &&
        obj.skipExtension.every(isSkipExtension))) &&
    (!obj.copyFiles ||
      (Array.isArray(obj.copyFiles) && obj.copyFiles.every(isCopyFiles)))
  );
};

const help = () => {
  console.log(`
🤖 Usage: build-deno [-<O>, --<options>]

Options:
  \x1b[36m-H, --help\x1b[0m         Show help 📖
  \x1b[36m-V, --version\x1b[0m      Show version 🚀
  \x1b[36m-C, --config\x1b[0m       Path to configuration file 📄

Examples:
  $ \x1b[32mbuild-deno\x1b[0m         Build project with configuration file
  $ \x1b[32mbuild-deno -H\x1b[0m      Show help
  $ \x1b[32mbuild-deno -V\x1b[0m      Show version

Note:
  \x1b[33mMake sure to add the configuration file in the root directory of your project.\x1b[0m
  
  📄 \x1b[33mConfiguration file name can be one of the following:\x1b[0m
  - \x1b[32mbuild-deno.config.js\x1b[0m
  - \x1b[32mbuild-deno.config.cjs\x1b[0m
  - \x1b[32mbuild-deno.config.mjs\x1b[0m
  - \x1b[32mbuild-deno.config.json\x1b[0m

🔍 \x1b[36mFor more information, visit https://github.com/MKAbuMattar/build-deno#readme 🌐\x1b[0m

\x1b[35m👨‍💻 \x1b[36mAuthor:\x1b[0m \x1b[32mMohammad Abu Mattar\x1b[0m
\x1b[35m🌐 \x1b[36mPortfolio:\x1b[0m \x1b[32mhttps://MKAbuMattar.github.io\x1b[0m
`);
};

const configPathError = () => {
  console.error(`
❌ \x1b[31mMissing configuration file\x1b[0m
  
\x1b[33mMake sure to add the configuration file in the root directory of your project.\x1b[0m
  
📄 \x1b[33mConfiguration file name can be one of the following:\x1b[0m
  - \x1b[32mbuild-deno.config.js\x1b[0m
  - \x1b[32mbuild-deno.config.cjs\x1b[0m
  - \x1b[32mbuild-deno.config.mjs\x1b[0m
  - \x1b[32mbuild-deno.config.json\x1b[0m

🔍 \x1b[36mFor more information, visit https://github.com/MKAbuMattar/build-deno#readme 🌐\x1b[0m
  `);
};

const invalidConfigError = () => {
  console.error(`
❌ \x1b[31mInvalid configuration file\x1b[0m

\x1b[33mMake sure to add the configuration file is formatted correctly.\x1b[0m

📄 \x1b[33mConfiguration file name can be one of the following:\x1b[0m
  - \x1b[32mbuild-deno.config.js\x1b[0m
  - \x1b[32mbuild-deno.config.cjs\x1b[0m
  - \x1b[32mbuild-deno.config.mjs\x1b[0m
  - \x1b[32mbuild-deno.config.json\x1b[0m

🔍 \x1b[36mFor more information, visit https://github.com/MKAbuMattar/build-deno#readme 🌐\x1b[0m
  `);
};

/**
 * @function
 * @name cliOptions
 * @description
 * Get options from the command line, and return the options object.
 * If no options are provided, the function will try to read the configuration file.
 * If no configuration file is found, the function will return the default options.
 * @param {string[]} args The arguments passed to the command line.
 * @returns {Promise<Options>} The options object.
 */
const cliOptions = (async (): Promise<Options> => {
  const args = process.argv.slice(2);
  const options: Options = {
    root: '',
    rootDir: 'src',
    outDir: 'dist',
    changePackage: [],
    skipFile: [],
    copyFiles: [],
  };

  let configPath: string | undefined = undefined;
  let configFileName: string | undefined = undefined;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-H' || arg === '--help') {
      help();
      process.exit(0);
    } else if (arg === '-V' || arg === '--version') {
      console.log(`\n🦕 \x1b[36mbuild-deno v${VERSION}\x1b[0m\n`);
      process.exit(0);
    } else if (arg === '-C' || arg === '--config') {
      configFileName = args[++i];
    } else {
      console.error(`\n❌ \x1b[31mUnknown option: ${arg}\x1b[0m`);
      help();
      process.exit(1);
    }
  }

  console.log('\n🦕 \x1b[36mStarting build-deno...\x1b[0m');

  if (configFileName) {
    configPath = findConfigInCwdByFileName(configFileName);
  }

  if (!configPath && configFileName === undefined) {
    configPath = findConfigFileNameInCwd();
  }

  if (!configPath) {
    configPathError();
    process.exit(1);
  }

  const configFile = await readConfig(configPath);

  if (!isOptions(configFile)) {
    invalidConfigError();
    process.exit(1);
  }

  console.log('\n📄 \x1b[36mConfiguration file is valid\x1b[0m');

  Object.assign(options, configFile);
  return options;
})();

/**
 * @function
 * @description
 * Create the CLI options from the command line arguments.
 * @param args the command line arguments
 * @param cwd the current working directory
 * @returns a promise that resolves to the CLI options
 */
(async (): Promise<void> => {
  const getCLIOptions = await cliOptions;

  const options: Options = {
    root: getCLIOptions.root,
    rootDir: getCLIOptions.rootDir,
    outDir: getCLIOptions.outDir,
    changePackage: getCLIOptions.changePackage,
    skipDirectory: getCLIOptions.skipDirectory,
    skipFile: getCLIOptions.skipFile,
    skipExtension: getCLIOptions.skipExtension,
    copyFiles: getCLIOptions.copyFiles,
  };

  console.log('\n👷 \x1b[36mBuilding project...\x1b[0m');

  await build(options);

  /**
   * @constant
   * @name END
   * @description
   * End the timer and log the time it took to build the project.
   * @type {number}
   */
  const END: number = performance.now();

  console.log(
    `\n✅ \x1b[32mBuild complete in ${((END - START) / 1000).toFixed(
      2,
    )}s\x1b[0m`,
  );
})();
