import { readdirSync } from 'fs';

import type { Path, SkipDirectory } from '../types';
import { getProjectPaths } from './getProjectPaths.util';
import { join } from './join.util';

/**
 * @function
 * @name getSkipDirectoryList
 * @description
 * Returns the absolute paths of files in directories that should be skipped when
 * generating the changelog.
 * @param {Path} sourceDir - The directory where the directories to skip are located.
 * @param {Path} outDir - The output directory.
 * @param {SkipDirectory[]} directoryList - The list of directories to skip.
 * @returns {Path[]} The absolute paths of directories to skip.
 */
export const getSkipDirectoryList = (
  sourceDir: Path,
  outDir: Path,
  directoryList?: SkipDirectory[],
): Path[] => {
  const { nodeSrcRoot } = getProjectPaths(sourceDir, outDir);
  const skippedFiles: Path[] = [];

  directoryList?.forEach((dir) => {
    try {
      const files = readdirSync(join(nodeSrcRoot, dir.dir));
      files.forEach((file) => {
        skippedFiles.push(join(nodeSrcRoot, dir.dir, file));
      });
    } catch (err) {
      throw new Error(`Error reading directory ${dir.dir}: ${err}`);
    }
  });

  return skippedFiles;
};
