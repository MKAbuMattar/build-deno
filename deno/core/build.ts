import { readdir, readFile, mkdir, writeFile } from 'npm:fs/promises';
import { dirname } from 'npm:path';
import type { Path, Options } from '../types/index.ts';
import { copyFileList } from '../utils/copyFileList.util.ts';
import { join } from '../utils/join.util.ts';
import { skipFileList } from '../utils/skipFileList.util.ts';
import { doReplacement } from '../utils/doReplacement.util.ts';
import { getProjectPaths } from '../utils/getProjectPaths.util.ts';

/**
 * @description
 * Builds the Deno source code from the Node source code,
 * copies files from the Node source code to the Deno source code,
 * changes the import paths, and skips files.
 *
 * @async
 * @function
 * @name build
 * @param {Options} options An object containing the following properties:
 * @param {Path} options.root The root directory.
 * @param {Path} options.rootDir The directory of the Node source code.
 * @param {Path} options.outDir The directory of the Deno source code.
 * @param {ChangePackage[]} [options.changePackage] An array of package names to change the import path for.
 * @param {SkipFile[]} [options.skipFile] An array of file paths to skip during the build.
 * @param {CopyFiles[]} [options.copyFiles] An array of file paths to copy from the Node source code to the Deno source code.
 * @returns {Promise<void>} A promise that resolves when the build is complete.
 */
export const build = async ({
  root,
  rootDir,
  outDir,
  changePackage = [],
  skipFile = [],
  copyFiles = [],
}: Options): Promise<void> => {
  const { projectRoot, nodeSrcRoot, denoSrcRoot } = getProjectPaths(
    rootDir,
    outDir,
  );

  const skipList: Path[] = skipFileList(rootDir, outDir, skipFile);

  const build = async (root: Path): Promise<void> => {
    const entries = await readdir(join(nodeSrcRoot, root), {
      withFileTypes: true,
      encoding: 'utf-8',
    });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        await build(join(root, entry.name));
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        const nodePath = join(nodeSrcRoot, root, entry.name);
        const denoPath = join(denoSrcRoot, root, entry.name);

        if (skipList.includes(nodePath)) {
          continue;
        }

        const nodeSource = await readFile(nodePath, { encoding: 'utf-8' });

        const denoSource = nodeSource.replace(
          /^(?:import|export)[\s\S]*?from\s*['"]([^'"]*)['"];$/gm,
          (line, target) => {
            return doReplacement(nodePath, line, target, changePackage);
          },
        );

        await mkdir(dirname(denoPath), { recursive: true });
        await writeFile(denoPath, denoSource, { encoding: 'utf-8' });
      }
    }
  };

  await build(root);

  await writeFile(
    join(denoSrcRoot, 'mod.ts'),
    'export * from "./index.ts";\n',
    {
      encoding: 'utf-8',
    },
  );

  await copyFileList(projectRoot, denoSrcRoot, copyFiles);
};
