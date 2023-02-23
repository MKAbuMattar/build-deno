import type { Path } from '../types/index.ts';

/**
 * @description
 * Joins multiple parts of a path together.
 *
 * @function
 * @name join
 * @param {Path[]} parts The path parts to join.
 * @returns {string} The joined path.
 */
export const join = (...parts: Path[]): string =>
  parts.join('/').replace(/\/\//g, '/');
