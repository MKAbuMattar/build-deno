import { build } from '../core/build.core';

describe('build', () => {
  test('build function replaces import paths as expected', async () => {
    // Set up test data
    const options = {
      root: '',
      rootDir: 'src',
      outDir: 'playground/test/build',
      changePackage: [
        {
          package: 'import { join as joinPath } from \'path\';',
          replace: 'import { join as joinPath } from \'npm:path\';',
        },
      ],
    };

    // Call the function being tested
    await build(options);

    // Assert that the function did what we expected
  });

  test('build function skips files as expected', async () => {
    // Set up test data
    const options = {
      root: '',
      rootDir: 'src',
      outDir: 'playground/test/build',
      skipFile: [
        {
          dir: 'src/core',
          file: 'build.core.ts',
        },
      ],
    };

    // Call the function being tested
    await build(options);

    // Assert that the function did what we expected
  });
});
