import { ChangePackage } from '../types';
import { findReplacement } from '../utils/findReplacement.util';

describe('findReplacement', () => {
  const changePackage: ChangePackage[] = [
    {
      package: `import { new-package } from 'new-package';`,
      replace: `import { new-package } from 'npm:new-package';`,
    },
    {
      byPackageName: true,
      package: 'some-package',
      replace: 'another-package',
    },
  ];

  test('returns undefined if change package is empty', () => {
    expect(findReplacement('some-line', 'some-package', [])).toBeUndefined();
  });

  test('returns undefined if line and target are the same', () => {
    expect(
      findReplacement('some-package', 'some-package', changePackage),
    ).toBeUndefined();
  });

  test('returns undefined if change package is undefined', () => {
    expect(
      findReplacement('some-line', 'some-package', [
        // @ts-ignore
        {
          package: `import { new-package } from 'new-package';`,
        },
      ]),
    ).toBeUndefined();
  });

  test('returns the correct replacement', () => {
    expect(
      findReplacement(
        `import { new-package } from 'new-package';`,
        'original-package',
        changePackage,
      ),
    ).toEqual(`import { new-package } from 'npm:new-package';`);
    expect(
      findReplacement('some-package', 'some-package', changePackage),
    ).toBeUndefined();
    expect(findReplacement('some-line', 'some-package', changePackage)).toEqual(
      'another-package',
    );
  });
});
