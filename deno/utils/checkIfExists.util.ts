import { statSync } from 'npm:fs';
import type { Path } from '../types/index.ts';

/**
 * @description
 * This function checks if a file exists at a given path.
 * It returns true if the file exists, false otherwise.
 * If an error occurs, it returns false and logs the error.
 *
 * @function
 * @name checkIfExists
 * @param {Path} path The path to the file to check.
 * @returns {boolean} Whether the file exists or not.
 */
export const checkIfExists = (path: Path): boolean => {
  try {
    const stat = statSync(path);
    return stat.isFile();
  } catch (error) {
    if (error instanceof Error && 'code' in error) {
      if (error.code !== 'ENOENT') {
        console.error(
          `Error checking file status for path "${path}": ${error.message}`,
        );
      }
    } else {
      console.error(`Error checking file status for path "${path}":`, error);
    }
    return false;
  }
};