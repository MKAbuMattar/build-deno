import { dirname, extname } from 'path';

import type { ChangePackage, Path } from '../types';
import { findReplacement } from './findReplacement.util';
import { isExists } from './isExists.util';
import { join } from './join.util';

/**
 * @function
 * @name doReplacement
 * @description
 * Replace the target in the line with the replacement.
 * If the target is a directory, then replace the target with the target/index.ts.
 * If the target is a file, then replace the target with the target.ts.
 * @param {Path} nodePath The nodePath of the target to be replaced.
 * @param {Path} line  The line to modify.
 * @param {Path} target The target string to replace.
 * @param {ChangePackage[]} changePackage The changePackage to use.
 * @returns {string} The modified line.
 */
export const doReplacement = (
  nodePath: Path,
  line: Path,
  target: Path,
  changePackage: ChangePackage[],
): string => {
  const replacement = findReplacement(line, target, changePackage);
  if (replacement !== undefined) {
    return replacement;
  }

  const targetNodePath = join(dirname(nodePath), target);
  const targetNodePathIfFile = targetNodePath + '.ts';
  const targetNodePathIfDir = join(targetNodePath, 'index.ts');

  if (isExists(targetNodePathIfFile)) {
    if (extname(targetNodePath) !== '.ts') {
      const newTarget = target + '.ts';
      return line.replace(target, newTarget);
    }
  }

  if (isExists(targetNodePathIfDir)) {
    const newTarget = join(target, 'index.ts');
    return line.replace(target, newTarget);
  }

  return line;
};
