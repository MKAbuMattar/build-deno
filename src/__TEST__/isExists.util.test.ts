import { isExists } from '../utils/isExists.util';
import { join } from '../utils/join.util';

describe('isExists', () => {
  const projectPath = join(__dirname).replace('/src/__TEST__', '');

  test('returns true when a file exists at the path', () => {
    expect(isExists(`${projectPath}/src/__TEST__/isExists.util.test.ts`)).toBe(
      true,
    );
  });

  test('returns false when a file does not exist at the path', () => {
    expect(isExists('./test/nonexistentfile.txt')).toBe(false);
  });

  test('returns false and logs an error when an error occurs', () => {
    console.error = jest.fn();
    expect(isExists('')).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });
});
