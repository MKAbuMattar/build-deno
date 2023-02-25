/**
 * @description
 * A string representing a file or directory path.
 */
export type Path = string;

/**
 * @description
 * An object representing a package whose import path should be changed during the build process.
 *
 * @property {boolean} [byPackageName] - A boolean indicating whether the package
 * name should be used to match import statements. Defaults to `false`.
 * @property {string} package - The name of the package to match in import statements.
 * @property {string} replace - The new import path for the matched package.
 */
export type ChangePackage = {
  byPackageName?: boolean;
  package: string;
  replace: string;
};

/**
 * @description
 * An object representing a directory to skip during the build process.
 *
 * @property {Path} dir - The directory to skip.
 */
export type SkipDirectory = {
  dir: Path;
};

/**
 * @description
 * An object representing a file or directory to skip during the build process.
 *
 * @property {Path} dir - The directory containing the file to skip.
 * @property {Path} file - The name of the file to skip.
 */
export type SkipFile = {
  dir: Path;
  file: Path;
};

/**
 * @description
 * An object representing a file extension to skip during the build process.
 *
 * @property {string} extension - The file extension to skip.
 */
export type SkipExtension = {
  extension: string;
};

/**
 * @description
 * An object representing a file to copy during the build process.
 *
 * @property {Path} from - The source file to copy.
 * @property {Path} to - The destination file to copy to.
 */
export type CopyFiles = {
  from: Path;
  to: Path;
};

/**
 * @description
 * An object representing paths for the Node and Deno source code directories.
 *
 * @property {string} projectRoot - The root directory of the project.
 * @property {string} nodeSrcRoot - The directory of the Node source code.
 * @property {string} denoSrcRoot - The directory of the Deno source code.
 */
export type ProjectPaths = {
  projectRoot: string;
  nodeSrcRoot: string;
  denoSrcRoot: string;
};

/**
 * @description
 * An object containing options for the build process.
 *
 * @property {Path} root - The root directory.
 * @property {Path} rootDir - The directory of the Node source code.
 * @property {Path} outDir - The directory of the Deno source code.
 * @property {ChangePackage[]} [changePackage] - An array of package names to change the import path for.
 * @property {SkipFile[]} [skipFile] - An array of file paths to skip during the build.
 * @property {CopyFiles[]} [copyFiles] - An array of file paths to copy from the Node source code to the Deno source code.
 */
export type Options = {
  root: Path;
  rootDir: Path;
  outDir: Path;
  changePackage?: ChangePackage[];
  skipDirectory?: SkipDirectory[];
  skipFile?: SkipFile[];
  skipExtension?: SkipExtension[];
  copyFiles?: CopyFiles[];
};
