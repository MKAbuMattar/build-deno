import type { Path, ProjectPaths } from '../types';
import { join } from './join.util';

/**
 * @function
 * @name getProjectPaths
 * @description
 * Returns an object containing the paths to the project root directory,
 * the node source root directory, and the deno source root directory.
 * @param {Path} nodeSrcRootDir The path to the node project's source root directory
 * relative to the project root.
 * @param {Path} denoSrcRootDir The path to the deno source code's output directory
 * relative to the project root.
 * @returns {ProjectPaths} An object containing the paths to the project root
 * directory, the node source root directory, and the deno source root directory.
 */
export const getProjectPaths = (
  nodeSrcRootDir: Path,
  denoSrcRootDir: Path,
): ProjectPaths => {
  try {
    const projectRoot = process.cwd();
    const nodeSrcRoot = join(projectRoot, nodeSrcRootDir);
    const denoSrcRoot = join(projectRoot, denoSrcRootDir);

    return { projectRoot, nodeSrcRoot, denoSrcRoot } as const;
  } catch (error) {
    console.error('Error getting project paths:', error);
    throw error;
  }
};
