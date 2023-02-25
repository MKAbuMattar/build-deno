import type { ChangePackage, Path } from '../types';

/**
 * @description
 * Find the replacement package for a given package. If the package is not in the
 * change package list, then return the original package.
 *
 * @function
 * @name findReplacement
 * @param {Path} line The line to replace.
 * @param {Path} target The package to replace.
 * @param {ChangePackage[]} changePackage The list of packages to change.
 * @returns {Path | undefined} The package to replace with, or undefined if not found.
 */
export const findReplacement = (
  line: Path,
  target: Path,
  changePackage?: ChangePackage[],
): Path | undefined => {
  if (!changePackage || changePackage.length === 0 || line === target)
    return undefined;

  const change = changePackage.find((change) => {
    return change.byPackageName
      ? change.package === target
      : change.package === line;
  });

  return change?.replace ?? undefined;
};
