import { copyFile } from 'fs';
import { promisify } from 'util';

import type { CopyFiles, Path } from '../types';
import { join } from './join.util';

const copyFileAsync = promisify(copyFile);

/**
 * @async
 * @function
 * @name copyFileList
 * @description
 * Copies files from one directory to another
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
