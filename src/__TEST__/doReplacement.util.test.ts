import type { ChangePackage } from '../types';
import { doReplacement } from '../utils/doReplacement.util';
import { join } from '../utils/join.util';

describe('getProjectPaths', () => {
  const projectPath = join(__dirname).replace('/src/__TEST__', '');

  test('replaces file target with its .ts extension', () => {
    const nodePath = `${projectPath}/src/index.ts`;
    const line = "import { build } from './core/build.core';";
    const target = './core/build.core';
    const changePackage: ChangePackage[] = [];

    const result = doReplacement(nodePath, line, target, changePackage);

    expect(result).toEqual("import { build } from './core/build.core.ts';");
  });

  test('returns original line if no replacements found', () => {
    const nodePath = `${projectPath}/src/index.ts`;
    const line = "import { build } from './core/build.core';";
    const target = './core/build.core.ts';
    const changePackage: ChangePackage[] = [];

    const result = doReplacement(nodePath, line, target, changePackage);

    expect(result).toEqual(line);
  });
});
