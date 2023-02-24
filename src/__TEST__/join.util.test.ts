import { join } from '../utils/join.util';

describe('join', () => {
  test('should join path parts with forward slashes', () => {
    const result = join('foo', 'bar', 'baz');
    expect(result).toEqual('foo/bar/baz');
  });

  test('should remove duplicate slashes in the path', () => {
    const result = join('/foo', '/bar/', '/baz/');
    expect(result).toEqual('/foo/bar/baz');
  });

  test('should handle empty path parts', () => {
    const result = join('', 'foo', '', 'bar');
    expect(result).toEqual('/foo/bar');
  });
});
