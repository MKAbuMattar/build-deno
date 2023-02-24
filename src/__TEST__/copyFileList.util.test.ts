import { copyFileList } from '../utils/copyFileList.util';
import { join } from '../utils/join.util';

describe('copyFileList', () => {
  const projectPath = join(__dirname).replace('/src/__TEST__', '');
  const projectRoot = `${projectPath}`;
  const denoSrcRoot = `${projectPath}/playground/test`;

  it('copies a single file', async () => {
    const files = [{ from: 'src/index.ts', to: 'index.ts' }];

    await copyFileList(projectRoot, denoSrcRoot, files);

    // Check that index.ts exists in playground/test
    // You can use your preferred method to check file existence
  });

  it('copies multiple files', async () => {
    const files = [
      { from: 'src/index.ts', to: 'index.ts' },
      { from: 'src/core/build.core.ts', to: 'build.core.ts' },
    ];

    await copyFileList(projectRoot, denoSrcRoot, files);

    // Check that file1.ts and file2.ts exist in deno/src
    // You can use your preferred method to check file existence
  });

  it('throws an error if there is an error copying files', async () => {
    const files = [{ from: 'src/non-existent-file.ts', to: 'file1.ts' }];

    await expect(
      copyFileList(projectRoot, denoSrcRoot, files),
    ).rejects.toThrow();

    // You can also check that the error message contains the expected message
  });
});
