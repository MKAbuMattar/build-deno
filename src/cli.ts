import * as fs from 'fs';
import * as path from 'path';
import type { Options } from './types';
import { build } from './core/build';
import { version } from '../package.json';

/**
 * @description
 * Returns the path of the config file if it exists.
 *
 * @function
 * @name getConfigPath
 * @param {string} fileName The name of the config file.
 * @returns {string | undefined} The path to the config file or undefined.
 */
const getConfigPath = (fileName: string): string | undefined => {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, fileName);
  return fs.existsSync(configPath) ? configPath : undefined;
};

/**
 * @description
 * Find the config file in the current working directory.
 * This will first check for a config file in the current working directory,
 * then check for a config file in the user's home directory.
 *
 * @function
 * @name findConfigFileNameInCwd
 * @returns {string | undefined} The path to the config file, or undefined if no config file was found.
 */
const findConfigFileNameInCwd = (): string | undefined => {
  const possibleConfigFileNames = [
    'build-deno.config.js',
    'build-deno.config.cjs',
    'build-deno.config.mjs',
    'build-deno.config.json',
  ] as const;
  for (const fileName of possibleConfigFileNames) {
    const configPath = getConfigPath(fileName);
    if (configPath !== undefined) {
      console.log(`\n🚀  \x1b[36mUsing config file: ${fileName}\x1b[0m`);
      return configPath;
    }
  }
  return undefined;
};

/**
 * @description
 * Read configuration file and return configuration object.
 *
 * @function
 * @name readConfig
 * @param file The configuration file path.
 */
const readConfig = async (file: string): Promise<Options> => {
  console.log(
    `\n\x1b[35m⚙️  Reading configuration from file:\x1b[0m \x1b[36m${file}\x1b[0m`,
  );
  const extension = file.slice(file.lastIndexOf('.'));
  switch (extension) {
    case '.js':
    case '.cjs':
      return require(file);
    case '.mjs':
      const imported = await import(`file://${file}`);
      return imported.default;
    case '.json':
      const data = fs.readFileSync(file, { encoding: 'utf-8' });
      return JSON.parse(data) as Options;
    default:
      throw new Error(
        `❌  \x1b[31mERROR:\x1b[0m Unsupported file type: ${extension}`,
      );
  }
};

const help = () => {
  console.log(`
🤖 Usage: build-deno [-<O>, --<options>]

Options:
  \x1b[36m-H, --help\x1b[0m         Show help 📖
  \x1b[36m-V, --version\x1b[0m      Show version 🚀

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

/**
 * @description
 * Get options from the command line, and return the options object.
 * If no options are provided, the function will try to read the configuration file.
 * If no configuration file is found, the function will return the default options.
 *
 * @function
 * @name cliOptions
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
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-H':
      case '--help': {
        help();
        process.exit(0);
      }
      case '-V':
      case '--version': {
        console.log(`\n🚀 \x1b[36mbuild-deno v${version}\x1b[0m\n`);
        process.exit(0);
      }
      default: {
        console.error(`\n❌ \x1b[31mUnknown option: ${arg}\x1b[0m`);
        help();
        process.exit(1);
      }
    }
  }

  console.log(`\n🦕 \x1b[36mStarting build-deno...\x1b[0m`);

  if (!configPath) {
    configPath = findConfigFileNameInCwd();
    if (!configPath) {
      console.error(`
❌ \x1b[31mMissing configuration file\x1b[0m

Please add a configuration file to the root directory of your project.

📄 \x1b[33mConfiguration file name can be one of the following:\x1b[0m
  - \x1b[32mbuild-deno.config.js\x1b[0m
  - \x1b[32mbuild-deno.config.cjs\x1b[0m
  - \x1b[32mbuild-deno.config.mjs\x1b[0m
  - \x1b[32mbuild-deno.config.json\x1b[0m

🔍 \x1b[36mFor more information, visit https://github.com/MKAbuMattar/build-deno#readme 🌐\x1b[0m
`);
      process.exit(1);
    }
  }

  const configFile = await readConfig(configPath);
  Object.assign(options, configFile);

  return options;
})();

/**
 * @description
 * Create the CLI options from the command line arguments.
 *
 * @param args the command line arguments
 * @param cwd the current working directory
 * @returns a promise that resolves to the CLI options
 */
(async () => {
  const getCliOptions = await cliOptions;

  const options: Options = {
    root: getCliOptions.root,
    rootDir: getCliOptions.rootDir,
    outDir: getCliOptions.outDir,
    changePackage: getCliOptions.changePackage,
    skipFile: getCliOptions.skipFile,
    copyFiles: getCliOptions.copyFiles,
  };

  console.log(`\n👷 \x1b[36mBuilding project...\x1b[0m`);
  await build(options);
  console.log(`\n✅ \x1b[32mBuild complete\x1b[0m`);
})();
