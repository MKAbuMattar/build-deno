import { getProjectPaths } from '../utils/getProjectPaths.util';

describe('getProjectPaths', () => {
  it('returns the correct project paths', () => {
    const nodeSrcRootDir = 'src';
    const denoSrcRootDir = 'dist';
    const projectPaths = getProjectPaths(nodeSrcRootDir, denoSrcRootDir);

    expect(projectPaths).toEqual({
      projectRoot: process.cwd(),
      nodeSrcRoot: `${process.cwd()}/${nodeSrcRootDir}`,
      denoSrcRoot: `${process.cwd()}/${denoSrcRootDir}`,
    });
  });
});
