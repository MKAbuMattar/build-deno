import type { Path } from '../types';

/**
 * @function
 * @name join
 * @description
 * Joins multiple parts of a path together.
 * @param {Path[]} parts The path parts to join.
 * @returns {string} The joined path.
 */
export const join = (...parts: Path[]): string =>
  parts.join('/').replace(/\/+/g, '/').replace(/\/$/, '');
