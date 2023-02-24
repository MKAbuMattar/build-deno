import type { Path, SkipFile } from '../types';
import { getProjectPaths } from './getProjectPaths.util';
import { join } from './join.util';

/**
 * @description
 * Returns the absolute paths of files that should be skipped when generating the
 * changelog.
 *
 * @function
 * @name skipFileList
 * @param {Path} sourceDir - The directory where the files to skip are located.
 * @param {Path} outDir - The output directory.
 * @param {SkipFile[]} fileList - The list of files to skip.
 * @returns {Path[]} The absolute paths of files to skip.
 */
export const skipFileList = (
  sourceDir: Path,
  outDir: Path,
  fileList?: SkipFile[],
): Path[] => {
  const { nodeSrcRoot } = getProjectPaths(sourceDir, outDir);
  return (
    fileList?.map((file) => {
      try {
        return join(nodeSrcRoot, file?.dir, file?.name);
      } catch (err) {
        throw new Error(
          `Error joining path ${file.dir} and ${file.name}: ${err}`,
        );
      }
    }) ?? []
  );
};
