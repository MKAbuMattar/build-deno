import { readdirSync } from 'fs';
import { join } from 'path';

import type { Path, SkipExtension } from '../types';
import { getProjectPaths } from './getProjectPaths.util';

/**
 * @function
 * @name skipExtensionList
 * @description
 * Returns the absolute paths of files with specified extensions that should be skipped
 * when building files.
 * @param {Path} sourceDir - The directory where the files to skip are located.
 * @param {Path} outDir - The output directory.
 * @param {SkipExtension[]} extensions - The list of file extensions to skip.
 * @returns {Path[]} The absolute paths of files with specified extensions to skip.
 */
export const getSkipExtensionList = (
  sourceDir: Path,
  outDir: Path,
  extensions: SkipExtension[],
): Path[] => {
  const { nodeSrcRoot } = getProjectPaths(sourceDir, outDir);

  const walk = (dir: Path): Path[] => {
    let files: Path[] = [];

    const dirents = readdirSync(dir, { withFileTypes: true });

    for (const dirent of dirents) {
      const fullPath = join(dir, dirent.name);
      if (dirent.isDirectory()) {
        const subFiles = walk(fullPath);
        files = [...files, ...subFiles];
      } else if (dirent.isFile()) {
        const filename = dirent.name;
        if (
          extensions.some((extension) => filename.endsWith(extension.extension))
        ) {
          files.push(fullPath);
        }
      }
    }

    return files;
  };

  const files = walk(nodeSrcRoot);
  return files;
};
