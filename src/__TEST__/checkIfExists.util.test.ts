import { checkIfExists } from '../utils/checkIfExists.util';
import { join } from '../utils/join.util';

describe('checkIfExists', () => {
  const projectPath = join(__dirname).replace('/src/__TEST__', '');

  test('returns true when a file exists at the path', () => {
    expect(
      checkIfExists(`${projectPath}/src/__TEST__/checkIfExists.util.test.ts`),
    ).toBe(true);
  });

  test('returns false when a file does not exist at the path', () => {
    expect(checkIfExists('./test/nonexistentfile.txt')).toBe(false);
  });

  test('returns false and logs an error when an error occurs', () => {
    console.error = jest.fn();
    expect(checkIfExists('')).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });
});
