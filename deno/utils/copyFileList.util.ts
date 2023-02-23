import { copyFile } from 'npm:fs';
import { promisify } from 'npm:util';
import type { CopyFiles, Path } from '../types/index.ts';
import { join } from './join.util.ts';

const copyFileAsync = promisify(copyFile);

/**
 * @description
 * Copies files from one directory to another
 *
 * @async
 * @function
 * @name copyFileList
 * @param {Path} projectRoot The path to the root of the project
 * @param {Path} denoSrcRoot The path to the root of the deno directory
 * @param {CopyFiles[]} files An array of objects containing the file paths of the files to be copied
 * @returns {Promise<void>} A promise that resolves when all the files are copied.
 */
export const copyFileList = async (
  projectRoot: Path,
  denoSrcRoot: Path,
  files: CopyFiles[],
): Promise<void> => {
  try {
    await Promise.all(
      files.map(async (file) => {
        await copyFileAsync(
          join(projectRoot, file.from),
          join(denoSrcRoot, file.to),
        );
      }),
    );
  } catch (err) {
    console.error('Error copying files:', err);
    throw err;
  }
};
