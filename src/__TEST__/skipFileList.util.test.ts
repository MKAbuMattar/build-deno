import { join } from '../utils/join.util';
import { skipFileList } from '../utils/skipFileList.util';

describe('skipFileList', () => {
  const projectPath = join(__dirname).replace('/src/__TEST__', '');
  const sourceDir = ``;
  const outDir = `${projectPath}/playground/test`;

  test('returns an empty array when no files are skipped', () => {
    const fileList = undefined;
    const result = skipFileList(sourceDir, outDir, fileList);
    expect(result).toEqual([]);
  });

  test('returns the correct absolute paths when files are skipped', () => {
    const fileList = [
      { dir: 'dir1', name: 'file1.txt' },
      { dir: 'dir2', name: 'file2.txt' },
    ];
    const result = skipFileList(sourceDir, outDir, fileList);
    expect(result).toEqual([
      `${projectPath}/dir1/file1.txt`,
      `${projectPath}/dir2/file2.txt`,
    ]);
  });
});
